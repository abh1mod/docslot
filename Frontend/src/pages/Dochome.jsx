import { Link, NavLink } from "react-router-dom";
import React from 'react';
import '../index.css'; // Ensure you have Tailwind CSS set up in your project
import TextButton from "../components/HomePage/TextButton";
import doctor from "../assets/doctor.png"
import back from "../assets/Vector.png"
import {home} from "../data/home"
import Button from "../components/HomePage/Button";
import container from "../assets/Container.jpeg"
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
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

const Home=()=>{
  const navigate = useNavigate();
   const [doctors, setDoctors] = useState([]);


    return (
  <>
    <div className="w-full">
      {/* Hero Section */}
      <div className="w-11/12 mx-auto items-center flex lg:flex-row flex-col-reverse mt-16 gap-4 justify-between">
        {/* Text Section */}
        <div className="lg:w-2/3 flex flex-col">
          <TextButton
            heading="Smarter Scheduling. Better Care. More Time for Patients."
            subheading="Simplify your medical practice with our intelligent appointment scheduling system. Reduce no-shows, stay organized, and give your patients the attention they deserve — without drowning in paperwork."
          />
          <div className="flex flex-row mt-10 gap-6">
            <Link to="/doc_profile">
              <Button text="Manage Appointments" bg={true} />
            </Link>
            <Button text="Watch Demo" video={true} />
          </div>
        </div>

        {/* Image Section */}
        <div className="lg:w-1/3 items-center flex flex-col">
          <img className="top-10" src={doctor} alt="Doctor working" />
        </div>
      </div>

      {/* Stats Section */}
      <div className="w-11/12 mx-auto">
        <div className="flex flex-col mt-20 gap-8 items-center text-center pb-6">
          <p className="text-2xl font-semibold text-[#007E85]">Your Impact in Numbers</p>
          <div className="flex lg:flex-row flex-col gap-5 w-full justify-between">
            {home.map((ele, id) => (
              <div key={id} className="text-black">
                <p className="text-2xl font-semibold text-[#007E85]">{ele.heading}</p>
                <p className="text-xl font-medium">{ele.subheading}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <NavLink className="flex lg:flex-row flex-col mt-20 justify-between items-center gap-6">
          {dochome.map((ele, id) => (
            <div
              key={id}
              className="bg-gray-200 rounded-2xl text-[#007E85] hover:shadow-lg transition-shadow duration-300"
            >
              <Dochome
                logo={ele.logo}
                heading={ele.heading}
                subheading={ele.subheading}
              />
            </div>
          ))}
        </NavLink>

        {/* Services */}
        <div className="flex flex-col text-center mt-20">
          <TextButton
            heading="Tools & Services to Grow Your Practice"
            subheading="From online appointment booking to patient record management, we provide everything you need to run a smooth and efficient practice."
          />
        </div>
        {/* <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8 mt-16">
          {services.map((ele, id) => (
            <div
              key={id}
              className="bg-gray-200 rounded-3xl p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <img src={ele.src} alt={ele.heading} />
              <p className="text-lg text-[#007E84] font-semibold mt-4">
                {ele.heading}
              </p>
              <p className="mt-2 text-gray-500 mb-3 font-medium">
                {ele.subheading}
              </p>
              <div className="flex flex-row gap-1 items-center">
                <button className="text-[#007E84] font-semibold">
                  Learn more
                </button>
                <FaArrowRight className="text-[#007E84]" />
              </div>
            </div>
          ))}
        </div> */}

        {/* Trusted By */}
 
      </div>
    </div>
  </>
);
}

export default Home;