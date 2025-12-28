import express from 'express';
import dotenv from "dotenv";
import authRoutes from './routes/authRoutes.routes'
import cors from "cors";
const app = express();
dotenv.config();
const PORT = process.env.PORT || 6000;

app.use(cors({origin:"*",credentials:true}))
app.use(express.json());

app.use("/auth", authRoutes);

app.listen(PORT, ()=>{
  console.log(`Server is running on port ${PORT}`);
});