import express from 'express';
const router = express.Router();
import {sql} from '../config/db.js';
import bcrypt from 'bcryptjs';
import sendmail from '../utils/mailtrap.config.js';
import redisClient from '../utils/redisClient.js';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import {auth, isPatient, isDoctor } from '../middleware/auth.js';
dotenv.config();

router.get("/my_profile", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not logged in" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role === "patient") {
      return res.status(200).json({
        success: true,
        role: "patient",
        data: {
          pt_id: decoded.pt_id,
          name: decoded.name,
          phone: decoded.phone,
          email: decoded.email,
          gender: decoded.gender,
          dob: decoded.dob,
          role: "patient"
        },
      });
    }

    else if (decoded.role === "doctor") {
      return res.status(200).json({
        success: true,
        role: "doctor",
        data: {
          doc_id: decoded.doc_id,
          name: decoded.name,
          specialization: decoded.specialization,
          phone: decoded.phone,
          email: decoded.email,
          image: decoded.image,
          about_us: decoded.about_us,
          role: "doctor"
        },
      });
    }


  } catch (error) {
    return res.status(500).json({ success: false, message: "Invalid or expired token" });
  }
});

router.post('/doctor/send_otp', async(req, res) => {
    let {doc_name, email} = req.body;
    if (!email) {
        return res.status(400).json({
            message: 'All fields are required'
        });
    }
    try{
        const existed = await sql`SELECT * FROM doctor WHERE email = ${email}`;
        if (existed.length>0) {
            console.log("User Already Exists, Please Proceed For Login");
            return res.status(400).json({
                success: false,
                message: 'User Already Exists, Please Proceed For Login',
                data:existed[0]
            });
        }    
        const otpSent = Math.floor(100000 + Math.random()*900000).toString();
        await redisClient.setEx(`otp:${email}`, 300,  otpSent); 

        sendmail({to: email, subject: 'Verification Code', html: `
                    <div>
                    <h1>Welcome to DocSlot</h1>
                    <p>Dear ${doc_name},</p>    
                     <p>Thank you for registering with DocSlot. To complete your registration, please verify your email address by entering the following OTP:</p>
                     <h2>${otpSent}</h2>    
                    <p>If you did not request this, please ignore this email.</p>                     
                    </div>`});

        console.log("Sent for Email Verification")
        res.status(201).json({success:true, message:"OTP Sent for Email Verification"});
    }catch(error) {
        console.log("Internal Server Error");
        res.status(500).json({success:false, message:"Internal Server Error"});
    } 
});

router.post('/doctor/verify_email', async (req, res) => {
    const {doc_name, email, password, otpEntered} = req.body;
    if (!doc_name || !email || !password || !otpEntered) {
        return res.status(400).json({ message: "All Fields are Required" });
    }
    const storedOtp = await redisClient.get(`otp:${email}`);
    if(!storedOtp) {
        return res.status(410).json({ message: "OTP expired. Please request again." });
    }
    if(storedOtp != otpEntered){
        console.log("Incorrect OTP Please try again");
        return res.status(400).json({success:false, message:"Enter Correct OTP"});
    }
    else console.log("Email Verified Succesfully");
    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await sql`
            INSERT INTO doctor(name,email,hashedpassword) 
            VALUES(${doc_name}, ${email}, ${hashedPassword}) RETURNING *
        `;
       
        sendmail({to: email, subject: 'Registration Successfull', html:`<div>
                        <h1>Welcome to DocSlot</h1>
                        <p>Dear User,</p>
                        <p>Your email has been successfully verified. You can now log in to your account.</p>
                        <p>Your User Id is ${result[0].doc_id}</p>
                        <p>Please Note it for future reference</p>
                        <p>Thank you for choosing DocSlot!</p>
                        <p>Best regards,</p>
                        <p>The DocSlot Team</p>
            </div>`});
        await redisClient.del(`otp:${email}`);
        res.status(201).json({ success: true, message: "User Registered successfully", data: result[0] });
    }catch(error){
        console.log("Internal Server Error ",error);
        res.status(500).json({success:false, message:"Internal Server Error"});
    }
});

