import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import "./Registration.css"
import PtImg from '../../assets/patient2.jpg'; // Adjust the path as needed


function LoginPt() {
    const [pt_id, setPtId] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const res = await axios.post('http://localhost:3000/api/pt_login', { pt_id, email });

        } catch (err) {
            setError("Check Your Credentials");
            console.error(err);
        }
    };

    return (

        <div className="signup-container">
      <div className="signup-box">
      <div className="signup-image">
          <img src={PtImg} alt="doctor patient image" />
        </div>

        <div className="signup-form">
          <h2>Log In</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <span className="icon">👤</span>
              <input
                type="password"
                placeholder="Patient ID"
                value={pt_id}
                required
                onChange={(event)=> setPtId(event.target.value)}
              />
            </div>
            <div className="input-group">
              <span className="icon">📧</span>
              <input
                type="email"
                placeholder="Email"
                value={email}
                required
                onChange={(event)=> setEmail(event.target.value)}
              />
            </div>
            
            <button type="submit">Login</button>
          </form>
          <div className="LoginLink">
          <Link to="/registration_pt">Didn't have an Account?</Link>
          </div>
            
        </div>
        
      </div>
    </div>
        
    );
}

export default LoginPt;
