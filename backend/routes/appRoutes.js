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

//READ route for doctor to check his profile 
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
router.get("/my_day/:doc_id", async(req,res)=>{
    const{ doc_id } = req.params;
    try{ 
        const day_schedule = await sql `
        SELECT start_time, end_time, pt_id, name,date::timestamptz AT TIME ZONE 'Asia/Kolkata' as date, (CURRENT_DATE-dob)/365 AS age,gender 
        FROM appointment NATURAL JOIN patient
        WHERE doc_id = ${doc_id}  ORDER BY date, start_time
        `;
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
        console.log("Patient Registered Successfully",newPatient[0]);
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
        if(patient.length === 0){
            console.log("Check Your Credentials");
            return res.status(401).json({success:false, message:"Check Your Credentials"});
        }
        console.log("Logged In successfully", patient[0]);
        res.status(201).json({success: true, data: patient[0]});
    }catch(error){
        console.log("Logging Error", error);
        res.status(500).json({success:false, message:"Internal Server Error"});
    }
});

//route for pateint to get his profile details
router.get('/pt_profile/:pt_id', async(req,res)=>{
    try{
        const {pt_id} = req.params;
        const pt = await sql`
            SELECT * FROM patient WHERE pt_id = ${pt_id}    
        `;
        console.log("Fetched Patient Profile",);
        res.status(200).json({success:true,data:pt[0]});
    }
    catch(error){
        console.log("Error in fetching profile",error);
        res.status(500).json({success:false, message:"Server Error"});
    }
})
//route for patient to update his profile
router.put("/pt_update/:pt_id", async(req,res)=>{
    try{
        const {pt_id} = req.params;
        const {pt_name, gender, dob, phone, email} = req.body;
        const updated_ptProfile = await sql`
            UPDATE patient SET name = ${pt_name},gender = ${gender}, dob = ${dob},
            phone = ${phone}, email = ${email} 
            WHERE pt_id = ${pt_id} RETURNING *
        `;
        console.log("Profile Updated Successfully",updated_ptProfile[0]);
        res.status(201).json({success:true, data:updated_ptProfile[0]});
    }catch(error){
        console.log("Error in Updating Profie",error);
        res.status(500).json({success:false, message:"Internal Server Error"});
    }
})

//route for patient to fetch his slots
router.get("/pt_slot/:pt_id",async(req,res)=>{
    const {pt_id} = req.params;
    try{
        const apt_detail = await sql`
            SELECT apt_id, name,start_time,status,date::timestamptz AT TIME ZONE 'Asia/Kolkata' as date FROM appointment 
            NATURAL JOIN doctor WHERE pt_id = ${pt_id}  order by date
        `;
        res.status(200).json({success:true, data:apt_detail});
    }catch(error){
        res.status(500).json({success:false,message:"Internal Server Error"});
    }
})

//route for patient to delete apointment
router.delete("/delete_apt/:apt_id",async(req,res)=>{
    const {apt_id} = req.params;
    try{
        const deleted_apt = await sql`
        DELETE FROM appointment WHERE apt_id = ${apt_id} RETURNING *
        `;
        console.log("Appointment Deleted Successfully",deleted_apt[0]);
        res.status(200).json({success:true, data:deleted_apt[0]});

    }catch(error){
        console.log("Error in deleting Apointment",error);
        res.status(500).json({success:false,message:"Internal Server Error"});
    }
})

//route for appointment booking
router.post("/book_appointment/:doc_id/:pt_id", async(req,res)=>{
    const{doc_id,pt_id} = req.params;
    const{date,start_time,remarks} = req.body;
        if(!doc_id || !pt_id){
            return res.status(401).json({success:false, message:"Please provide all query parameters"});
        }
    try{
        const appointment = await sql`
        INSERT INTO appointment(doc_id, pt_id, date, start_time,remarks) 
        VALUES(${doc_id},${pt_id},${date},${start_time},${remarks})
        RETURNING *
        `;
        console.log("Appoitment Booked Successfully",appointment);
        res.status(201).json({success:true,data:appointment[0]});

    } catch(error){
        console.log("Error in booking appoitment", error);
        res.status(500).json({success:false, message:"Internal Server Error"});
    }
});

router.get("/busy_slots/:date/:doc_id", async(req,res)=>{
    const {date, doc_id} = req.params;
    try{
        const busy_slots = await sql`
        SELECT start_time FROM appointment 
        WHERE date = ${date} AND doc_id = ${doc_id}
        `;
        console.log("Busy Slots Fetched Successfully",busy_slots);
        res.status(200).json({success:true, data:busy_slots});
    } catch(error){
        console.log("Error in getting Busy Slots", error);
        res.status(500).json({success:false, message:"Internal Server Error"});
    }
});

export default router;