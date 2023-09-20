// import logger, { devLogger } from "../utils.js";

export const loggerController = () => {
    try {
        logger.debug("Debug");
        logger.http("Http");
        logger.info("Info");
        logger.warning("Warning");
        logger.error("Error");
        logger.fatal("Fatal");
        res.json({ status: "success" });
      } catch (error) {
        devLogger.fatal(error.message);
        res.status(500).json({ status: error.message });
      }
}