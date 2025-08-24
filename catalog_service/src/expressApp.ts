import express from "express";
import catalogRouter from "./api/catalog.routes";

const app = express();
app.use(express.json());


app.use("/",catalogRouter);

app.get("/",(req,res,next)=>{
  return res.json({msg:"message"});
});

export default app;