import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

//authentication
function auth(req, res, next) {
    try {
        const token = req.cookies.token;
        if (!token) {
            console.warn("Authentication Failed: No token provided");
            return res.status(401).json({ success: false, message: "Unauthorized: Token missing" });
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            console.log("Invalid token:", error.message);
            return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
        }

    }catch(error) {
        console.log("Internal auth error:", error);
        return res.status(500).json({ success: false, message: "Internal server error in authentication" });
    }
}

// isDoctor
function isDoctor(req, res, next) {
    try {
        if (!req.user || req.user.role !== 'doctor') {
            console.log("Access denied: User is not a doctor");
            return res.status(403).json({ success: false, message: "Forbidden: Doctors only" });
        }
        next();
    } catch (error) {
        console.log("Authorization error :", error);
        return res.status(500).json({ success: false, message: "Internal server error in doctor authorization" });
    }
}


// isPatient
function isPatient(req, res, next) {
    try {
        if (!req.user || req.user.role !== 'patient') {
            console.log("Access denied: User is not a patient");
            return res.status(403).json({ success: false, message: "Forbidden: Patients only" });
        }
        next();
    } catch (error) {
        console.error("Authorization error :", error);
        return res.status(500).json({ success: false, message: "Internal server error in patient authorization" });
    }
}


export { auth , isDoctor, isPatient }; ;