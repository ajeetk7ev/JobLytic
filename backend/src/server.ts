import express from 'express';
import dtoenv from 'dotenv';
dtoenv.config();
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes'
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Server is working fine")
})

app.use("/api/auth", authRoutes);
app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`)
})