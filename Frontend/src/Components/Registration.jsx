import { useState } from "react";

const Registration=()=>{

    const[user,setuser]=useState({
        doc_name:"",
        specialization:"",
        phone: "NaN",
        email:"",
        room_no:"Nan"
    })

    const handleChange = (e) => {
    const { name, value } = e.target;
    setuser((prev) => ({ ...prev, [name]: value }));
  };

 const handleRegister = async (e) => {
    e.preventDefault();
    console.log(user);
    try{
    const response=await fetch(`http://localhost:3000/api/doc_register`,{
        method:"POST",
        headers:{
            'Content-Type':"application/json",
        },
        body:JSON.stringify(user)
    });
    console.log(response)
}
catch(error){
     console.log(error)
}
  };




return (<>
    
  <form onSubmit={handleRegister} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
    <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Doctor Registration</h2>

    <div className="mb-4">
      <label  className="block text-gray-700 font-semibold mb-2">Name</label>
      <input type="text" id="name" name="doc_name" required value={user.doc_name} onChange={handleChange}
             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
    </div>

    <div className="mb-4">
      <label  className="block text-gray-700 font-semibold mb-2">Specialization</label>
      <input type="text" id="specialization" name="specialization" required value={user.specialization} onChange={handleChange}
             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
    </div>

    <div className="mb-6">
      <label  className="block text-gray-700 font-semibold mb-2">Email</label>
      <input type="email" id="email" name="email" required value={user.email} onChange={handleChange}
             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
    </div>

    <button type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200">
      Register
    </button>
  </form>
</>
);
}

export default Registration;
