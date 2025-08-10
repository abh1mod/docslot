import express from 'express';
const router = express.Router();
import {sql} from '../config/db.js';
import bcrypt from 'bcryptjs';
import sendmail from '../utils/mailtrap.config.js';
import redisClient from '../utils/redisClient.js';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import {auth, isPatient, isDoctor } from '../middleware/auth.js';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

function formatTime(timeStr) {
  const [hourStr, minuteStr] = timeStr.split(':');
  let hour = parseInt(hourStr, 10);
  const minute = minuteStr;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return `${hour}:${minute} ${ampm}`;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function calculateAge(dob) {
  if (!dob) return "N/A";
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
}

async function isLimitReached(email) {
  const key = `freq:${email}`;
  const frequency = await redisClient.get(key);
  const count = frequency ? parseInt(frequency) : 0;
  if (count >= 8) {
    console.log("Limit reached");
    return true;  
  }
  const newCount = await redisClient.incr(key);
  if (newCount === 1) {
    await redisClient.expire(key, 24 * 60 * 60); 
  }
  return false; 
}

async function isUploadLimitReached(apt_id) {
  const key = `reportUploadCnt:${apt_id}`;
  const frequency = await redisClient.get(key);
  const count = frequency ? parseInt(frequency) : 0;
  if (count >= 3) {
    console.log("Upload Limit Reached");
    return true;  
  }
  const newCount = await redisClient.incr(key);
  if (newCount === 1) {
    await redisClient.expire(key, 7 * 24 * 60 * 60); 
  }
  return false; 
}


cloudinary.config({ 
        cloud_name: 'dahtedx9c', 
        api_key: process.env.CLOUDINARY_KEY, 
        api_secret: process.env.CLOUDINARY_SECRET
    });

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
          city: decoded.city,
          address:decoded.address,
          slot: decoded.slot,
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
            return res.status(400).json({
                success: false,
                message: 'User Already Exists, Please Proceed For Login'
            });
        }    
        const otpSent = Math.floor(100000 + Math.random()*900000).toString();
        await redisClient.set(`otp:${email}`, otpSent, { ex: 300 });

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
            INSERT INTO doctor(name,email,hashedpassword,specialization,phone,city) 
            VALUES(${doc_name}, ${email}, ${hashedPassword}, 'Others', 'NA', 'Not Mentioned') RETURNING *
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
            about_us:user[0].about_us,
            city: user[0].city,
            address: user[0].address,
            slot: user[0].slot 
        },
        
            process.env.JWT_SECRET,

            { expiresIn: '7d' }
        );

        const options = {
            httpOnly: true, 
            maxAge: 7 * 24 * 60 * 60 * 1000
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
        const isOtpExist = await redisClient.get(`otp:${email}`);
        if(isOtpExist != null) {
            return res.status(200).json({ success: true, message: "OTP Already Sent for password reset Please try to resend after 3 minutes" });
        }
        const otpSent = Math.floor(100000 + Math.random() * 900000).toString();
        await redisClient.set(`otp:${email}`, otpSent, { ex: 180 });

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
        if (storedOtp != otpEntered) {
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

router.post('/doctor/upload_image/:doc_id', auth, isDoctor, async (req, res) => {
    try {
        const image = req.files.photo;
        const result = await cloudinary.uploader.upload(image.tempFilePath, {
            folder: "doctor_images"
        });
        const profile_photo = await sql`
            UPDATE doctor SET image = ${result.secure_url} WHERE doc_id = ${req.params.doc_id} RETURNING *
        `;
        res.status(200).json({ success: true, data: profile_photo[0].image });
    } catch (error) {
        console.error("Image Upload Error:", error);
        res.status(500).json({ success: false, message: "Image Upload Failed" });
    }
});

router.post('/patient/upload_report/:apt_id', auth, isPatient, async (req, res) => {
    try {
        if (await isUploadLimitReached(req.params.apt_id)) {
            return res.status(429).json({ success: false, message: "Upload limit reached. Please try again later." });
        }
        const image = req.files.photo;
        const result = await cloudinary.uploader.upload(image.tempFilePath, {
            folder: "report_images"
        });
        
        // Update appointment with report URL
        const report_photo = await sql`
            UPDATE appointment SET report = ${result.secure_url} WHERE apt_id = ${req.params.apt_id} RETURNING *
        `;

        const appointment = report_photo[0];

        const patient = await sql`
            SELECT pt_id, name, gender, phone, email, dob FROM patient WHERE pt_id = ${appointment.pt_id}
        `;

        const doctor = await sql`
            SELECT name, email, doc_id FROM doctor WHERE doc_id = ${appointment.doc_id}
        `;

        const dobFormatted = patient[0].dob ? new Date(patient[0].dob).toISOString().split('T')[0] : "N/A";

        const formattedDate = formatDate(appointment.date);
        const formattedTime = formatTime(appointment.start_time);
        const age = calculateAge(patient[0].dob);
        const htmlEmail = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: black;">
            <h2 style="color: #27ae60;">New Report Uploaded</h2>
            <p>Dear Dr. ${doctor[0].name},</p>
            <p>The patient <strong>${patient[0].name}</strong> has uploaded a new report for their appointment.</p>
            <h3>Patient Details:</h3>
            <ul>
            <li><strong>Name:</strong> ${patient[0].name}</li>
            <li><strong>Gender:</strong> ${patient[0].gender}</li>
            <li><strong>Phone:</strong> ${patient[0].phone}</li>
            <li><strong>Email:</strong> ${patient[0].email}</li>
            <li><strong>Age:</strong> ${age} years</li>
            </ul>
            <h3>Appointment Details:</h3>
            <ul>
            <li><strong>Appointment ID:</strong> ${appointment.apt_id}</li>
            <li><strong>Date:</strong> ${formattedDate}</li>
            <li><strong>Time:</strong> ${formattedTime}</li>
            <li><strong>Status:</strong> ${appointment.status}</li>
            <li><strong>Category:</strong> ${appointment.category}</li>
            <li><strong>Remarks:</strong> ${appointment.remarks || "N/A"}</li>
            </ul>
            <p>You can view the uploaded report here:</p>
            <a href="${appointment.report}" style="color: #2980b9; text-decoration: none;">View Report</a>
            <p>If you did not expect this email, please ignore it.</p>
        </div>
        `;

        if(await isLimitReached(patient[0].email) === false){
            sendmail({
            to: doctor[0].email,
            subject: "New Patient Report Uploaded",
            html: htmlEmail
        });
        }

        res.status(200).json({ success: true,message:`Report Uploaded successfully`, data: report_photo[0].report });

    } catch (error) {
        console.error("Image Upload Error:", error);
        res.status(500).json({ success: false, message: "Image Upload Failed" });
    }
});

//UPDATE

router.put('/doctor/update/:doc_id', auth, isDoctor, async (req, res) => {
    const { doc_id } = req.params;
    const { name, specialization, phone, email, address, city, about, slot } = req.body.formData;

    try {
        const newProfile = await sql`
            UPDATE doctor 
            SET 
                name = ${name}, 
                specialization = ${specialization}, 
                phone = ${phone}, 
                email = ${email}, 
                address = ${address}, 
                city = ${city}, 
                about_us = ${about}, 
                slot = ${slot}
            WHERE doc_id = ${doc_id} 
            RETURNING *
        `;

        if (!newProfile || newProfile.length === 0) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        const updatedDoctor = newProfile[0];

        // Create new JWT
        const token = jwt.sign(
            {
                doc_id: updatedDoctor.doc_id,
                role: "doctor",
                name: updatedDoctor.name,
                specialization: updatedDoctor.specialization,
                phone: updatedDoctor.phone,
                email: updatedDoctor.email,
                image: updatedDoctor.image,
                about_us: updatedDoctor.about_us,
                city: updatedDoctor.city,
                address: updatedDoctor.address,
                slot: updatedDoctor.slot
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Set the cookie and send response in ONE go
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        }).status(200).json({
            success: true,
            data: updatedDoctor,
            message: "Profile Updated Successfully! JWT refreshed."
        });

    } catch (error) {
        console.error("Error in Updating Profile", error);
        res.status(500).json({ success: false, message: "Internal Server error" });
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
            return res.status(400).json({
                success: false,
                message: 'User Already Exists, Please Proceed For Login'
            });
        }    
        const otpSent = Math.floor(100000 + Math.random()*900000).toString();
        await redisClient.set(`otp:${email}`, otpSent, { ex: 300 });

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
        user[0].hashedpassword = undefined;

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

            { expiresIn: '7d' }
        );

        const options = {
            httpOnly: true,
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000
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
        const isOtpExist = await redisClient.get(`otp:${email}`);
        if(isOtpExist != null) {
            return res.status(200).json({ success: true, message: "OTP Already Sent for password reset Please try to resend after 3 minutes" });
        }
        const otpSent = Math.floor(100000 + Math.random() * 900000).toString();
        await redisClient.set(`otp:${email}`, otpSent, { ex: 300 });

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
        if (storedOtp != otpEntered) {
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
router.get("/fetch_all", async(req,res)=>{
    try{
        const doctors = await sql`
            SELECT doc_id, name, specialization,phone, email, about_us,city, image FROM doctor
            ORDER BY id DESC
        `;
        console.log("fetched doctors",doctors);
        res.status(200).json({success:true, data:doctors})
    } catch(error){
        console.log("Error in getting List", error);
        res.status(500).json({success:false, message:"Internal Server Error"});
    }
});

router.get("/patient/fetch_slot/:doc_id", auth, isPatient, async(req, res)=>{
    try{
        const {doc_id} = req.params;
        const slot = await sql `SELECT slot from doctor WHERE doc_id = ${doc_id}`;
        if(slot.length > 0){
            console.log("Slot Fetched Successfully", slot[0]);
            res.status(200).json({success:true, data:slot[0]});
        }
        else res.status(400).json({success:false, message:`${doc_id} doesn't exist`});
    }catch(error){
        console.log(error);
        res.status(500).json({success:false, message:"Internal Server Error"})
    }
});


router.get('/doc_profile/:doc_id', async(req,res)=>{
    try{
        const {doc_id} = req.params;
        const doc = await sql`
            SELECT * FROM doctor WHERE doc_id = ${doc_id}    
        `;
        doc[0].hashedpassword = undefined;
        console.log("Fetched Doctor Profile",doc);
        res.status(200).json({success:true,data:doc[0]});
    }
    catch(error){
        console.log("Error in fetching profile",error);
        res.status(500).json({success:false, message:"Server Error"});
    }
});


//READ route for doctor to check his slot in a day
router.get("/my_day/:doc_id", auth, isDoctor, async(req,res)=>{
    const{ doc_id } = req.params;
    try{ 
        const day_schedule = await sql `
        SELECT start_time, end_time, pt_id, apt_id, status, category,report,phone ,name, date::timestamptz AT TIME ZONE 'Asia/Kolkata' as date, (CURRENT_DATE-dob)/365 AS age, gender 
        FROM appointment NATURAL JOIN patient
        WHERE doc_id = ${doc_id} AND status != 'Cancelled' ORDER BY status, date, start_time
        `;
        console.log("Schedule fetched Successfully",day_schedule);
        res.status(200).json({success:true, data:day_schedule});
    } catch(error){
        console.log("Error in getting Details ",error);
        res.status(500).json({success:false, message:"Internal Server Error"});
    }
});

router.patch("/doctor/reject_apt/:apt_id", auth, isDoctor, async (req, res) => {
    const { apt_id } = req.params;
    try {
        const rejected_apt = await sql`
            UPDATE appointment SET status = 'Rejected' WHERE apt_id = ${apt_id} RETURNING *
        `;
        const appointment = rejected_apt[0];
        console.log("Appointment Rejected Successfully", appointment);
        const patient = await sql`
            SELECT email, name FROM patient WHERE pt_id = ${appointment.pt_id}
        `;
        const doctor = await sql`
            SELECT name, email, phone FROM doctor WHERE doc_id = ${appointment.doc_id}
        `;

        const formattedDate = formatDate(appointment.date);
        const formattedTime = formatTime(appointment.start_time);


       const htmlEmail = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: black;">
        <h2 style="color: #27ae60;">Appointment Rejected</h2>
        <p>Dear ${patient[0].name},</p>
        <p>We regret to inform you that your appointment has been <strong>rejected</strong>.</p>
        <h3>Appointment Details:</h3>
        <ul>
            <li><strong>Appointment ID:</strong> ${appointment.apt_id}</li>
            <li><strong>Date:</strong> ${formattedDate}</li>
            <li><strong>Time:</strong> ${formattedTime}</li>
            <li><strong>Status:</strong> ${appointment.status}</li>
            <li><strong>Category:</strong> ${appointment.category}</li>
            <li><strong>Remarks:</strong> ${appointment.remarks || "N/A"}</li>
        </ul>
        <h3>Doctor's Contact Information:</h3>
        <ul>
            <li><strong>Email:</strong> ${doctor[0].email}</li>
            <li><strong>Phone:</strong> ${doctor[0].phone}</li>
        </ul>
        <p>If you have any questions, please contact the clinic or your doctor directly.</p>
        <p>Thank you.</p>
    </div>
`;

        if(await isLimitReached(doctor[0].email) === false){
            // Send email to patient
            sendmail({
                to: patient[0].email,
                subject: "Your Appointment Has Been Rejected",
                html: htmlEmail
            });
        }

        res.status(200).json({ success: true, data: appointment });
    } catch (error) {
        console.log("Error in Rejecting Appointment", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});


//route for pateint to get his profile details
router.get('/pt_profile/:pt_id', auth, isPatient, async(req,res)=>{
    try{
        const {pt_id} = req.params;
        const pt = await sql`
            SELECT * FROM patient WHERE pt_id = ${pt_id}    
        `;
        pt[0].hashedpassword = undefined;
        res.status(200).json({success:true,data:pt[0]});
    }
    catch(error){
        console.log("Error in fetching profile",error);
        res.status(500).json({success:false, message:"Server Error"});
    }
})

//route for patient to update his profile
router.put("/pt_update/:pt_id", auth, isPatient, async (req, res) => {
    try {
        const { pt_id } = req.params;
        const { pt_name, gender, dob, phone, email } = req.body;

        // Update profile in DB
        const updated_ptProfile = await sql`
            UPDATE patient 
            SET name = ${pt_name},
                gender = ${gender}, 
                dob = ${dob},
                phone = ${phone}, 
                email = ${email} 
            WHERE pt_id = ${pt_id} 
            RETURNING *
        `;

        if (!updated_ptProfile || updated_ptProfile.length === 0) {
            return res.status(404).json({ success: false, message: "Patient not found" });
        }

        const updatedPatient = updated_ptProfile[0];

        const token = jwt.sign(
            {
                pt_id: updatedPatient.pt_id,
                role: "patient",
                name: updatedPatient.name,
                gender: updatedPatient.gender,
                dob: updatedPatient.dob,
                phone: updatedPatient.phone,
                email: updatedPatient.email
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Set the updated JWT in the cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // set true if HTTPS
            maxAge: 7 * 24 * 60 * 60 * 1000
        }).status(200).json({
            success: true,
            data: updatedPatient,
            message: "Profile Updated Successfully! JWT refreshed."
        });

    } catch (error) {
        console.log("Error in Updating Profile", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});


//route for patient to fetch his slots
router.get("/pt_slot/:pt_id",auth, isPatient, async(req,res)=>{
    const {pt_id} = req.params;
    try{
        const apt_detail = await sql`
            SELECT apt_id, name,category,report, start_time,status,date::timestamptz AT TIME ZONE 'Asia/Kolkata' as date FROM appointment 
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
router.post("/book_appointment/:doc_id/:pt_id", auth, isPatient, async (req, res) => {
    const { doc_id, pt_id } = req.params;
    const { date, start_time, remarks, category } = req.body;

    if (!doc_id || !pt_id) {
        return res.status(401).json({ success: false, message: "Please provide all query parameters" });
    }

    try {
        const appointment = await sql`
            INSERT INTO appointment(doc_id, pt_id, date, start_time, remarks, category) 
            VALUES(${doc_id}, ${pt_id}, ${date}, ${start_time}, ${remarks}, ${category})
            RETURNING *
        `;

        console.log("Appointment Booked Successfully", appointment);

        // Fetch patient info (for email)
        const patient = await sql`
            SELECT name, email FROM patient WHERE pt_id = ${pt_id}
        `;

        // Fetch doctor info (for email)
        const doctor = await sql`
            SELECT name, email, phone, address, city, specialization FROM doctor WHERE doc_id = ${doc_id}
        `;

        const formattedDate = formatDate(appointment[0].date);
        const formattedTime = formatTime(appointment[0].start_time);

        // Prepare email HTML with inline CSS
        const htmlEmail = `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: black;">
                <h2 style="color: #27ae60;">Appointment Confirmation</h2>
                <p>Dear ${patient[0].name},</p>
                <p>Your appointment has been booked successfully. Here are the details:</p>
                <h3>Appointment Details:</h3>
                <ul>
                    <li><strong>Appointment ID:</strong> ${appointment[0].apt_id}</li>
                    <li><strong>Date:</strong> ${formattedDate}</li>
                    <li><strong>Time:</strong> ${formattedTime}</li>
                    <li><strong>Category (Type):</strong> ${appointment[0].category}</li>
                    <li><strong>Remarks:</strong> ${appointment[0].remarks || "N/A"}</li>
                </ul>
                <h3>Doctor Details:</h3>
                <ul>
                    <li><strong>Name:</strong> Dr. ${doctor[0].name}</li>
                    <li><strong>Specialization:</strong> ${doctor[0].specialization}</li>
                    <li><strong>Contact Email:</strong> ${doctor[0].email}</li>
                    <li><strong>Phone:</strong> ${doctor[0].phone}</li>
                    <li><strong>Address:</strong> ${doctor[0].address}</li>
                    <li><strong>City:</strong> ${doctor[0].city}</li>
                </ul>
                <p>If you have any questions, please contact the clinic or your doctor directly.</p>
                <p>Thank you.</p>
            </div>
        `;
 
        if (await isLimitReached(patient[0].email) === false) {
            sendmail({
                to: patient[0].email,
                subject: "Appointment Confirmation - DocSlot",
                html: htmlEmail
            });
        }

        res.status(201).json({ success: true, data: appointment[0], message: "Appointment Booked Successfully" });

    } catch (error) {
        console.log("Error in booking appointment", error);
        if (error.code === '23505' && error.constraint === 'unique_doc_date_time') {
            return res.status(409).json({
            message: 'This Slot is already booked. Please choose another Slot.'
            });
        }
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});


router.get("/busy_slots/:date/:doc_id", auth, isPatient, async(req,res)=>{
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

router.get("/patient/slot_duration/:doc_id",auth, isPatient, async(req,res)=>{
    const {doc_id} = req.params;
    try{
        const hour = await sql `SELECT slot FROM doctor WHERE doc_id = ${doc_id}`;
        console.log("Duration fetched successfully",hour[0]);
        res.status(200).json({success:true, data:hour[0]});
    }catch(error){
        console.log("Error in fetching slots", error);
        res.status(500).json({success:false, message:"Internal Server Error"});
    }
})

router.get("/patient/filter_attributes", async (req, res) => {
  try {
    const cities = await sql`
      SELECT DISTINCT LOWER(city) AS city
      FROM doctor
      WHERE city IS NOT NULL AND city <> ''
      ORDER BY city
    `;

    const specializations = await sql`
      SELECT DISTINCT LOWER(specialization) AS specialization
      FROM doctor
      WHERE specialization IS NOT NULL AND specialization <> ''
      ORDER BY specialization
    `;

    res.status(200).json({
        success: true,
        data: {
            cities: cities.map(row => row.city),
        specializations: specializations.map(row => row.specialization)
      }
    });
  } catch (error) {
    console.error("Error in fetching unique data", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});


export default router;