import { Link } from "react-router-dom";
import React from 'react';
import '../index.css'; // Ensure you have Tailwind CSS set up in your project
const Home=()=>{
    return <>
        <div className="flex min-h-screen">
 
  <div className="w-1/2 bg-blue-900 text-white flex flex-col justify-center px-16 py-12">
    <p className="text-sm font-medium mb-2">Your Oral Health Matters to Us</p>
    <div className="h-0.5 w-12 bg-white mb-4"></div>
    <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
      Get Brighter Smile <br />
      from London's Best <br />
      Dentists
    </h1>
  </div>

  <div className="w-1/2 bg-cyan-100 flex items-center justify-center px-8 py-12">
    <div className="bg-white rounded-xl shadow-md w-full max-w-md p-8">
      <h2 className="text-2xl font-semibold text-center mb-6">Book a Free Consultation</h2>
      <div className="h-0.5 w-12 bg-gray-300 mx-auto mb-6"></div>


      <form className="space-y-4">
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="First Name"
            className="w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <input
            type="text"
            placeholder="Last Name"
            className="w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>
        <input
          type="text"
          placeholder="Phone"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
        <textarea
          placeholder="Message"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
          rows="4"
        ></textarea>
        <button
          type="submit"
          className="w-full bg-cyan-400 hover:bg-cyan-500 text-white font-semibold py-2 rounded-md transition duration-200"
        >
          Book Now
        </button>
      </form>
    </div>
  </div>
</div>

    </>
}

export default Home;