router.post('/doctor/login', async(req, res)=>{
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json({success:false, message:"Please Enter All Fields"});
    }
    try{
        const user = await sql`SELECT * FROM doctor WHERE email = ${email}`;
        if(user.length === 0){
            return res.status(404).json({success:false, message:"User Does Not Exist"});
        }
        if(await bcrypt.compare(password, user[0].hashedpassword) == false){
            return res.status(401).json({success:false, message:"Please Check Your Password"});
        }
        user[0].hashedpassword = undefined;

        const token = jwt.sign({ 
            doc_id: user[0].doc_id,
            role: "doctor" ,
            name: user[0].name,
            specialization: user[0].specialization,
            phone:user[0].phone,
            email:user[0].email,
            image:user[0].image,
            about_us:user[0].about_us
        },
        
            process.env.JWT_SECRET,

            { expiresIn: '20m' }
        );

        const options = {
            httpOnly: true, 
            maxAge: 20 * 60 * 1000
        };
        res.cookie("token", token,options).status(200).json({
            success:true, 
            data:user[0],
            message:"Login Successfull"
        });

    }catch(error){
        console.log("Internal Server Error");
        res.status(500).json({success:false, message:"Internal Server Error"});
    }

});

router.post('/doctor/logout', auth, isDoctor, async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
        }).status(200).json({ success: true, message: "Logout Successful" });
    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }   
});

