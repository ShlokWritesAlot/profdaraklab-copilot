import ollama
import json
from typing import List, Dict, Any, Generator

class LLMManager:
    def __init__(self, default_chat_model="llama3.2:1b", default_code_model="llama3.2:1b"):
        self.chat_model = default_chat_model
        self.code_model = default_code_model
        self._ensure_model_availability()

    def _ensure_model_availability(self):
        try:
            resp = ollama.list()
            # The structure is usually {'models': [{'name': '...', ...}, ...]}
            # But let's be careful
            models = resp.get('models', [])
            available_names = []
            for m in models:
                if isinstance(m, dict) and 'name' in m:
                    available_names.append(m['name'])
                elif hasattr(m, 'model'): # Some versions might use objects
                    available_names.append(m.model)
            
            print(f"Available models: {available_names}")
            
            if self.chat_model not in available_names and available_names:
                print(f"Warning: {self.chat_model} not found. Falling back to {available_names[0]}")
                self.chat_model = available_names[0]
            
            if self.code_model not in available_names and available_names:
                self.code_model = available_names[0]
        except Exception as e:
            print(f"Could not check models: {e}. Defaulting to {self.chat_model}")

    def chat(self, messages: List[Dict[str, str]], stream=False) -> Any:
        try:
            response = ollama.chat(
                model=self.chat_model,
                messages=messages,
                stream=stream
            )
            return response
        except Exception as e:
            print(f"Error in LLM chat: {e}")
            return {
                "message": {
                    "role": "assistant", 
                    "content": f"I encountered an error with the local LLM: {str(e)}. Please ensure Ollama is running and the model is pulled."
                }
            }

    def generate_code_suggestions(self, prompt: str) -> str:
        try:
            response = ollama.generate(
                model=self.code_model,
                prompt=prompt,
                options={"temperature": 0.2}
            )
            return response['response']
        except Exception as e:
            print(f"Error in LLM code generation: {e}")
            return f"Error: {e}"

    def list_models(self):
        try:
            return ollama.list()
        except Exception as e:
            return {"error": str(e)}

llm_manager = LLMManager()
