import { NavLink } from "react-router-dom";
import './Header.css'
import { useState } from "react";
import { Userdata } from "../ContextApi/Context"; 
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

//import the userdata so that contextapi data can be used


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
          DocSlot
        </div>

     
        <div className="hidden md:flex space-x-6">
          
          <NavLink to='/' className={({ isActive }) => (isActive ? 'active' : 'text-gray-800 font-semibold')}>Home</NavLink>
          <NavLink to='/about'  className={({ isActive }) => (isActive ? 'active' : 'text-gray-800 font-semibold')}>About</NavLink>
          <NavLink to='/doctor'  className={({ isActive }) => (isActive ? 'active' : 'text-gray-800 font-semibold')}>Doctor</NavLink>  
         {/*loged be access through context api and user be fetch from local storage
            if user is not in local storage logout will not be shown*/}
         {loged && user ? <span className="flex items-center gap-4">
         {/*have link so that if any one click on this redirect to own profile and here
         in button we call logout function that we can access through context api that logout function
         first set loged to false and rerender the context api and respective component who are using it remove data from localstorage*/}
         {<Link to={`/doctor/${user.doc_id}`}><span className="flex"><img className="w-7 h-7 rounded-xl" src={user.image}/>{user.name}</span> </Link>} <button onClick={logout} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">
  logout
</button></span> :
         <div className="flex gap-2">
             <h3>Login As :-</h3>
          <NavLink to="/login_doc"  className={( {isActive} ) => (isActive ? 'active' : 'text-gray-800 font-semibold')}><button>Doctor</button></NavLink> 
          <NavLink to="/login_pt"  className={({ isActive }) => (isActive ? 'active' : 'text-gray-800 font-semibold')}><button>Patient</button></NavLink>
         </div>
          
         }
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