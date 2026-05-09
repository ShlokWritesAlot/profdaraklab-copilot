import re

class HLSAdvisor:
    def __init__(self):
        pass

    def parse_synthesis_report(self, report_text: str):
        metrics = {}
        lines = report_text.split('\n')
        
        for i, line in enumerate(lines):
            # Parse Latency
            if "Latency (cycles):" in line:
                # Look for the line with digits a few lines down
                for j in range(i+1, min(i+5, len(lines))):
                    match = re.findall(r'(\d+)', lines[j])
                    if len(match) >= 2:
                        metrics['latency_min'] = match[0]
                        metrics['latency_max'] = match[1]
                        break
            
            # Parse Utilization
            if "Total" in line and ("BRAM_18K" in report_text or "DSP48E" in report_text):
                # Check if this is the total line of the utilization table
                parts = [p.strip() for p in line.split('|') if p.strip()]
                if len(parts) >= 5 and parts[0] == "Total":
                    metrics['bram'] = parts[1]
                    metrics['dsp'] = parts[2]
                    metrics['ff'] = parts[3]
                    metrics['lut'] = parts[4]

        return metrics

    def suggest_optimizations(self, code_snippet: str):
        suggestions = []
        
        # Strip comments for checking
        clean_code = re.sub(r'//.*?\n|/\*.*?\*/', '', code_snippet, flags=re.DOTALL)
        
        if "for" in clean_code and "HLS PIPELINE" not in clean_code:
            suggestions.append({
                "type": "HLS Pragma",
                "message": "Consider adding #pragma HLS PIPELINE to improve Initiation Interval (II).",
                "impact": "Reduces latency and increases throughput."
            })

        if "float" in clean_code:
            suggestions.append({
                "type": "Fixed Point",
                "message": "Floating point detected. Use ap_fixed<W,I> to reduce DSP and LUT usage.",
                "resource_impact": "Significantly reduces DSP48E demand."
            })

        if "for" in clean_code and "UNROLL" not in clean_code:
            suggestions.append({
                "type": "Loop Unrolling",
                "message": "Consider #pragma HLS UNROLL for loops with low iteration count or critical paths.",
                "impact": "Increases parallelism at the cost of more resources."
            })

        return suggestions

    def optimize_code(self, code_snippet: str):
        from core.llm import llm_manager
        
        prompt = f"""
        You are a Vitis HLS Optimization Expert. 
        Optimize the following HLS C++ code for FPGA deployment.
        
        Requirements:
        1. Rename the function to include '_optimized'.
        2. Replace 'float' with 'ap_fixed<16,8>' or a suitable typedef 'fixed_t'.
        3. Add '#include <ap_fixed.h>' if not present.
        4. Add '#pragma HLS PIPELINE II=1' to suitable loops.
        5. Add '#pragma HLS INTERFACE' (m_axi or s_axilite) for top-level arguments if it looks like a kernel.
        6. Remove or update outdated comments.
        7. Maintain clean indentation and professional HLS coding style.
        
        Input Code:
        ```cpp
        {code_snippet}
        ```
        
        Respond with ONLY the optimized code block and a brief explanation of the changes and their FPGA impact (latency, resources).
        Format your response as:
        ---CODE---
        [Optimized Code]
        ---EXPLANATION---
        [Explanation]
        """
        
        try:
            response = llm_manager.generate_code_suggestions(prompt)
            
            if "---CODE---" in response and "---EXPLANATION---" in response:
                parts = response.split("---EXPLANATION---")
                code_part = parts[0].replace("---CODE---", "").strip()
                # Clean up markdown code blocks if the LLM added them
                code_part = re.sub(r'^```cpp\n|```$', '', code_part, flags=re.MULTILINE).strip()
                explanation = parts[1].strip()
                return code_part, explanation
            else:
                # Fallback if LLM doesn't follow format strictly
                return response, "LLM generated an optimized version. Review the changes for FPGA resource tradeoffs."
        except Exception as e:
            return code_snippet, f"Error calling local LLM for optimization: {str(e)}"

hls_advisor = HLSAdvisor()
