import express from "express";
import {sql} from "../config/db.js"
const router = express.Router();

//routes for patient to get all doctors list
router.get("/fetch_all", async(req,res)=>{
    try{
        const doctors = await sql`
            SELECT * FROM doctor
        `;
        console.log("fetched doctors",doctors);
        res.status(200).json({success:true, data:doctors})
    } catch(error){
        console.log("Error in getting List", error);
        res.status(500).json({success:false, message:"Internal Server Error"});
    }
});

// route for doctor to register
router.post("/doc_register", async(req,res)=>{
    const {doc_name, specialization, phone, email, room_no} = req.body;

    if(!doc_name || !specialization || !phone || !email || !room_no){
        return res.status(400).json({success:false, message:"Please Enter All Fields"})
    }
    try{
        const newDoctor = await sql`
        INSERT INTO doctor(name, specialization, phone,email, room_no) 
        VALUES(${doc_name},${specialization},${phone},${email},${room_no})
        RETURNING *
        `;
        console.log("You Are Registered Successfully", newDoctor);
        res.status(201).json({success: true, data: newDoctor[0]});
    }catch(error){
        console.log("Error in Registration", error);
        res.status(500).json({success:false, message:"Internal Server Error"});
    }
});

//route for doctor to check his slot in a day
router.get("/my_day/:id", async(req,res)=>{
    const doctor_id = req.params.id;
    // const { date } = req.query;
    try{ // dummy query to check whether its working
        const doc = await sql `
        SELECT * FROM doctor WHERE doctor_id = ${doctor_id}
        `
        res.status(200).json({success:true, data:doc[0]});
    } catch(error){
        console.log("Error in getting Details ",error);
        res.status(500).json({success:false, message:"Internal Server Error"});
    }
});

router.delete("/remove_acc/:id", async(req,res)=>{
    const doctor_id = req.params.id;
    try{ 
        const doc = await sql `
        DELETE FROM doctor WHERE doctor_id = ${doctor_id}
        `;
        console.log("Your Account has been Deleted ", doc)
        res.status(200).json({success:true, data:doc[0]});
    } catch(error){
        console.log("Error Deleting Account",error);
        res.status(500).json({success:false, message:"Internal Server Error"});
    }
});

export default router;