
import React, { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
// Create a context
export const Userdata = createContext();

// Provider component
//first letter should be capital
const Provider = ({ children }) => {
  const navigate=useNavigate();
  //usestate that can be use in header and doc login
  //here bool value of logged decide on basis of user whether present in local storage or not
  //"!!" make value boolean
  const [loged, setLoged] = useState(!!localStorage.getItem("user"));
  //logout function
  const logout = () => {
    localStorage.removeItem("user");
    setLoged(false);
    navigate("/");
  };

  const edit=()=>{
    
  }

  return (
    <Userdata.Provider value={{ loged, setLoged ,logout }}>
      {children}
    </Userdata.Provider>
  );
};

export default Provider;
