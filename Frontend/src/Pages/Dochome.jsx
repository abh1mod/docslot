import { Link, NavLink } from "react-router-dom";
import React from 'react';
import '../index.css'; // Ensure you have Tailwind CSS set up in your project
import TextButton from "../components/HomePage/TextButton";
import doctor from "../assets/doctor.png"
import back from "../assets/Vector.png"
import {home} from "../data/home"
import Button from "../components/HomePage/Button";
import container from "../assets/Container.png"
import { services } from "../data/services";
import { FaArrowRight } from "react-icons/fa6";
import { useState,useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaPinterest } from "react-icons/fa";
import { FaTwitch } from "react-icons/fa";
import { FaWebflow } from "react-icons/fa6";
import { FaMicrosoft } from "react-icons/fa";
import { dochome } from "../data/dochome";
import Dochome from "../components/HomePage/Dochome";

const Home=()=>{

   const [doctors, setDoctors] = useState([]);

   useEffect(() => {    
    const fetchDoctors = async () => {
      try {
        const result = await axios.get("http://localhost:3000/api/fetch_all");
       
        if (result.data.success) {
          setDoctors(result.data.data);
          console.log(doctors)
        } else {
          console.error('Error fetching doctors:', result.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
      fetchDoctors();
    }
  }
)
    return <>
        <div className="w-full">
          <div className="w-11/12 mx-auto items-center flex lg:flex-row flex-col-reverse mt-16 gap-4 justify-between">
             <div className="lg:w-2/3 flex flex-col">
             <TextButton heading={"Smarter Scheduling,Better Care,More Time for Patients, Less Time on Paperwork"} 
             subheading={"Simplify your practice with smart appointment scheduling. Our platform helps doctors manage bookings, reduce no-shows, and stay organized — so you can focus more on patient care and less on paperwork."}/>
              <div className='flex flex-row mt-10 gap-6'>
            <Button text={"Manage Appointments"} bg={true}/>
            <Button text={"Watch Video"} video={true}/>
        </div>
             </div>
             <div className=" lg:w-1/3 items-center flex flex-col">
            <img className="top-10 " src={doctor}/>
             </div>
          </div>
          <div className="w-11/12 mx-auto">
            <div className="flex flex-col mt-32 gap-8 items-center text-center pb-6">
              <p className="text-2xl font-semibold text-[#007E85]">Our results in numbers</p>
              <div className="flex lg:flex-row flex-col gap-5 w-full justify-between">
              {
                home.map((ele,id)=>(
                  <div key={id} className="text-black">
                    <p className="text-2xl font-semibold text-[#007E85]">{ele.heading}</p>
                    <p className="text-xl font-medium">{ele.subheading}</p>
                  </div>
                ))
              }
              </div>
            </div>
            {/* //changes */}
            <NavLink className="flex lg:flex-row flex-col mt-32 justify-between items-center gap-6">
             {dochome.map((ele,id)=>(
                <div key={id} className="bg-gray-200 rounded-2xl text-[#007E85]">
                <Dochome logo={ele.logo} heading={ele.heading} subheading={ele.subheading}/>
                </div>
             ))}
            </NavLink>
            <div className="flex flex-col text-center mt-24">
              <TextButton heading={"Services we provide"} subheading={"Lorem ipsum dolor sit amet consectetur adipiscing elit semper dalar elementum tempus hac tellus libero accumsan. "}/>
            </div>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1  gap-8 mt-16">
              {services.map((ele,id)=>(
                <div key={id} className="bg-gray-200 rounded-3xl p-6">
                  <img className="" src={ele.src}/>
                  <p className="text-lg text-[#007E84] font-semibold mt-4">
                    {ele.heading}
                  </p>
                  <p className="mt-2 text-gray-500 mb-3 font-medium">
                    {ele.subheading}
                  </p>
                  <div className="flex flex-row gap-1 items-center">
                    <button className="text-[#007E84] font-semibold">Learn more</button>
                    <FaArrowRight className="text-[#007E84]" />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-6 items-center mt-28">
              <p  className="lg:text-4xl text-3xl text-[#007E84] font-semibold">Trusted by 10,000+ companies around the world</p>
              <div className="flex flex-row gap-4 mt-8 justify-between lg:text-5xl text-3xl w-full">
               <FcGoogle/>
               <FaFacebook/>
               <FaYoutube/>
               <FaMicrosoft/>
               <FaPinterest/>
               <FaWebflow/>
               <FaTwitch/>
              </div>
            </div>
          </div>
        </div>

    </>
}

export default Home;