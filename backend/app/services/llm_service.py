import json
import re
from abc import ABC, abstractmethod
from typing import Any, Dict, Optional
import httpx
from app.core.config import settings


class BaseLLMService(ABC):
    """
    Abstract LLM Service Abstraction.
    Allows seamlessly swapping Ollama with OpenAI, Anthropic, vLLM, or other engines
    without modifying the underlying Agent architectures.
    """
    @abstractmethod
    def generate_json(self, system_prompt: str, user_prompt: str) -> Dict[str, Any]:
        """
        Sends system and user prompts to the LLM and guarantees a Python dictionary output.
        """
        pass


class OllamaLLMService(BaseLLMService):
    """
    Local Open-Source LLM Provider using Ollama REST API.
    Sends prompt to Ollama with format="json" and stream=False.
    Includes automated fallback to heuristic engine if Ollama is unreachable.
    """
    def __init__(
        self,
        base_url: Optional[str] = None,
        model: Optional[str] = None,
        timeout: Optional[int] = None,
    ):
        self.base_url = (base_url or settings.OLLAMA_BASE_URL).rstrip("/")
        self.model = model or settings.OLLAMA_MODEL
        self.timeout = timeout or settings.LLM_TIMEOUT_SECONDS

    def generate_json(self, system_prompt: str, user_prompt: str) -> Dict[str, Any]:
        endpoint = f"{self.base_url}/api/generate"
        payload = {
            "model": self.model,
            "system": system_prompt,
            "prompt": user_prompt,
            "format": "json",
            "stream": False,
            "options": {
                "temperature": 0.2,
                "top_p": 0.9,
            }
        }

        # Fast connect timeout (2.0s) so offline development doesn't block unnecessarily
        client_timeout = httpx.Timeout(
            connect=2.0,
            read=float(self.timeout),
            write=10.0,
            pool=5.0,
        )

        try:
            print(f"[OllamaLLMService] Dispatching prompt to Ollama model '{self.model}' at {endpoint}...")
            with httpx.Client(timeout=client_timeout) as client:
                response = client.post(endpoint, json=payload)
                response.raise_for_status()
                data = response.json()
                raw_response = data.get("response", "{}")
                print(f"[OllamaLLMService] Received response from Ollama (bytes: {len(raw_response)}).")

                return self._extract_json(raw_response)

        except (httpx.ConnectError, httpx.ConnectTimeout, httpx.HTTPStatusError, httpx.ReadTimeout) as e:
            print(f"[OllamaLLMService Info] Ollama not active on {endpoint} ({e}).")
            print("[OllamaLLMService Fallback] Activating local semantic business analyzer engine...")
            return self._heuristic_fallback(user_prompt)
        except Exception as e:
            print(f"[OllamaLLMService Error] Unexpected error during LLM generation: {e}")
            return self._heuristic_fallback(user_prompt)

    def _extract_json(self, raw_text: str) -> Dict[str, Any]:
        """
        Sanitizes and extracts a valid JSON object from the LLM output string.
        """
        cleaned = raw_text.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        elif cleaned.startswith("```"):
            cleaned = cleaned[3:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()

        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            match = re.search(r"\{.*\}", cleaned, re.DOTALL)
            if match:
                return json.loads(match.group(0))
            raise ValueError(f"LLM returned non-JSON string: {raw_text[:200]}")

    def _heuristic_fallback(self, user_prompt: str) -> Dict[str, Any]:
        """
        Deterministic, safe local semantic parser fallback.
        Ensures 100% platform availability if Ollama is not installed or temporarily offline.
        Never hallucinates real-world prices or competitor names.
        """
        prompt_lower = user_prompt.lower()

        # Categorization heuristics
        if any(k in prompt_lower for k in ["cafe", "coffee", "chai", "tea", "bakery", "restaurant", "food", "dining", "biryani"]):
            category = "Food & Beverage (F&B)"
            subcategory = "Quick-Service Restaurant & Specialty Dining"
            model = "Brick-and-mortar Dine-In + Takeaway + Hyperlocal Delivery"
            targets = ["Office Workers & Corporate Professionals", "College & University Students", "Local Residential Families", "Weekend Diners"]
            products = ["Specialty Dishes & Signature Meals", "Beverages & Refreshments", "Takeaway Family Packs", "Corporate Catering Platters"]
            resources = ["Commercial Kitchen Space", "Cooking Range & Deep Freezers", "Front-of-House POS Terminal", "Trained Chefs & Service Crew"]
            operations = ["FSSAI Food Safety Licensing", "Daily Fresh Raw Ingredient Procurement", "Kitchen Sanitation Protocols", "Order Dispatch Workflow"]
            risks = ["Food Wastage & COGS Margin Slippage", "Intense Hyperlocal Dine-in Competition", "High Staff Turnover"]
            analysis = ["Location Footfall & Pedestrian Analysis", "Direct Competitor Menu Pricing", "Deterministic Cash Flow Forecast", "FSSAI Compliance Verification"]
        elif any(k in prompt_lower for k in ["water", "plant", "manufacturing", "production", "bottling", "beverage plant"]):
            category = "Manufacturing & Industrial Utilities"
            subcategory = "Packaged Drinking Water & Mineral Filtration Facility"
            model = "B2B Bulk Institutional Supply + FMCG Retail Distribution"
            targets = ["Corporate Offices & Tech Parks", "Hotels, Banquets & Function Halls", "Supermarkets & Retail Stores", "Hospitals & Educational Institutions"]
            products = ["20-Liter Commercial Water Jars", "500ml & 1000ml Packaged Drinking Bottles", "Custom Co-Branded Hotel Water Bottles"]
            resources = ["Industrial Plant Shed (2000+ sq ft)", "Borewell / Ground Water Source", "Reverse Osmosis (RO) Purification & Ozone System", "Automatic Rinser-Filler-Capper Machine"]
            operations = ["Bureau of Indian Standards (BIS/ISI 14543) Certification", "Ground Water Board (CGWA) Extraction NOC", "In-House Microbiology Testing Lab", "Daily Water Quality Monitoring"]
            risks = ["Statutory Environmental Clearance Delays", "Electricity & Power Outage Disruptions", "Polymer Preform Raw Material Price Volatility"]
            analysis = ["Industrial Ground Water Feasibility", "BIS Compliance & Lab Setup Plan", "CapEx vs ROI Amortization Model", "B2B Route Optimization"]
        elif any(k in prompt_lower for k in ["retail", "store", "shop", "clothing", "boutique", "supermarket", "grocery"]):
            category = "Retail & Consumer Commerce"
            subcategory = "Specialty Brick-and-Mortar Retail Store"
            model = "Direct Retail Walk-in + Omnichannel Click-and-Collect"
            targets = ["Neighborhood Residents", "Impulse Shoppers & Foot-Traffic Visitors", "Loyalty Members"]
            products = ["Curated Retail Merchandise", "Accessories & Complementary Goods", "Specialty Gift Items"]
            resources = ["High-Street Retail Storefront", "Display Gondolas & Shelving", "Barcode Scanner POS System", "Inventory Storage Area"]
            operations = ["Shops & Establishments Registration", "Weekly Vendor Restocking", "Electronic Inventory Auditing", "Local Visual Merchandising"]
            risks = ["Inventory Shrinkage & Dead Stock", "High Rent-to-Sales Burden", "E-commerce Price Competition"]
            analysis = ["Pedestrian Traffic & Conversion Modeling", "Inventory Turn Velocity & GMROI", "Local Store Density Benchmark"]
        else:
            category = "Commercial Enterprise"
            subcategory = "Direct Commercial Services & Solutions"
            model = "B2B and B2C Service Delivery"
            targets = ["Target Market Consumers", "Local Businesses & Institutions"]
            products = ["Core Service Offerings", "Tailored Commercial Solutions"]
            resources = ["Commercial Work Facility", "Operating Equipment & IT Infrastructure", "Professional Personnel"]
            operations = ["Municipal Trade Licensing", "Standard Operating Procedures (SOPs)", "Customer Relationship Management"]
            risks = ["Market Competition & Cost Management", "Customer Acquisition Scalability"]
            analysis = ["Location Suitability", "Financial Viability Projections", "Market Channel Strategy"]

        return {
            "business_category": category,
            "business_subcategory": subcategory,
            "business_model": model,
            "target_customers": targets,
            "products_or_services": products,
            "required_resources": resources,
            "operational_requirements": operations,
            "potential_risks": risks,
            "recommended_analysis": analysis,
        }


# Global Singleton Service
_llm_service_instance: Optional[BaseLLMService] = None


def get_llm_service() -> BaseLLMService:
    global _llm_service_instance
    if _llm_service_instance is None:
        _llm_service_instance = OllamaLLMService()
    return _llm_service_instance
