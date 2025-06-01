import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import "./Registration.css"
import signupImg from '../../assets/img.jpg'; // Adjust the path as needed


function LoginDoc() {
    const [doc_id, setDocId] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const res = await axios.post('http://localhost:3000/api/doc_login', { doc_id, email });

            if (res.data.success) {
                navigate(`/doctor/${res.data.data.doc_id}`);
            } else {
                setError(res.data.message);
            }
        } catch (err) {
            setError("Check Your Credentials");
            console.error(err);
        }
    };

    return (

        <div className="signup-container">
      <div className="signup-box">
      <div className="signup-image">
          <img src={signupImg} alt="doctor patient image" />
        </div>

        <div className="signup-form">
          <h2>Log In</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <span className="icon">👤</span>
              <input
                type="password"
                placeholder="Doctor ID"
                value={doc_id}
                required
                onChange={(event)=> setDocId(event.target.value)}
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
          <Link to="/registration_doc">Didn't have an Account?</Link>
          </div>
            
        </div>
        
      </div>
    </div>
        
    );
}

export default LoginDoc;
