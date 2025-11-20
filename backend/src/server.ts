import express from 'express';
import dtoenv from 'dotenv';
dtoenv.config();
import cookieParser from 'cookie-parser';
import cors from 'cors';
import redisClient from './config/redis';
import authRoutes from './routes/auth.routes';
import resumeRoutes from './routes/resume.routes';
import jobRoutes from "./routes/job.routes";


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:process.env.CLIENT_URL!,
    credentials:true
}))

app.get("/", (req, res) => {
    res.send("Server is working fine")
})

app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/jobs", jobRoutes);

app.listen(PORT, async () => {
    await redisClient.connect();
    console.log(`Server is running at port ${PORT}`)
})