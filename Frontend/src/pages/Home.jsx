import { Link } from "react-router-dom";
import React from 'react';
import '../index.css'; // Ensure you have Tailwind CSS set up in your project
import TextButton from "../components/HomePage/TextButton";
import doctor from "../assets/image 17.png"
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
import { useNavigate } from "react-router-dom";

const Home=()=>{
    const navigate = useNavigate();
//    const [doctors, setDoctors] = useState([]);

//    useEffect(() => {    
//     const fetchDoctors = async () => {
//       try {
//         const result = await axios.get("http://localhost:3000/api/fetch_all");
       
//         if (result.data.success) {
//           setDoctors(result.data.data);
//           console.log(doctors)
//         } else {
//           console.error('Error fetching doctors:', result.message);
//         }
//       } catch (error) {
//         console.error('Error:', error);
//       }
//       fetchDoctors();
//     }
//   }
// )
    return <>
        <div className="w-full">
          <div className="w-11/12 mx-auto items-center flex lg:flex-row flex-col-reverse mt-16 gap-4 justify-between">
             <div className="lg:w-2/3 flex flex-col">
             <TextButton heading={"Providing Quality Healthcare for a Brighter and Healthy Future"} 
             subheading={"Managing a clinic shouldn’t mean managing chaos. Our platform empowers doctors with an intuitive, efficient, and secure solution to schedule appointments, reduce no-shows, and focus more on what matters most — patient care. With real-time updates, automated reminders, and easy calendar access, you stay in control of your day, effortlessly. Let us handle the scheduling, so you can handle the healing."}/>
              <div className='flex flex-row mt-10 gap-6'>
            <Link to="/doctor"><Button text={"Appointments"} bg={true}/></Link>
            
            <Button text={"Watch Video"} video={true}/>
        </div>
             </div>
             <div className="lg:relative lg:w-1/3 items-center flex flex-col">
            <img className="lg:absolute top-10  lg:h-[90%] lg:w-[70%] h-[70%] w-[60%]" src={doctor}/>
            <img className="lg:object-cover hidden lg:block"  src={back}/>
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
            <div className="flex lg:flex-row flex-col mt-32 items-center lg:gap-6 gap-10">
            <div>
              <TextButton heading={"You have lots of reasons to choose us"}
                subheading={"Lorem ipsum dolor sit amet consectetur adipiscing eli mattis sit phasellus mollis sit aliquam sit nullam."}
              />
                <div className='flex flex-row mt-10 gap-6'>
              <Button text={"Get Started"} bg={true}/>
              <Button text={"Talk To Sales"}/>
              </div>
            </div>
            <img className="lg:w-[40%] rounded-full h-[40%]" src={container}/>
            </div>
            <div className="flex flex-col text-center mt-24">
              <TextButton heading={"Services we provide"} subheading={"Lorem ipsum dolor sit amet consectetur adipiscing elit semper dalar elementum tempus hac tellus libero accumsan. "}/>
            </div>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 grid-rows-2 gap-8 mt-16">
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
              <p  className="lg:text-4xl md:text-3xl text-2xl  text-[#007E84] font-semibold">Trusted by 10,000+ companies around the world</p>
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