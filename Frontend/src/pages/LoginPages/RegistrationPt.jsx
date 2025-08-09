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
               toast.error(`${error.response.data.message}`,{
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
                navigate("/pt_profile")
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
               toast.error(`${error.response.data.message}`,{
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
  <div className="flex justify-center items-center h-[83vh] p-2 bg-white sm:bg-gray-100">
  <div className="sm:min-w-[26%] min-w-[80%] min-h-[70%] bg-white sm:shadow-lg flex flex-col justify-center rounded-lg gap-2 sm:p-8 p-0 text-center">

    <h2 className="text-3xl font-bold mb-6 font-sans">Sign Up</h2>

    {/* Sign Up Form */}
    <form
      className={`flex flex-col gap-5 items-center ${otpSent ? "hidden" : ""}`}
      onSubmit={handleSendOtp}
    >
      <input
        type="text"
        name="pt_name"
        value={user.pt_name}
        onChange={handleChange}
        disabled={otpSent}
        className="w-full max-w-sm text-[15px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        required
        placeholder="👤 Name"
      />

      <input
        type="email"
        name="email"
        value={user.email}
        onChange={handleChange}
        disabled={otpSent}
        className="w-full max-w-sm text-[15px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        required
        placeholder="📧 Email"
      />

      <input
        type="password"
        name="password"
        value={user.password}
        onChange={handleChange}
        disabled={user.confirmPassword.length > 0}
        className="w-full max-w-sm text-[15px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        required
        placeholder="🔑 Password"
      />

      <input
        type="password"
        name="confirmPassword"
        value={user.confirmPassword}
        onChange={handleChange}
        disabled={user.password.length < 6}
        className={`w-full max-w-sm text-[15px] px-3 py-2 border ${
          mismatch ? "border-red-500" : "border-gray-300"
        } rounded-md focus:outline-none`}
        required
        placeholder="🔑 Confirm Password"
      />

      {mismatch && (
        <p className="text-red-500 text-sm text-center">
          Both passwords must be the same
        </p>
      )}

      <button
        type="submit"
        disabled={mismatch || user.confirmPassword.length === 0}
        className="w-full max-w-sm text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-md text-sm px-5 py-2.5"
      >
        Send OTP
      </button>

      <Link
        to="/login_pt"
        className="text-sm cursor-pointer underline text-blue-600 hover:text-blue-800"
      >
        Already Have an Account?
      </Link>
    </form>

    {/* OTP Verification Form */}
    <form
      className={`flex flex-col gap-5 items-center ${otpSent ? "" : "hidden"}`}
      onSubmit={handleRegistration}
    >
      <input
        type="text"
        name="otp"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="w-full max-w-sm text-[15px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        required
        placeholder="🔓 Enter OTP"
      />
      <button
        type="submit"
        className="w-full max-w-sm text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-md text-sm px-5 py-2.5"
      >
        Verify
      </button>
    </form>
  </div>
</div>

    
  );
};

export default RegistrationPt;
