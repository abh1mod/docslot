import { useState } from "react";
import "./Registration.css"; // Assuming you have a CSS file for styling
import DoctorImg from "../../assets/doctor.jpg";
import { Link } from "react-router-dom"; // Import Link for navigation
import axios from "axios";
import { useNavigate } from "react-router-dom";
const RegistrationDoc = () => {

    const [doc_name, setDocName] = useState('');
    const [email, setEmail] = useState('');
    const [specialization, setSpecialization] = useState('')
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (event) => {
        event.preventDefault(); 
        try {
            const res = await axios.post('http://localhost:3000/api/doc_register', { doc_name, email, specialization });
            console.log(res.data.success);
            if (res.data.success) {
                navigate(`/doctor/${res.data.data.doc_id}`); // Redirect to login page after successful registration
            } else {
                setError(res.data.message);
            }
        } catch (error) {
            console.error(error);
        }
    };





  // const [user, setuser] = useState({
  //   doc_name: "",
  //   specialization: "",
  //   phone: "NaN",
  //   email: "",
  //   room_no: "Nan",
  // });

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setuser((prev) => ({ ...prev, [name]: value }));
  // };

  // const handleRegister = async (e) => {
  //   e.preventDefault();
  //   console.log(user);
  //   try {
  //     const response = await fetch(`http://localhost:3000/api/doc_register`, {method: "POST",headers: {"Content-Type": "application/json", },body: JSON.stringify(user),});
  //     console.log(response);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

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
                id="name"
                name="doc_name"
                required
                value={doc_name}
                onChange={(event)=>{setDocName(event.target.value)}}
                placeholder="Name"
              />
            </div>
            <div className="input-group">
              <span className="icon">📧</span>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={email}
                onChange={(event)=>{setEmail(event.target.value)}}
                placeholder="Email"
              />
            </div>
            <div className="input-group">
              <span className="icon">📒</span>
              <input
                type="text"
                id="specialization"
                name="specialization"
                required
                value={specialization}
                onChange={(event)=>{setSpecialization(event.target.value)}}
                placeholder="Specialization"
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
          <Link to="/login_doc">Already have an Account?</Link>
          </div>
            
        </div>
        <div className="signup-image">
          <img src={DoctorImg} alt="doctor patient image" />
        </div>
      </div>
    </div>
  );
};

export default RegistrationDoc;
