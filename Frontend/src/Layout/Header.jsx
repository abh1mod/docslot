import { NavLink, Link, useNavigate } from "react-router-dom";
import './Header.css';
import { useState, useEffect, useRef, useContext } from "react";
import { Userdata } from "../ContextAPI/Context";
import { AuthContext } from "../ContextAPI/AuthContext";
import axios from "axios";
import { toast } from 'react-toastify';

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

const Header = () => {
  const [navbarRole, setNavbarRole] = useState("");
  const [open, setOpen] = useState(false); // desktop role dropdown
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // mobile sidebar
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { isLogin, role, user, setUser, setIsLogin } = useContext(AuthContext);
  const { logout } = useContext(Userdata);

  // Load role from localStorage
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) setNavbarRole(storedRole);
  }, []);

  // Close desktop dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentRole = navbarRole || user?.role || "patient";

  const handleToggleRole = (fromMobile = false) => {
    const newRole = currentRole === "doctor" ? "patient" : "doctor";
    setNavbarRole(newRole);
    localStorage.setItem("role", newRole);
    toast.info(`Switched to ${newRole}`, { autoClose: 1200 });
    navigate(newRole === "doctor" ? "/doc_home" : "/home");
    setOpen(false);
    if (fromMobile) setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      // Try both patient and doctor logout endpoints or a unified logout
      // Adjust according to your backend
      await axios.post(`${BASE_URL}/api/patient/logout`).catch(() => {});
      await axios.post(`${BASE_URL}/api/doctor/logout`).catch(() => {});

      setIsLogin(false);
      toast.success("Logout Successfully!", { autoClose: 1500 });
      if (currentRole === "doctor") navigate("/doc_home");
      else navigate("/home");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-20 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-16">

          {/* Logo + desktop role (if not logged in) */}
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-blue-600 hover:text-blue-700">
                <NavLink to={currentRole === "doctor" ? "/doc_home" : "/home"}>
                DocSlot
              </NavLink>
              </div>

            {/* Desktop role switcher */}
            {!isLogin && (
              <div ref={dropdownRef} className="relative hidden md:block">
                <button
                  onClick={() => setOpen((v) => !v)}
                  className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  {currentRole === "doctor" ? "Doctor" : "Patient"}
                  <svg
                    className={`w-4 h-4 transform transition-transform ${open ? "rotate-180" : ""}`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {open && (
                  <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1">
                    <div className="px-4 py-2 text-sm text-gray-600">Current Role: <span className="font-semibold">{currentRole}</span></div>
                    <button
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 text-sm"
                      onClick={() => handleToggleRole(false)}
                    >
                      Switch to {currentRole === "doctor" ? "Patient" : "Doctor"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to={currentRole === "doctor" ? "/doc_home" : "/home"} className="nav-link">Home</NavLink>
            <NavLink to="/about" className="nav-link">About</NavLink>

            {currentRole === "doctor" ? (
              <NavLink to="/doc_profile" className="nav-link">Dashboard</NavLink>
            ) : (
              <NavLink to="/doctor" className="nav-link">Book Appointment</NavLink>
            )}

{isLogin ? (
  <>
    {currentRole === "patient" && (
      <NavLink to="/pt_profile" className="nav-link">
        Dashboard
      </NavLink>
    )}
    {currentRole === "doctor" && (
      <NavLink to="/doc_profile" className="nav-link">
        Dashboard
      </NavLink>
    )}
    <button onClick={handleLogout} className="btn-primary">
      Logout
    </button>
  </>
) : (
  <>
    {currentRole === "patient" ? (
      <NavLink to="/pt_profile" className="btn-primary">
        Login
      </NavLink>
    ) : (
      <NavLink to="/doc_profile" className="btn-primary">
        Login
      </NavLink>
    )}
  </>
)}

          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="p-2 rounded-md hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-black bg-opacity-40" onClick={() => setMobileMenuOpen(false)}>
          <div className="bg-white w-72 h-full shadow-lg p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-blue-600">Menu</h2>
              <button onClick={() => setMobileMenuOpen(false)}>✕</button>
            </div>

            {/* Mobile role switcher (visible when not logged in) */}
            {!isLogin && (
              <div className="mb-3 p-3 bg-gray-50 rounded-md">
                <div className="text-sm text-gray-600 mb-2">Current Role</div>
                <div className="flex items-center justify-between">
                  <div className="font-medium">{currentRole === "doctor" ? "Doctor" : "Patient"}</div>
                  <button
                    onClick={() => handleToggleRole(true)}
                    className="text-sm px-3 py-1 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100"
                  >
                    Switch to {currentRole === "doctor" ? "Patient" : "Doctor"}
                  </button>
                </div>
              </div>
            )}

            <NavLink to={currentRole === "doctor" ? "/doc_home" : "/home"} className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Home</NavLink>
            <NavLink to="/about" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>About</NavLink>

            {currentRole === "doctor" ? (
              <NavLink to="/doc_profile" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Dashboard</NavLink>
            ) : (
              <NavLink to="/doctor" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Book Appointment</NavLink>
            )}

            <div className="mt-4 border-t pt-3">
  {isLogin ? (
    <>
      {currentRole === "patient" && (
        <NavLink
          to="/pt_profile"
          className="mobile-link"
          onClick={() => setMobileMenuOpen(false)}
        >
          Dashboard
        </NavLink>
      )}
      {currentRole === "doctor" && (
        <NavLink
          to="/doc_profile"
          className="mobile-link"
          onClick={() => setMobileMenuOpen(false)}
        >
          Dashboard
        </NavLink>
      )}
      <button
        onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
        className="block w-full text-left py-2 text-red-600 hover:bg-gray-100"
      >
        Logout
      </button>
    </>
  ) : (
    <NavLink
      to={currentRole === "patient" ? "/pt_profile" : "/doc_profile"}
      className="mobile-link text-blue-600"
      onClick={() => setMobileMenuOpen(false)}
    >
      Login
    </NavLink>
  )}
</div>

          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
