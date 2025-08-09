import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import "./Registration.css"
import PtImg from '../../assets/img.jpg'; // Adjust the path as needed
import { useAuth } from '../../ContextAPI/AuthContext';
import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

const LoginDoc = () => {
  const {fetchUser} = useAuth();
  const[ forgotPass, setForgotPass] = useState(false);
  const [loginPending, setLoginPending] = useState(false);
  const [user, setUser] = useState({
    email: '',
    password: '',
    newPassword: '',
    confirmPassword:''
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [mismatch, setMismacth] = useState('');
  const navigate = useNavigate();


  useEffect(()=>{
    if(!user.confirmPassword) setMismacth(false);
    else if(user.confirmPassword){
      if(user.newPassword !== user.confirmPassword){
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

    

    const handleLogin = async (event) => {
      setLoginPending(true);
        event.preventDefault(); 
        try {
            const res = await axios.post(`${BASE_URL}/api/doctor/login`, { email:user.email, password:user.password });
            console.log(res.data.success);
            if (res.data.success) {
              toast.success("Login Successfully!",{
                  autoClose: 2000,
                 hideProgressBar: false,
                 closeOnClick: true,
                 pauseOnHover: true,
                 draggable: true,

                })
                console.log("Login successful");
                fetchUser();
                navigate("/doc_profile");
            } else {
               toast.error(`${res.data.message}`,{
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
        setLoginPending(false);
    };

    const handleForgotPassword = async (event) => {
        event.preventDefault();
        try {
            const res = await axios.post(`${BASE_URL}/api/doctor/forgot_password`, { email:user.email });
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
              toast.error("OTP send failed!",{
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

    const handleResetPassword = async (event) => {
      event.preventDefault();
      try{
         const res = await axios.post(`${BASE_URL}/api/doctor/reset_password`, { email:user.email, otpEntered:otp, newPassword : user.newPassword });
         if(res.data.success){
         toast.success("Password reset Successfully!",{
                  autoClose: 2000,
                 hideProgressBar: false,
                 closeOnClick: true,
                 pauseOnHover: true,
                 draggable: true,

                })
                navigate("/doc_home");
          // window.location.reload(false);
         }
         else{
            toast.error("Password reset failed!",{
                  autoClose: 2000,
                 hideProgressBar: false,
                 closeOnClick: true,
                 pauseOnHover: true,
                 draggable: true,

                })
         }
      } catch(error){
        toast.error("Error while action!",{
                  autoClose: 2000,
                 hideProgressBar: false,
                 closeOnClick: true,
                 pauseOnHover: true,
                 draggable: true,

                })
      }
     
    }

  return (


   //main container
    <div className="flex justify-center items-center h-[85vh] p-2 bg-white sm:bg-gray-100">
  <div className="sm:min-w-[26%] min-h-[84%] min-w-[80%] bg-white sm:shadow-lg flex flex-col justify-center rounded-lg  gap-2 sm:p-8 p-0 text-center">

    <h2 className="text-3xl font-bold mb-6 text-center font-sans">
      {!forgotPass ? "Log In" : "Reset Password"}
    </h2>

    {/* Login Form */}
    <form
      className={`flex flex-col gap-5 ${forgotPass ? 'hidden' : ''}`}
      onSubmit={handleLogin}
    >
      <input
        type="email"
        name="email"
        value={user.email}
        onChange={handleChange}
        className="w-full max-w-sm mx-auto text-[15px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        required
        placeholder="📧 Email"
      />
      <input
        type="password"
        name="password"
        value={user.password}
        onChange={handleChange}
        className="w-full max-w-sm mx-auto text-[15px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        required
        placeholder="🔑 Password"
      />

      <button
        type="submit"
        className="w-full mx-auto max-w-sm text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-md text-sm px-5 py-2.5"
        disabled={loginPending}
      >
        Log In
      </button>

      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={() => setForgotPass(true)}
          className="text-sm cursor-pointer underline"
        >
          Forgot Password?
        </button>
        <Link to="/registration_doc" className="text-sm cursor-pointer underline">
          Didn't Have an Account?
        </Link>
      </div>
    </form>

    {/* Forgot Password Form */}
    <form
      className={`flex flex-col gap-5 ${forgotPass && !otpSent ? '' : 'hidden'}`}
      onSubmit={handleForgotPassword}
    >
      <input
        type="email"
        name="email"
        value={user.email}
        onChange={handleChange}
        className="w-full max-w-sm mx-auto text-[15px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        required
        placeholder="📧 Email"
      />
      <button
        type="submit"
        className="w-full mx-auto max-w-sm text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-md text-sm px-5 py-2.5"
      >
        Send OTP
      </button>
    </form>

    {/* Reset Password Form */}
    <form
      className={`flex flex-col gap-5 ${otpSent ? '' : 'hidden'}`}
      onSubmit={handleResetPassword}
    >
      <input
        type="text"
        name="otp"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="w-full max-w-sm mx-auto text-[15px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        required
        placeholder="🔓 Enter OTP"
      />
      <input
        type="password"
        name="newPassword"
        value={user.newPassword}
        onChange={handleChange}
        disabled={user.confirmPassword.length > 0}
        className="w-full max-w-sm mx-auto text-[15px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        required
        placeholder="🔑 Enter New Password"
      />
      <input
        type="password"
        name="confirmPassword"
        value={user.confirmPassword}
        onChange={handleChange}
        disabled={user.newPassword.length < 6}
        className={`w-full max-w-sm mx-auto text-[15px] px-3 py-2 border ${
          mismatch ? 'border-red-500' : 'border-gray-300'
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
        disabled={mismatch}
        className="mx-auto w-full max-w-sm text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-md text-sm px-5 py-2.5"
      >
        Reset Password
      </button>
    </form>
  </div>
</div>

    
  );
};

export default LoginDoc;
