import { useEffect, useState } from "react";
import DocImg from "../../assets/doctor.jpg"; // Adjust the path as needed
import { Link } from "react-router-dom"; // Import Link for navigation
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "";
const RegistrationDoc = () => {

  const [user, setUser] = useState({
    doc_name: '',
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
            const res = await axios.post(`${BASE_URL}/api/doctor/send_otp`, { doc_name:user.doc_name, email:user.email});
            console.log(res.data.success);
            if (res.data.success) {
                setOtpSent(true);
            } else {
                console.log("Error in sending OTP");
                console.error(res.data.message);
            }
        } catch (error) {
            toast.error(`${error.response.data.message}`, {
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            console.error(error.response.data.message);
            
        }
    };
    const handleRegistration = async (event) => {
        event.preventDefault();

        try {
            const res = await axios.post(`${BASE_URL}/api/doctor/verify_email`, { otpEntered:otp, email:user.email, password:user.password, doc_name:user.doc_name });
            if (res.data.success) {
              toast.success("Registration Successful!", {
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
              });
              navigate("/doc_profile");
            } else {
              toast.error(`${res.data.message}`, {
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
              });
            }
        } catch (error) {
            toast.error(`${error.response.data.message}`, {
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        

        }
    }

  return (


   <div className="flex justify-center items-start min-h-[85vh] py-[4%] bg-white sm:bg-gray-100">
  <div className="xs:min-w-[25%] md:min-w-[25%] py-14  sm:px-10 sm:min-w-[70%] min-w-[80%]  bg-white sm:shadow-lg flex flex-col justify-center rounded-md  gap-2  text-center">

      <h2 className="text-3xl font-bold mb-6">Sign Up</h2>

      {/* First Form: Send OTP */}
      <form className="flex flex-col gap-5 w-full" onSubmit={handleSendOtp}>
        <input 
          type="text"
          name="doc_name"
          value={user.doc_name}
          onChange={handleChange}
          disabled={otpSent}
          className="w-full max-w-sm mx-auto text-[15px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
          placeholder="👤 Name"
        />
        
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          disabled={otpSent}
          className="w-full max-w-sm mx-auto text-[15px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
          placeholder="📧 Email"
        />

        {!otpSent && (
          <>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              disabled={user.confirmPassword.length > 0}
              className="w-full max-w-sm mx-auto text-[15px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
              placeholder="🔑 Password"
            />

            <input
              type="password"
              name="confirmPassword"
              value={user.confirmPassword}
              onChange={handleChange}
              disabled={user.password.length < 6}
              className={`w-full max-w-sm mx-auto text-[15px] px-3 py-2 border ${mismatch ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none`}
              required
              placeholder="🔑 Confirm Password"
            />

            <div className="flex flex-col items-center gap-2">
              <button
                disabled={mismatch || user.confirmPassword.length === 0}
                type="submit"
                className="max-w-sm w-full text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-md text-sm px-5 py-2.5"
              >
                Send OTP
              </button>
              {mismatch && <p className="text-red-500 text-sm">Both passwords must be the same</p>}
            </div>

            <Link to="/login_doc" className="text-sm underline text-center">
              Already Have an Account?
            </Link>
          </>
        )}
      </form>

      {/* Second Form: OTP Verification */}
      {otpSent && (
        <form className="flex flex-col gap-5 w-full mt-5" onSubmit={handleRegistration}>
          <input 
            type="text"
            name="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full max-w-[400px] mx-auto text-[15px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
            placeholder="🔓 Enter OTP"
          />

          <button
            type="submit"
            className="w-full max-w-sm mx-auto text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-md text-sm px-5 py-2.5"
          >
            Verify
          </button>
        </form>
      )}

  </div>
</div>

    
  );
};

export default RegistrationDoc;
