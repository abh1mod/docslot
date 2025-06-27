import { NavLink } from "react-router-dom";
import './Header.css'
import { useState } from "react";
import { Userdata } from "../ContextApi/Context"; 
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";


const Header=()=>{
   const { loged, logout } = useContext(Userdata);
    const navigate=useNavigate();
    // parsing the data from localstorage as it holds only string data type
    const user=JSON.parse(localStorage.getItem("user"))

    return <>
        <nav className="bg-white shadow-lg fixed w-full z-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        

        <div className="flex-shrink-0 text-2xl font-bold text-blue-600">
        <NavLink to = "/">DocSlot</NavLink>
        </div>

     
        <div className="hidden md:flex space-x-6">
          
          <NavLink to='/about' className="nav-link text-gray-700 hover:text-blue-600 font-medium">About</NavLink>
          <NavLink to='/doctor' className="nav-link text-gray-700 hover:text-blue-600 font-medium">BookAppointment</NavLink>  
         
          <Link to="/pt_profile"><button>PtDashboard</button></Link>
          <Link to="/doc_profile"><button>DocDashboard</button></Link>
        </div>

    
        <div className="md:hidden">
          <button  className="text-gray-700 hover:text-blue-600 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
                 viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

 
    <div id="mobileMenu" className="md:hidden hidden px-4 pb-4 space-y-2">
      <NavLink to='/' className="block text-gray-700 hover:text-blue-600 font-medium">Home</NavLink>
      <NavLink to='/about' className="block text-gray-700 hover:text-blue-600 font-medium">About</NavLink>
      <NavLink to='/doctor' className="block text-gray-700 hover:text-blue-600 font-medium">Doctor</NavLink>
    </div>
  </nav>
    </>
}
export default Header;