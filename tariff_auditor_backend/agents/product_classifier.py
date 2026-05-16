from crewai import Agent, LLM
from prompts.agent_prompts import PRODUCT_CLASSIFIER_PROMPT
from tools.classifier_tools import lookup_hs_code, apply_gri, calculate_duty_delta, check_dual_use
from config import settings
import os


def get_gemini_llm():
    """Initialize Gemini LLM for CrewAI via litellm's Google AI Studio route."""
    os.environ["GEMINI_API_KEY"] = settings.gemini_api_key
    return LLM(
        model="gemini/gemini-3.1-flash-lite-preview",
        temperature=0.1,
        api_key=settings.gemini_api_key,
        num_retries=3,
    )


def create_product_classifier_agent() -> Agent:
    """Create the Product Classifier Agent powered by Gemini."""
    return Agent(
        role="Product Classifier Agent",
        goal="Determine correct HS Code based on specifications and quantify financial risk.",
        backstory=PRODUCT_CLASSIFIER_PROMPT,
        llm=get_gemini_llm(),
        tools=[
            lookup_hs_code,
            apply_gri,
            calculate_duty_delta,
            check_dual_use,
        ],
        verbose=True,
        allow_delegation=False,
        max_iter=5,
    )
