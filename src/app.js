import express from "express";
import studentRoutes from "./routes/student.routes.js";
import errorHandler from "./middlewares/error.middleware.js";
import userRouter from "./routes/user.routes.js";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import dashboardRoutes from "./routes/dashboard.routes.js";
const app = express();

app.use(helmet());

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Student Management API is running 🚀");
});

app.use("/api/students", studentRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/users", userRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

export default app;
