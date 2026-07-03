import logging
import os

# Create logs folder if it doesn't exist
os.makedirs("logs", exist_ok=True)

logging.basicConfig(
    filename="logs/pipeline.log",
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s"
)

logger = logging.getLogger(__name__)


def log_info(message):
    logger.info(message)


def log_error(message):
    logger.error(message)


if __name__ == "__main__":
    log_info("Retail Sales Intelligence Pipeline Started")
    log_info("Database Connected")
    log_info("Reports Generated Successfully")
    log_info("Forecast Completed")

    print("Logs written successfully.")