router.post('/doctor/forgot_password', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
    }
    try {
        const user = await sql`SELECT * FROM doctor WHERE email = ${email}`;
        if (user.length === 0) {
            return res.status(404).json({ success: false, message: "User does not exist" });
        }

        const otpSent = Math.floor(100000 + Math.random() * 900000).toString();
        await redisClient.setEx(`otp:${email}`, 300, otpSent);

        sendmail({ to: email, subject: 'Password Reset OTP', html: `
                    <div>
                    <h1>Password Reset Request</h1>
                    <p>Dear ${user[0].name},</p>
                     <p>To reset your password, please use the following OTP:</p>
                     <h2>${otpSent}</h2>
                    <p>If you did not request this, please ignore this email.</p>
                    </div>` });

        console.log("OTP sent for password reset");
        res.status(200).json({ success: true, message: "OTP sent for password reset" });
    } catch (error) {
        console.error("Internal Server Error", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

router.post('/doctor/reset_password', async (req, res) => {
    const { email, otpEntered, newPassword } = req.body;
    if (!email || !otpEntered || !newPassword) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }
    try {
        const storedOtp = await redisClient.get(`otp:${email}`);
        if (!storedOtp) {
            return res.status(410).json({ success: false, message: "OTP expired. Please request again." });
        }
        if (storedOtp !== otpEntered) {
            console.log("Incorrect OTP. Please try again.");
            return res.status(400).json({ success: false, message: "Enter Correct OTP" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await sql`UPDATE doctor SET hashedpassword = ${hashedPassword} WHERE email = ${email}`;

        await redisClient.del(`otp:${email}`);
        console.log("Password reset successfully");
        res.status(200).json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        console.error("Internal Server Error", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }   
});

router.post('/patient/send_otp', async(req, res) => {
    let {pt_name, email} = req.body;
    if (!email) {
        return res.status(400).json({
            message: 'All fields are required'
        });
    }
    try{
        const existed = await sql`SELECT * FROM patient WHERE email = ${email}`;
        if (existed.length>0) {
            console.log("User Already Exists, Please Proceed For Login");
            return res.status(400).json({
                success: false,
                message: 'User Already Exists, Please Proceed For Login',
                data:existed[0]
            });
        }    
        const otpSent = Math.floor(100000 + Math.random()*900000).toString();
        await redisClient.setEx(`otp:${email}`, 300,  otpSent); 

        sendmail({to: email, subject: 'Verification Code', html: `
                    <div>
                    <h1>Welcome to DocSlot</h1>
                    <p>Dear ${pt_name},</p>    
                     <p>Thank you for registering with DocSlot. To complete your registration, please verify your email address by entering the following OTP:</p>
                     <h2>${otpSent}</h2>    
                    <p>If you did not request this, please ignore this email.</p>                     
                    </div>`});

        console.log("Sent for Email Verification")
        res.status(201).json({success:true, message:"OTP Sent for Email Verification"});
    }catch(error) {
        console.log("Internal Server Error");
        res.status(500).json({success:false, message:"Internal Server Error"});
    } 
});

router.post('/patient/verify_email', async (req, res) => {
    const {pt_name, email, password, otpEntered} = req.body;
    if (!pt_name || !email || !password || !otpEntered) {
        return res.status(400).json({ message: "All Fields are Required" });
    }
    const storedOtp = await redisClient.get(`otp:${email}`);
    if(!storedOtp) {
        return res.status(410).json({ message: "OTP expired. Please request again." });
    }
    if(storedOtp != otpEntered){
        console.log("Incorrect OTP Please try again");
        return res.status(400).json({success:false, message:"Enter Correct OTP"});
    }
    else console.log("Email Verified Succesfully");
    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await sql`
            INSERT INTO patient(name,email,hashedpassword) 
            VALUES(${pt_name}, ${email}, ${hashedPassword}) RETURNING *
        `;
       
        sendmail({to: email, subject: 'Registration Successfull', html:`<div>
                        <h1>Welcome to DocSlot</h1>
                        <p>Dear User,</p>
                        <p>Your email has been successfully verified. You can now log in to your account.</p>
                        <p>Your User Id is ${result[0].pt_id}</p>
                        <p>Please Note it for future reference</p>
                        <p>Thank you for choosing DocSlot!</p>
                        <p>Best regards,</p>
                        <p>The DocSlot Team</p>
            </div>`});
        await redisClient.del(`otp:${email}`);
        res.status(201).json({ success: true, message: "User Registered successfully", data: result[0] });
    }catch(error){
        console.log("Internal Server Error ",error);
        res.status(500).json({success:false, message:"Internal Server Error"});
    }
});

router.post('/patient/login', async(req, res)=>{
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json({success:false, message:"Please Enter All Fields"});
    }
    try{
        const user = await sql`SELECT * FROM patient WHERE email = ${email}`;
        if(user.length === 0){
            return res.status(404).json({success:false, message:"User Does Not Exist"});
        }
        if(await bcrypt.compare(password, user[0].hashedpassword) === false){    
            return res.status(401).json({success:false, message:"Please Check Your Password"});
        }
        // user[0].hashedpassword = undefined;

        const token = jwt.sign({ 
            pt_id: user[0].pt_id,
            role: "patient" ,
            name: user[0].name,
            gender: user[0].gender,
            dob:user[0].dob,
            phone:user[0].phone,
            email:user[0].email
        },
        
            process.env.JWT_SECRET,

            { expiresIn: '20m' }
        );

        const options = {
            httpOnly: true,
            secure: false,       
            maxAge: 20 * 60 * 1000
        };
        res.cookie("token", token, options).status(200).json({
            success:true, 
            data:user[0],
            message:"Login Successfull"
        });
        

    }catch(error){
        console.log(error);
        res.status(500).json({success:false, message:"Internal Server Error"});
    }

});

router.post('/patient/logout', auth, isPatient, async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
        }).status(200).json({ success: true, message: "Logout Successfully" });
    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }   
});

