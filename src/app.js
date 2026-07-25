import express from "express";
import studentRoutes from "./routes/student.routes.js";
import errorHandler from "./middlewares/error.middleware.js";
import userRouter from "./routes/user.routes.js";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import cors from "cors";

const app = express();

app.use(helmet());

app.use(express.json());

app.use("/api/students", studentRoutes);

app.use("/api/users", userRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

export default app;
