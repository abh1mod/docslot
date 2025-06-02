import './App.css'
// import Registration from './Components/Registration'
import Layout from './Layout/Layout'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from './pages/Home';
import About from './pages/About';
import Doctor from './pages/Doctor';
import Error from './pages/Eroor';


 const router=createBrowserRouter([
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
