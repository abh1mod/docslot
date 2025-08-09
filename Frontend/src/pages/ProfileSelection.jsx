import { useNavigate } from "react-router-dom";
import logo from '../assets/logo.png';
import { useContext } from 'react';
import  {AuthContext}  from '../ContextAPI/AuthContext';

const ProfileSelection = ({ onSelect }) => {
  const {role,setRole} = useContext(AuthContext);
  const navigate = useNavigate();

    const handleDoctorClick = () => {
      setRole("doctor");
      localStorage.setItem("role", "doctor");
      navigate("/doc_home");
      onSelect();
    }
  const handlePatientClick = () => {
    setRole("patient");
    localStorage.setItem("role", "patient");
    navigate("/home");
    onSelect();
  }

  return (  
<div className="relative flex flex-col md:flex-row justify-between min-w-full max-w-full text-blue-800 font-bold text-[30px]">

  <button
    className="w-full md:w-1/2 min-h-[50vh] md:min-h-[100vh] relative overflow-hidden group"
    onClick={handleDoctorClick}
  >
    <div className="absolute inset-0 bg-gradient-to-l transition-all duration-500 ease-in-out group-hover:from-blue-500 group-hover:to-blue-800 z-0 origin-right scale-x-0 group-hover:scale-x-100 transform" />
    <h1 className="relative z-10 group-hover:text-white transition-colors duration-250 text-center  md:text-center px-4 md:px-0">
      I'm a Doctor
    </h1>
  </button>

  <img
    src={logo}
    alt="Logo"
    className="hidden md:block w-[230px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 rounded-lg shadow-2xl"
  />

  <button
    className="w-full md:w-1/2 min-h-[50vh] md:min-h-[100vh] relative overflow-hidden group"
    onClick={handlePatientClick}
  >
    <div className="absolute flex inset-0 bg-gradient-to-r transition-all duration-500 ease-in-out group-hover:from-blue-500 group-hover:to-blue-800 z-0 origin-left scale-x-0 group-hover:scale-x-100 transform" />
    <h1 className="relative z-10 group-hover:text-white transition-colors duration-250 text-center md:text-center px-4 md:px-0">
      I'm looking for a Doctor
    </h1>
  </button>

</div>

  );
};

export default ProfileSelection;
