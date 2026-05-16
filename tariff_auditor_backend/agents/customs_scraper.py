from crewai import Agent, LLM
from prompts.agent_prompts import CUSTOMS_SCRAPER_PROMPT
from tools.scraper_tools import fetch_tariff_rate, fetch_regulation_updates, fetch_case_studies, check_sanctions
from tools.fta_tools import check_fta_eligibility
from config import settings
import os


def get_gemini_llm():
    """Initialize Gemini LLM for CrewAI via litellm's Google AI Studio route."""
    # Set env var so litellm uses Google AI Studio (API key), NOT Vertex AI (ADC)
    os.environ["GEMINI_API_KEY"] = settings.gemini_api_key
    return LLM(
        model="gemini/gemini-3.1-flash-lite-preview",
        temperature=0.1,
        api_key=settings.gemini_api_key,
        num_retries=3,
    )


def create_customs_scraper_agent() -> Agent:
    """Create the Customs Scraper Agent powered by Gemini."""
    return Agent(
        role="Customs Scraper Agent",
        goal="Retrieve current, authoritative regulatory data for given product and destination country.",
        backstory=CUSTOMS_SCRAPER_PROMPT,
        llm=get_gemini_llm(),
        tools=[
            fetch_tariff_rate,
            fetch_regulation_updates,
            fetch_case_studies,
            check_sanctions,
            check_fta_eligibility,
        ],
        verbose=True,
        allow_delegation=False,
        max_iter=5,
    )
