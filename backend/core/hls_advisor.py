import re

class HLSAdvisor:
    def __init__(self):
        pass

    def parse_synthesis_report(self, report_text: str):
        # Basic regex to extract latency and resources
        metrics = {}
        
        latency_match = re.search(r"Latency \(cycles\):\s*\|\s*min\s*\|\s*max\s*\|\s*(\d+)\s*\|\s*(\d+)", report_text)
        if latency_match:
            metrics['latency_min'] = latency_match.group(1)
            metrics['latency_max'] = latency_match.group(2)

        resources = re.search(r"Utilization Estimates\s+.*\s+Name\s+\|\s+BRAM_18K\|\s+DSP48E\s+\|\s+FF\s+\|\s+LUT\s+\|.*\s+\|Total\s+\|\s+(\d+)\|\s+(\d+)\|\s+(\d+)\|\s+(\d+)\|", report_text, re.DOTALL)
        if resources:
            metrics['bram'] = resources.group(1)
            metrics['dsp'] = resources.group(2)
            metrics['ff'] = resources.group(3)
            metrics['lut'] = resources.group(4)

        return metrics

    def suggest_optimizations(self, code_snippet: str):
        suggestions = []
        
        if "for" in code_snippet and "PIPELINE" not in code_snippet:
            suggestions.append({
                "type": "HLS Pragma",
                "message": "Consider adding #pragma HLS PIPELINE to improve Initiation Interval (II).",
                "impact": "Reduces latency and increases throughput."
            })

        if "float" in code_snippet:
            suggestions.append({
                "type": "Fixed Point",
                "message": "Floating point detected. Use ap_fixed<W,I> to reduce DSP and LUT usage.",
                "resource_impact": "Significantly reduces DSP48E demand."
            })

        if "if" in code_snippet and "array" in code_snippet:
            suggestions.append({
                "type": "Memory Partition",
                "message": "Nested loops with array access might benefit from #pragma HLS ARRAY_PARTITION.",
                "latency_impact": "Avoids memory port bottlenecks."
            })

        return suggestions

hls_advisor = HLSAdvisor()
