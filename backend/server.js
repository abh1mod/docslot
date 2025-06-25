import express from "express";
// helmet is security middleware to help secure the website 
// by setting various HTTP response headers
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import appRoutes from "./routes/appRoutes.js"
import cookieParser from "cookie-parser";
import { sql } from "./config/db.js";
dotenv.config();


const PORT = process.env.PORT || 3000;
const app = express();


app.use(cors({
  origin: "http://localhost:5173", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));//log requests
app.use(express.json()); // use to parse incoming data 
app.use(cors());
//cors is a browser security feature that prevents which prevent one website from using the resourses of another website
//cors is used here to handle cors errors


app.use("/api",appRoutes);

async function initDB(){
    try{
        await sql`
            SELECT * FROM doctor
        `;
        console.log("DB Initialized");
    } catch(error){
        console.log("Error in Database", error);
    }
}

initDB().then(()=>{
    app.listen(PORT, ()=>{
    console.log("Server Running on Port "+ PORT);
});
})

