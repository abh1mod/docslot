import './App.css'
import Layout from './Layout/Layout'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from './pages/Home';
import About from './pages/About';
import Doctor from './Pages/Doctor.jsx';
import Error from './pages/Eroor';
import RegistrationDoc from './pages/LoginPages/RegistrationDoc.jsx';
import LoginDoc from './pages/LoginPages/LoginDoc';
import RegistrationPt from './pages/LoginPages/RegistrationPt.jsx';
import LoginPt from './Pages/LoginPages/LoginPt';
import ProfileSelection from './Pages/ProfileSelection.jsx'
import DoctorProfile from './pages/DoctorProfile';
import PtProfileEdit from './Pages/PtProfileEdit.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookingPortal from './Pages/BookingPortal';
import PtProfile from './Pages/PtProfile.jsx';


 const router=createBrowserRouter([
    {
      path:"select_profile",
      element:<ProfileSelection/>
    },
      {
        path:"/",
        element:<Layout/>,
        errorElement:<Error/>,
        children:[
            {
        path :"/",
        element :<Home/>
      },
      {
        path:"/about",
        element:<About/>
      },
      {
        path:"/doctor",
        element:<Doctor/>
      },
      {
        path:"/registration_doc",
        element:<RegistrationDoc/>
      },
      {
        path:"/login_doc",
        element:<LoginDoc/>
      },
      {
        path:"/doctor/:doc_id",
        element:<DoctorProfile/>
      },
      {
        path:"/registration_pt",
        element:<RegistrationPt/>
      },
      {
        path:"/login_pt",
        element:<LoginPt/>
      },
      {
        path:"/booking/:doc_id",
        element:<BookingPortal/>
      },
      {
        path:"/pt_profile/:pt_id",
        element:<PtProfile/>
      },{
        path:"/pt_edit/:pt_id",
        element:<PtProfileEdit/>
      }
    
        ]
      },
      
     ])


function App() {
  return (
    <>
      {/* <Layout/> */}
   <RouterProvider router={router}/>
    </>
  )
}

export default App
