import { Link } from "react-router-dom";
import React from 'react';
import '../index.css'; // Ensure you have Tailwind CSS set up in your project
import TextButton from "../components/HomePage/TextButton";
import doctor from "../assets/image 17.png"
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
import { useNavigate } from "react-router-dom";

const Home=()=>{
    return (
  <>
    <div className="w-full">
      {/* Hero Section */}
      <div className="w-11/12 mx-auto items-center flex lg:flex-row flex-col-reverse mt-16 gap-4 justify-between">
        {/* Text Section */}
        <div className="lg:w-2/3 flex flex-col">
          <TextButton
            heading="Your Health, Our Priority — Book Appointments with Ease"
            subheading="Say goodbye to long waits and endless phone calls. Our platform makes it simple for you to find the right doctor, choose a time that works for you, and manage your health from the comfort of your home. Fast, secure, and designed with your needs in mind."
          />
          <div className="flex flex-row mt-10 gap-6">
            <Link to="/doctor">
              <Button text="Book Appointment" bg={true} />
            </Link>
            <Link to="/services">
              <Button text="Explore Services" />
            </Link>
          </div>
        </div>

        {/* Image Section */}
        <div className="lg:relative lg:w-1/3 items-center flex flex-col">
          <img
            className="lg:absolute top-10 lg:h-[90%] lg:w-[70%] h-[70%] w-[60%]"
            src={doctor}
            alt="Doctor"
          />
          <img
            className="lg:object-cover hidden lg:block"
            src={back}
            alt="Background"
          />
        </div>
      </div>

      {/* Stats Section */}
      <div className="w-11/12 mx-auto">
        <div className="flex flex-col mt-20 gap-8 items-center text-center pb-6">
          <p className="text-2xl font-semibold text-[#007E85]">
            Our impact in numbers
          </p>
          <div className="flex lg:flex-row flex-col gap-5 w-full justify-between">
            {home.map((ele, id) => (
              <div key={id} className="text-black">
                <p className="text-2xl font-semibold text-[#007E85]">
                  {ele.heading}
                </p>
                <p className="text-xl font-medium">{ele.subheading}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="flex lg:flex-row flex-col mt-15 md:mt-20 items-center lg:gap-6 gap-10">
          <div>
            <TextButton
              heading="We Care for You and Your Family"
              subheading="From routine check-ups to specialist consultations, we make healthcare more accessible and stress-free. Your well-being is at the heart of everything we do."
            />
            <div className="flex flex-row mt-10 gap-6">
              <Button text="Get Started" bg={true} />
              <Button text="Contact Us" />
            </div>
          </div>
          <img
            className="lg:w-[40%] rounded-[8%] h-[40%]"
            src={container}
            alt="Happy Patients"
          />
        </div>

        {/* Services */}
        <div className="flex flex-col text-center mt-20">
          <TextButton
            heading="Healthcare Services for Every Need"
            subheading="Whether it’s a quick consultation or ongoing treatment, we connect you to the care you deserve."
          />
        </div>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 grid-rows-2 gap-8 mt-16">
          {services.map((ele, id) => (
            <div key={id} className="bg-gray-200 rounded-3xl p-6">
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
        </div>

        {/* Trusted By */}
        <div className="flex flex-col gap-6 items-center mt-28">
          {/* <p className="lg:text-4xl md:text-3xl text-2xl text-[#007E84] font-semibold">
            Trusted by thousands of patients worldwide
          </p>
          <div className="flex flex-row gap-4 mt-8 justify-between lg:text-5xl text-3xl w-full">
            <FcGoogle />
            <FaFacebook />
            <FaYoutube />
            <FaMicrosoft />
            <FaPinterest />
            <FaWebflow />
            <FaTwitch />
          </div> */}
        </div>
      </div>
    </div>
  </>
);
}

export default Home;