import { ResponseError } from "../errors/response-error.js";

const errorMiddleware = async (err, req, res, next) => {
  try {
    // Handle error
    if (!err) {
      console.error("Non-error object passed:", err);
      if (!res.headersSent) {
        return res
          .status(500)
          .json({
            errors: "Unknown error occurred",
          })
          .end();
      }
    }

    // Error custom
    if (err instanceof ResponseError) {
      if (!res.headersSent) {
        return res.status(err.status).json({ errors: err.message }).end();
      }
    } else {
      // Error default
      if (!res.headersSent) {
        return res
          .status(500)
          .json({
            errors: "Internal Server Error",
            message: err.message,
          })
          .end();
      }
    }
  } catch (e) {
    // Handle error at middleware
    console.error("Error in error middleware:", e);
    if (!res.headersSent) {
      return res
        .status(500)
        .json({
          errors: "Internal Server Error",
        })
        .end();
    }
  }
};

export { errorMiddleware };
