import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import "./Registration.css"
import signupImg from '../../assets/img.jpg'; // Adjust the path as needed
import { useContext } from 'react';
import { Userdata } from '../../ContextApi/Context';

/*to access contextApi data we have to import the component userdata first that hold all thing 
that context API want to transfer without that only wrappin the component is not sufficient*/



function LoginDoc() {
    // const [doc_id, setDocId] = useState('');
    // const [email, setEmail] = useState('');
    // const [error, setError] = useState('');
    
    //destructure the data receive from context api
    //this is syntax by using usecontext(vvv.imp)
const { setLoged } = useContext(Userdata);
    
  //single usestate to handle many fields
    const [user,setUser]=useState({
      doc_id:"",
      email:"",
    })
    const navigate = useNavigate();

  
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const res = await axios.post('http://localhost:3000/api/doc_login', { doc_id:user.doc_id,email: user.email });

            if (res.data.success) {
              //pushing user data to local storage that will help us to implement login and logout
               localStorage.setItem("user", JSON.stringify(res.data.data));
                navigate(`/doctor/${res.data.data.doc_id}`);
                //important line
                //this will rerender the whole context api and the components that are using it
                setLoged(true);
            }
            // else alert("wrong credentials")
            // } else {
            //     setError(res.data.message);
            // }
        } catch (err) {
            // setError("Check Your Credentials");
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
               //onject identify on basis of name
                name="doc_id"
                type="text"
                placeholder="Doctor ID"
                //value define what should be visible in input field
                value={user.doc_id}
                required
                //changing controll to uncontroll component 
                //handling prev value and updating respective key dynamically
                onChange={(e)=> setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
              />
            </div>
            <div className="input-group">
              <span className="icon">📧</span>
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={user.email || ""}
                required
                 onChange={(e)=> setUser(prev => ({ ...prev, [e.target.name]: e.target.value }))}
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
