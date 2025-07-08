import { useState,useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout/Layout';
import ProfileSelection from './pages/ProfileSelection';
import Error from './pages/Eroor';
import Home from './pages/Home';
import About from './pages/About';
import Doctor from './pages/Doctor';
import RegistrationDoc from './pages/LoginPages/RegistrationDoc';
import LoginDoc from './pages/LoginPages/LoginDoc';
import RegistrationPt from './pages/LoginPages/RegistrationPt';
import LoginPt from './pages/LoginPages/LoginPt';
import DoctorProfile from './pages/DoctorProfile';
import PtProfileEdit from './pages/PtProfileEdit';
import BookingPortal from './pages/BookingPortal';
import PtProfile from './pages/PtProfile';
import Dochome from './pages/Dochome';
import { useContext } from 'react';
import { AuthContext } from './ContextAPI/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const { isLogin } = useContext(AuthContext);
  const [profileSelected, setProfileSelected] = useState(false);
  const [userRole, setUserRole] = useState(null); // store actual role value

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role) {
      setProfileSelected(true);
      setUserRole(role); // save role for later routing
    }
  }, []);

  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />

      {(!profileSelected && !isLogin) ? (
        <ProfileSelection onSelect={() => {
          setProfileSelected(true);
          const savedRole = localStorage.getItem("role");
          if (savedRole) setUserRole(savedRole);
        }} />
      ) : (
        <Routes>
          <Route path="/" element={<Layout />}>
            
            <Route
              index
              element={<Navigate to={userRole === "doctor" ? "/doc_home" : "/home"} />}
            />

            <Route path="home" element={<Home />} />
            <Route path="doc_home" element={<Dochome/>} />
            <Route path="about" element={<About />} />
            <Route path="doctor" element={<Doctor />} />
            <Route path="registration_doc" element={<RegistrationDoc />} />
            <Route path="login_doc" element={<LoginDoc />} />
            <Route path="doc_profile" element={<DoctorProfile />} />
            <Route path="registration_pt" element={<RegistrationPt />} />
            <Route path="login_pt" element={<LoginPt />} />
            <Route path="booking/:doc_id" element={<BookingPortal />} />
            <Route path="pt_profile" element={<PtProfile />} />
            <Route path="pt_edit/:pt_id" element={<PtProfileEdit />} />
            <Route path="*" element={<Error />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}


export default App;
