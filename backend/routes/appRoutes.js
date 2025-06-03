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

//CREATE route for doctor to register 
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

//route for doctor to login
router.post('/doc_login', async (req, res) => {
    const {doc_id, email} = req.body;
    if(!doc_id || !email ){
        return res.status(400).json({success:false, message:"Please Enter All Fields"})
    }
    try{
        const doc = await sql`
        SELECT * FROM doctor WHERE doc_id = ${doc_id} AND email = ${email}
        `;
        if(doc.length===0){
            return res.status(401).json({success:false, message:"Check Your Credentials"});
        }
        console.log("Logged In successfully", doc);
        res.status(201).json({success: true, data: doc[0]});
    }catch(error){
        console.log("Logging Error", error);
        res.status(500).json({success:false, message:"Internal Server Error"});
    }
});

//READ route for doctor to check his profile READ
router.get('/doc_profile/:doc_id', async(req,res)=>{
    try{
        const {doc_id} = req.params;
        const doc = await sql`
            SELECT * FROM doctor WHERE doc_id = ${doc_id}    
        `;
        console.log("Fetched Doctor Profile",doc);
        res.status(200).json({success:true,data:doc[0]});
    }
    catch(error){
        console.log("Error in fetching profile",error);
        res.status(500).json({success:false, message:"Server Error"});
    }
})

//UPDATE
router.put('/doc_update/:doc_id',async(req,res)=>{
    const{doc_id} = req.params;
    const {name, specialization,phone,email,image,about_us} = req.body;
    try{
        const newProfile = await sql`
        UPDATE doctor SET name = ${name}, specialization = ${specialization}, phone = ${phone}, 
        email = ${email},image = ${image},about_us=${about_us}
        WHERE doc_id = ${doc_id} RETURNING *
        `;
        console.log("Your Profile Has been Updated", newProfile);
        res.status(201).json({success:true,data:newProfile});
    }
    catch(error){
        console.log("Error in Updating Profile",error);
        res.status(500).json({success:false,message:"Internal Server error"});
    }
})

//READ route for doctor to check his slot in a day
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

//route for patient to login
router.post('/pt_login', async (req, res) => {
    const {pt_id, email} = req.body;
    if(!pt_id || !email ){
        return res.status(400).json({success:false, message:"Please Enter All Fields"})
    }
    try{
        const patient = await sql`
        SELECT * FROM patient WHERE pt_id = ${pt_id} AND email = ${email}
        `;
        if(patient.length===0){
            return res.status(401).json({success:false, message:"Check Your Credentials"});
        }
        console.log("Logged In successfully", patient);
        res.status(201).json({success: true, data: patient});
    }catch(error){
        console.log("Logging Error", error);
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