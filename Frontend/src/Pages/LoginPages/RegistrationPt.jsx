import { useEffect, useState } from "react";
import PtImg from "../../assets/patient.jpg";
import { Link } from "react-router-dom"; // Import Link for navigation
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

const RegistrationPt = () => {

  const [user, setUser] = useState({
    pt_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [mismatch, setMismacth] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const navigate = useNavigate();


  useEffect(()=>{
    if(!user.confirmPassword) setMismacth(false);
    else if(user.confirmPassword){
      if(user.password !== user.confirmPassword){
        setMismacth(true);
      }
      else setMismacth(false);
    }
  },[user.confirmPassword])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value
    }));
  };

    

    const handleSendOtp = async (event) => {
        event.preventDefault(); 
        try {
            const res = await axios.post(`${BASE_URL}/api/patient/send_otp`, { pt_name:user.pt_name, email:user.email});
            console.log(res.data.success);
            if (res.data.success) {
                 toast.success("OTP send Successfully!",{
                  autoClose: 2000,
                 hideProgressBar: false,
                 closeOnClick: true,
                 pauseOnHover: true,
                 draggable: true,

                })
                setOtpSent(true);
            } else {
                   toast.error("Error while sending OTP!",{
                  autoClose: 2000,
                 hideProgressBar: false,
                 closeOnClick: true,
                 pauseOnHover: true,
                 draggable: true,

                })
                console.error(res.data.message);
            }
        } catch (error) {
               toast.error("Error while Action!",{
                  autoClose: 2000,
                 hideProgressBar: false,
                 closeOnClick: true,
                 pauseOnHover: true,
                 draggable: true,

                })
            console.error(error.response.data.message);
            
        }
    };
    const handleRegistration = async (event) => {
        event.preventDefault();

        try {
            const res = await axios.post(`${BASE_URL}/api/patient/verify_email`, { otpEntered:otp, email:user.email, password:user.password, pt_name:user.pt_name });
            if (res.data.success) {
                   toast.success("Successfully Singup!",{
                  autoClose: 2000,
                 hideProgressBar: false,
                 closeOnClick: true,
                 pauseOnHover: true,
                 draggable: true,

                })
                navigate("/login_pt")
            } else {
                 toast.error("Failed to singup!",{
                  autoClose: 2000,
                 hideProgressBar: false,
                 closeOnClick: true,
                 pauseOnHover: true,
                 draggable: true,

                })
            
            }
        } catch (error) {
               toast.error("Error while Action!",{
                  autoClose: 2000,
                 hideProgressBar: false,
                 closeOnClick: true,
                 pauseOnHover: true,
                 draggable: true,

                })
            console.error(error.response.data.message);

        }
    }

  return (


   //main container
    <div className="flex flex-col justify-center items-center min-h-[85vh] bg-gray-100">
      <div className=" flex bg-white px-5 gap-2 shadow-md rounded-lg min-h-[450px] min-w-[760px]">
        <div className="flex flex-col justify-center items-center p-10 w-full">
          <img
            src={PtImg}
            alt="Patient"
            className="w-[300px] h-[280px] object-cover rounded-l-lg"
          />
        </div>
        <div className="flex flex-col p-10 w-full">
          <h2 className="text-3xl font-bold mb-6 font-">Sign Up</h2>
          <form className="flex flex-col gap-5" onSubmit={handleSendOtp}>
          
            <input 
              type="text"
              name="pt_name"
              value={user.pt_name}
              onChange={handleChange}
              disabled = {otpSent}
              className="w-full text-[15px] px-3 py-2 border  border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
              placeholder="👤 Name"
            />
            
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              disabled = {otpSent}
              className="w-full text-[15px] px-3 py-2 border  border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
              placeholder="📧 Email"
            />
            <div className={`flex flex-col gap-5 ${otpSent ? 'hidden' : ''}`}>
              <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              disabled = {user.confirmPassword.length > 0 }
              className={`w-full text-[15px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
              required
              placeholder="🔑 Password"
            />
            <input
              type="password"
              name="confirmPassword"
              value={user.confirmPassword}
              onChange={handleChange}
              disabled = {user.password.length < 6 }
              className={`w-full text-[15px] px-3 py-2 border ${mismatch ? 'border-red-500' : 'border-gray-300'}  rounded-md focus:outline-none `}
              required
              placeholder="🔑 Confirm Password"
            />
            <div className="flex justify-between items-center">
              <button disabled={mismatch || user.confirmPassword.length===0} type="submit" className="min-w-[112px] text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700">Send OTP</button>
              {mismatch && <p className="text-red-500 text-sm">Both passwords must <br/> be the same</p>}
            </div>

              <Link to = "/login_pt" className="text-sm cursor-pointer underline ">Already Have an Account?</Link>
            </div> 
                          
          </form>

          <form className="flex flex-col gap-5 mt-5" onSubmit={handleRegistration}>
            <input 
              type="text"
              name="Enter OTP"
              value={otp}
              onChange = {(e) => setOtp(e.target.value)}
              className={`w-full text-[15px] px-3 py-2 border ${otpSent ? '':'hidden'} border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
              required
              placeholder="🔓 Enter OTP"
            />
              <button
                onClick={handleRegistration}
                type="submit"
                  className={` ${otpSent ? '':'hidden'} max-w-[112px] text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}  
              >Verify</button>
              
            </form>
              
      </div>
        
        
      </div>
      </div>
    
  );
};

export default RegistrationPt;
