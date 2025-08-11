import express from "express";
import connectDB from "./config/database";
import router from "./routes/lineaRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(express.json());

app.use("/api/lineas", router);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const startServer = async () => {
    try {
        await connectDB();
        console.log("Database connected successfully");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
}

startServer();

export default app;