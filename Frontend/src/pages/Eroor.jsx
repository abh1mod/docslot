import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const Error=()=>{
const navigate=useNavigate();
const handlepage=()=>{
    navigate(-1);
}
    return <>
       
<img src="/Images/Error.jpg" alt="404 - Not Found" className="max-w-md w-full mx-auto" />


<div className="text-center mt-6">
  <p className="text-gray-400 mt-1">... Back to previous page</p>
</div>


<div className="mt-6 flex justify-center gap-4">
  <button onClick={handlepage} className="bg-red-700 hover:bg-red-800 text-white px-5 py-2 rounded shadow-md">
    Go Back To Previous Page
  </button>
  <NavLink to="/" className="bg-red-700 hover:bg-red-800 text-white px-5 py-2 rounded shadow-md">
    Back To HomePage
  </NavLink>
</div>

    </>
}

export default Error;