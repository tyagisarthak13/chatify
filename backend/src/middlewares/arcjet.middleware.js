import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

const arcjetProtection = async (req, res, next) => {
  try {
    const decision = await aj.protect(req);

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res
          .status(429)
          .json({ message: "Rate limit exceeded. Please try again later." });
      } else if (decision.reason.isBot()) {
        return res.status(403).json({ message: "Bot action denied." });
      } else {
        return res
          .status(403)
          .json({ message: "Access denied by security policy" });
      }
    }

    // check for spoofed bots - bots that acts like human
    if (decision.results.some(isSpoofedBot)) {
      return res.status(403).json({
        error: "Spoofed bot activity",
        message: "Malicious bot activity detected",
      });
    }

    next();
  } catch (error) {
    console.log("Arcjet Protection Error:", error);
    next();
  }
};

export default arcjetProtection;
