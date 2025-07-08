import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    
    const [role,setRole]=useState("");
    const [isLogin, setIsLogin] = useState(false);
    const [user, setUser] = useState(null);
    const fetchUser = async () => {
            try {
            const res = await axios.get(`${BASE_URL}/api/my_profile`, {
                withCredentials: true,
            });
            if(res.data.success) {
                setIsLogin(true);
                setUser(res.data.data);
                console.log(isLogin);
                console.log("User fetched:", res.data.data);
            }else{
                setIsLogin(false);
                setUser(null);
            }
            } catch (error) {
                setIsLogin(false);
                setUser(null);
                console.log("User not logged in");
            }
        };

    useEffect(()=>{
       fetchUser();
    },[]);

    useEffect(() => {
      let timeoutId;

      if (isLogin) {
          timeoutId = setTimeout(() => {
              alert("Session timed out. Please log in again.");
              window.location.href = "/";
          }, 20 * 60 * 1000);
      }

      return () => {
          clearTimeout(timeoutId); 
      };
  }, [isLogin]);



  return (
    <AuthContext.Provider value={{ isLogin, setIsLogin, user, setUser, fetchUser,role,setRole}}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export {useAuth, AuthProvider,AuthContext };