router.post('/patient/forgot_password', async(req,res)=>{
    const {email} = req.body;
    if(!email){
        return res.status(400).json({success:false, message:"Please Provide Email"});
    }
    try {
        const user = await sql `SELECT * FROM patient where email = ${email}`;
        if (user.length === 0) {
            return res.status(404).json({ success: false, message: "User does not exist" });
        }

        const otpSent = Math.floor(100000 + Math.random() * 900000).toString();
        await redisClient.setEx(`otp:${email}`, 300, otpSent);

        sendmail({ to: email, subject: 'Password Reset OTP', html: `
                    <div>
                    <h1>Password Reset Request</h1>
                    <p>Dear ${user[0].name},</p>
                     <p>To reset your password, please use the following OTP:</p>
                     <h2>${otpSent}</h2>
                    <p>If you did not request this, please ignore this email.</p>
                    </div>` });

        console.log("OTP sent for password reset");
        res.status(200).json({ success: true, message: "OTP sent for password reset" });
    } catch (error) {
        console.error("Internal Server Error", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

router.post('/patient/reset_password', async (req, res) => {
    const { email, otpEntered, newPassword } = req.body;
    if (!email || !otpEntered || !newPassword) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }
    try {
        const storedOtp = await redisClient.get(`otp:${email}`);
        if (!storedOtp) {
            return res.status(410).json({ success: false, message: "OTP expired. Please request again." });
        }
        if (storedOtp !== otpEntered) {
            console.log("Incorrect OTP. Please try again.");
            return res.status(400).json({ success: false, message: "Enter Correct OTP" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await sql`UPDATE patient SET hashedpassword = ${hashedPassword} WHERE email = ${email}`;

        await redisClient.del(`otp:${email}`);
        console.log("Password reset successfully");
        res.status(200).json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        console.error("Internal Server Error", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }   
});

//routes for patient to get all doctors list
router.get("/fetch_all",auth, isPatient, async(req,res)=>{
    try{
        const doctors = await sql`
            SELECT doc_id, name, specialization,phone, email, about_us, image FROM doctor
            ORDER BY id DESC
        `;
        console.log("fetched doctors",doctors);
        res.status(200).json({success:true, data:doctors})
    } catch(error){
        console.log("Error in getting List", error);
        res.status(500).json({success:false, message:"Internal Server Error"});
    }
});

//READ route for doctor to check his profile 
router.get('/doc_profile/:doc_id',  async(req,res)=>{
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
        SELECT start_time, end_time, pt_id, apt_id, status, name,date::timestamptz AT TIME ZONE 'Asia/Kolkata' as date, (CURRENT_DATE-dob)/365 AS age,gender 
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

router.patch("/doctor/reject_apt/:apt_id", auth, isDoctor, async(req,res)=>{
    const {apt_id} = req.params;
    try{
        const rejected_apt = await sql`
        UPDATE appointment SET status = 'Rejected' WHERE apt_id = ${apt_id} RETURNING *
        `;
        console.log("Appointment Rejected Successfully",rejected_apt[0]);
        res.status(200).json({success:true, data:rejected_apt[0]});
    }catch(error){
        console.log("Error in Rejecting Appointment",error);
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


//route for pateint to get his profile details
router.get('/pt_profile/:pt_id', auth, isPatient, async(req,res)=>{
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
router.put("/pt_update/:pt_id",auth, isPatient, async(req,res)=>{
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
router.get("/pt_slot/:pt_id",auth, isPatient, async(req,res)=>{
    const {pt_id} = req.params;
    try{
        const apt_detail = await sql`
            SELECT apt_id, name,start_time,status,date::timestamptz AT TIME ZONE 'Asia/Kolkata' as date FROM appointment 
            NATURAL JOIN doctor WHERE pt_id = ${pt_id} AND date>=CURRENT_DATE order by date
        `;
        res.status(200).json({success:true, data:apt_detail});
        console.log(apt_detail);
    }catch(error){
        res.status(500).json({success:false,message:"Internal Server Error"});
    }
})

//route for patient to delete apointment
router.delete("/delete_apt/:apt_id",auth, isPatient, async(req,res)=>{
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
router.post("/book_appointment/:doc_id/:pt_id",auth, isPatient, async(req,res)=>{
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
        res.status(201).json({success:true,data:appointment[0], message:"Apointment Booked Successfully"});

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