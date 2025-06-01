import './App.css'
import RegistrationDoc from './Pages/LoginPages/RegistrationDoc';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginDoc from './Pages/LoginPages/LoginDoc';
import DoctorProfile from './Pages/DoctorProfile';
import HomePage from './Pages/HomePage';
import RegistrationPt from './Pages/LoginPages/RegistrationPt'
import LoginPt from './Pages/LoginPages/LoginPt';
function App() {
  return (
    <div>
  <Router>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/registration_doc" element={<RegistrationDoc/>}/>   
            <Route path="/login_doc" element={<LoginDoc/>} />
            <Route path="/doctor/:doc_id" element={<DoctorProfile />} />
            <Route path="/registration_pt" element={<RegistrationPt/>}/>
            <Route path="/login_pt" element={<LoginPt/>}/>
        </Routes>
    </Router>
    </div>
    
    
  )
}

export default App
