from typing import Optional
from pydantic import ValidationError
from app.models.business import Business
from app.schemas.analysis import BusinessUnderstandingAgentOutput
from app.services.llm_service import BaseLLMService, get_llm_service
from app.agents.prompts import (
    BUSINESS_UNDERSTANDING_SYSTEM_PROMPT,
    build_business_understanding_user_prompt,
)


class BusinessUnderstandingAgent:
    """
    Step 3: Business Understanding AI Agent.
    
    Reads user business parameters from PostgreSQL, queries the local Ollama LLM
    via the LLM service abstraction, validates the response with Pydantic,
    and returns a guaranteed structured understanding of the business concept.
    """
    def __init__(self, llm_service: Optional[BaseLLMService] = None):
        self.llm_service = llm_service or get_llm_service()

    def analyze(self, business: Business) -> BusinessUnderstandingAgentOutput:
        """
        Executes the Business Understanding pipeline for a given Business model instance.
        """
        # 1. Format inputs
        budget_val = float(business.budget) if business.budget is not None else 0.0
        owned_list = business.equipment_owned if isinstance(business.equipment_owned, list) else []

        user_prompt = build_business_understanding_user_prompt(
            business_name=business.business_name,
            description=business.description,
            budget=budget_val,
            exact_location=business.exact_location,
            nearby_places=business.nearby_places or "",
            equipment_status=business.equipment_status,
            equipment_owned=owned_list,
        )

        # 2. Invoke LLM via Service Abstraction (Ollama)
        raw_json = self.llm_service.generate_json(
            system_prompt=BUSINESS_UNDERSTANDING_SYSTEM_PROMPT,
            user_prompt=user_prompt,
        )

        # 3. Validate structured output with Pydantic
        try:
            validated_output = BusinessUnderstandingAgentOutput.model_validate(raw_json)
            return validated_output
        except ValidationError as e:
            print(f"[BusinessUnderstandingAgent Warning] Pydantic validation error: {e}")
            print("[BusinessUnderstandingAgent] Sanitizing and coercing output...")
            # Fallback with safe defaults
            return BusinessUnderstandingAgentOutput(
                business_category=raw_json.get("business_category") or "Commercial Venture",
                business_subcategory=raw_json.get("business_subcategory") or "General Business Operations",
                business_model=raw_json.get("business_model") or "Direct Commercial Service / Retail",
                target_customers=raw_json.get("target_customers") or ["Target Market Customers"],
                products_or_services=raw_json.get("products_or_services") or ["Core Business Services"],
                required_resources=raw_json.get("required_resources") or ["Operating Facility & Equipment"],
                operational_requirements=raw_json.get("operational_requirements") or ["Standard Business Operations"],
                potential_risks=raw_json.get("potential_risks") or ["Market Competition & Cost Management"],
                recommended_analysis=raw_json.get("recommended_analysis") or ["Location Analysis", "Financial Forecast"],
            )


# Singleton helper
_agent_instance: Optional[BusinessUnderstandingAgent] = None


def get_business_understanding_agent() -> BusinessUnderstandingAgent:
    global _agent_instance
    if _agent_instance is None:
        _agent_instance = BusinessUnderstandingAgent()
    return _agent_instance
