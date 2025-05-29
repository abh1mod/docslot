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
    const {doc_name, specialization, email} = req.body;

    if(!doc_name || !specialization || !email ){
        return res.status(400).json({success:false, message:"Please Enter All Fields"})
    }
    try{
        const newDoctor = await sql`
        INSERT INTO doctor(name, specialization, email) 
        VALUES(${doc_name},${specialization},${email})
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
router.get("/my_day", async(req,res)=>{
    const{ doc_id, date } = req.query;
    try{ 
        const day_schedule = await sql `
        SELECT start_time, end_time, pt_id, name, (CURRENT_DATE-dob)/365 AS age,gender 
        FROM appointment NATURAL JOIN patient
        WHERE doc_id = ${doc_id} AND date = ${date} ORDER BY start_time
        `
        console.log("Schedule fetched Successfully",day_schedule);
        res.status(200).json({success:true, data:day_schedule});
    } catch(error){
        console.log("Error in getting Details ",error);
        res.status(500).json({success:false, message:"Internal Server Error"});
    }
});

//route to delete doctor account
router.delete("/remove_acc/:id", async(req,res)=>{
    const doctor_id = req.params.id;
    try{ 
        const deleted_doc = await sql `
        DELETE FROM doctor WHERE doc_id = ${doctor_id}
        RETURNING *`;
        console.log("Your Account has been Deleted ", deleted_doc)
        res.status(200).json({success:true, data:deleted_doc[0]});
    } catch(error){
        console.log("Error Deleting Account",error);
        res.status(500).json({success:false, message:"Internal Server Error"});
    }
});

//route to register patient
router.post("/pt_register", async(req,res)=>{
    const {pt_name, gender,dob,phone,email} = req.body;

    if(!pt_name || !gender || !dob || !phone || !email){
        return res.status(400).json({success:false, message:"Please Enter All Fields"})
    }
    try{
        const newPatient = await sql`
            INSERT INTO patient(name,gender,dob,phone,email) 
            VALUES(${pt_name},${gender},${dob},${phone},${email})
            RETURNING *
        `;
        console.log("Patient Registered Successfully",newPatient);
        res.status(201).json({success:true, data:newPatient[0]});
    }
    catch(error){
        console.log("Error in Registration", error);
        res.status(500).json({success:false, message:"Internal Server Error"});
    }
});

//route for appointment booking
router.post("/book_appointment", async(req,res)=>{
    const{doc_id,pt_id} = req.query;
    const{date,start_time, end_time} = req.body;
        if(!doc_id || !pt_id){
            return res.status(401).json({success:false, message:"Please provide all query parameters"});
        }
    try{
        const appointment = await sql`
        INSERT INTO appointment(doc_id, pt_id, date, start_time, end_time) 
        VALUES(${doc_id},${pt_id},${date},${start_time},${end_time})
        RETURNING *
        `;
        console.log("Appoitment Booked Successfully",appointment);
        res.status(201).json({success:true,data:appointment[0]});

    } catch(error){
        console.log("Error in booking appoitment", error);
        res.status(500).json({success:false, message:"Internal Server Error"});
    }
});

export default router;