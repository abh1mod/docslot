import { NavLink } from "react-router-dom";
import './Header.css'

const Header=()=>{
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
         
         <h3>Login As :-</h3>
          <NavLink to="/login_doc"  className={( {isActive} ) => (isActive ? 'active' : 'text-gray-800 font-semibold')}><button>Doctor</button></NavLink> 
          <NavLink to="/login_pt"  className={({ isActive }) => (isActive ? 'active' : 'text-gray-800 font-semibold')}><button>Patient</button></NavLink>
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