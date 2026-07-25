import { success } from "zod";

export function validate(schema) {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      const formattedErrrors = error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
      }));
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: formattedErrrors,
      });
    }
  };
}
