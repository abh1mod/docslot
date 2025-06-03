import './App.css'
// import Registration from './Components/Registration'
import Layout from './Layout/Layout'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from '/src/Pages/Home';
import About from '/src/Pages/Home';
import Doctor from '/src/Pages/Home';
import Error from '/src/Pages/Home';


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
