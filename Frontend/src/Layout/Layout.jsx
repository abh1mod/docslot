import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import './Layout.css'
import { useNavigation } from "react-router-dom";
import Loading from "../pages/Loading";
import Provider from "../ContextApi/Context"
function Layout(){
    const Navigate=useNavigation();
   
    if(Navigate.state==="loading") return <Loading/>
    return<>
     <Provider>
    <div className="layout">
    <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
      </Provider>
    </>
}

export default Layout;