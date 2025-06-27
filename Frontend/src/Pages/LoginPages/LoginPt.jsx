import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import "./Registration.css"
import PtImg from '../../assets/patient2.jpg'; // Adjust the path as needed
import { Userdata } from '../../ContextApi/Context';
import { useContext } from 'react';


function LoginPt({onLoginSuccess, onSwitchToRegister}) {

    
    // const [pt_id, setPtId] = useState('');
    // const [email, setEmail] = useState('');
    // const [error, setError] = useState('');

    const[pt,setPt]=useState({
      pt_id:"",
      email:""
    })

    const navigate = useNavigate();

    useEffect(()=>{
      window.scrollTo({ top: 0, behavior: "instant" });
      document.body.style.overflowY="hidden";
      return()=>{
        document.body.style.overflowY="scroll";
      }
    },[]);


    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const res = await axios.post('http://localhost:3000/api/pt_login',{ pt_id:pt.pt_id,email: pt.email });
            if(res.data.success){
              const patient = res.data;
              console.log(patient)
              navigate(`/patient/${patient.pt_id}`);
              //onLoginSuccess(patient); //Callback Triggered
            }
            else{
              console.log("Check Your Credentials");
            }

        } catch (err) {
            // setError("Check Your Credentials");
            console.error(err);
        }
    };

    return (

      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
                name='pt_id'
                placeholder="Patient ID"
                value={pt.pt_id}
                required
                onChange={(e)=> setPt(prev => ({ ...prev, [e.target.name]: e.target.value }))}
              />
            </div>
            <div className="input-group">
              <span className="icon">📧</span>
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={pt.email}
                required
                 onChange={(e)=> setPt(prev => ({ ...prev, [e.target.name]: e.target.value }))}
              />
            </div>
            
            <button type="submit">Login</button>
          </form>
          <div className="LoginLink">
          <span onClick={onSwitchToRegister}>Didn't have an Account?</span>
          </div>
            
        </div>
        
      </div>
     </div>
        
    );
}

export default LoginPt;
