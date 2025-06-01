import { useState } from "react";
import "./Registration.css";
import Pt2Img from "../../assets/patient.jpg";
import { Link } from "react-router-dom"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegistrationPt = () => {
    const [pt_name, setPtName] = useState('');
    const [gender, setGender] = useState('');
    const [dob, setDOB] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async(event)=>{
      event.preventDefault();
      try{
        // const data = ;
        const res = await axios.post("http://localhost:3000/api/pt_register", {pt_name, gender, dob, phone, email});
          console.log(res.data.success);
          setError(res.data.message);  
      }
        catch(error){
          console.log(error);
        }
      }
      
  return (
    <div className="signup-container">
      <div className="signup-box">
        <div className="signup-form">
          <h2>Sign up</h2>
          <form onSubmit={handleRegister}>
            <div className="input-group">
              <span className="icon">👤</span>
              <input
                type="text"
                name="pt_name"
                required
                value={pt_name}
                onChange={(event)=>{setPtName(event.target.value)}}
                placeholder="Name"
              />
            </div>
            <div className="input-group">
              <span className="icon">♂️</span>
              <input
                type="text"
                name="gender"
                required
                value={gender}
                onChange={(event)=>{setGender(event.target.value)}}
                placeholder="Gender"
              />
            </div>
            <div className="input-group">
              <span className="icon">📅</span>
              <input
                type="date"
                name="Date of Birth"
                required
                value={dob}
                onChange={(event)=>{setDOB(event.target.value)}}
                placeholder="Gender"
              />
            </div>
            <div className="input-group">
              <span className="icon">📧</span>
              <input
                type="email"
                name="email"
                required
                value={email}
                onChange={(event)=>{setEmail(event.target.value)}}
                placeholder="Email"
              />
            </div>
            <div className="input-group">
              <span className="icon">☎︎</span>
              <input
                type="text"
                name="phone"
                required
                value={phone}
                onChange={(event)=>{setPhone(event.target.value)}}
                placeholder="Phone"
              />
            </div>
            {/* <div className="input-group">
              <span className="icon">🔒</span>
              <input type="password" placeholder="Repeat your password" placeholder="Enter "/>
            </div> */}
            {/* <div className="checkbox-group">
              <input type="checkbox" />
              <p>I agree all statements in <span className="terms">Terms of service</span></p>
            </div> */}
            <button type="submit">Register</button>
          </form>
          <div className="LoginLink">
          <Link to="/login_pt">Already have an Account?</Link>
          </div>
            
        </div>
        <div className="signup-image">
          <img src={Pt2Img} alt="doctor patient image" />
        </div>
      </div>
    </div>
  );
};

export default RegistrationPt;
