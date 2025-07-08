import { NavLink, Link, useNavigate } from "react-router-dom";
import './Header.css';
import { useState, useEffect, useContext } from "react";
import { Userdata } from "../ContextApi/Context";
import { AuthContext } from "../ContextApi/AuthContext";
import axios from "axios";
import { toast } from 'react-toastify';

const Header = () => {
  const [navbarRole, setNavbarRole] = useState("");

  const { isLogin, role, user, setUser, setIsLogin } = useContext(AuthContext);
  const { loged, logout } = useContext(Userdata);
  const navigate = useNavigate();

  // Load role from localStorage
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setNavbarRole(storedRole);
    }
  }, []);


  const handleToggleRole = () => {
    const newRole = navbarRole === "doctor" ? "patient" : "doctor";
    setNavbarRole(newRole);
    localStorage.setItem("role", newRole);
    toast.info(`Switched to ${newRole}`, { autoClose: 1500 });
    navigate(newRole === "doctor" ? "/doc_home" : "/home");
  };

  const handleLogout = async () => {
    try {
      const res = await axios.post("http://localhost:3000/api/patient/logout");
      if (res.data.success) {
        alert(res.data.message);
        setIsLogin(false);
        setUser(null);
        localStorage.removeItem("role");

        toast.success("Logout Successfully!", {
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        navigate("/home");
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const currentRole = navbarRole || user?.role;

  return (
    <>
      <nav className="bg-white shadow-lg fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold text-blue-600">
                <NavLink to={currentRole === "doctor" ? "/doc_home" : "/home"}>
                DocSlot
              </NavLink>
              </div>

             { !isLogin &&
              <button
                onClick={handleToggleRole}
                className="px-3 py-1 bg-gray-200 text-sm rounded hover:bg-blue-100 text-blue-700 font-semibold transition"
              >
                Switch to {currentRole === "doctor" ? "Patient" : "Doctor"}
              </button>
             }
    
             
            </div>

          
            <div className="hidden md:flex space-x-6 items-center">
              <NavLink
                to={currentRole === "doctor" ? "/doc_home" : "/home"}
                className="nav-link text-gray-700 hover:text-blue-600 font-medium"
              >
                Home
              </NavLink>

              <NavLink
                to="/about"
                className="nav-link text-gray-700 hover:text-blue-600 font-medium"
              >
                About
              </NavLink>

              {currentRole === "doctor" ? (
                <Link to="/doc_profile">
                  <button className="text-gray-700 hover:text-blue-600 font-medium">
                    DocDashboard
                  </button>
                </Link>
              ) : (
                <div className="flex flex-row gap-4">
                  <NavLink
                    to="/doctor"
                    className="nav-link text-gray-700 hover:text-blue-600 font-medium"
                  >
                    BookAppointment
                  </NavLink>

                  {isLogin ? (
                    <div className="flex flex-row gap-3">
                      <NavLink
                        to="/pt_profile"
                        className="text-gray-700 hover:text-blue-600 font-medium"
                      >
                        Dashboard
                      </NavLink>
                      <NavLink
                        onClick={handleLogout}
                        className="text-gray-700 hover:text-red-600 font-medium cursor-pointer"
                      >
                        Logout
                      </NavLink>
                    </div>
                  ) : (
                    <NavLink
                      to="/pt_profile"
                      className="text-gray-700 hover:text-blue-600 font-medium"
                    >
                      Login
                    </NavLink>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
