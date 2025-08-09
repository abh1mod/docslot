import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import './Layout.css'
import { useNavigate } from "react-router-dom";
import Loading from "../pages/Loading";
import Provider from "../ContextAPI/Context"
function Layout(){
    const Navigate=useNavigate();
   
    if(Navigate.state==="loading") return <Loading/>
    return<>
     <Provider>
    <div className="layout w-screen">
    <Header />
      <main className="main-content w-full p-0 md:p-3 ">
        <Outlet />
      </main>
      <Footer />
    </div>
      </Provider>
    </>
}

export default Layout;