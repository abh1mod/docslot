import { SlCalender } from "react-icons/sl";
import { FaUserDoctor } from "react-icons/fa6";
import { MdOutlinePhoneIphone } from "react-icons/md";

const About = () => {
  return (
    <>
     <div>
      <div className="w-11/12 mx-auto">
      <p className="lg:text-5xl text-4xl font-bold text-[#007E84]">
        Welcome To <span className="lg:text-5xl text-4xl text-blue-600">DocSlot</span>
      </p>
      <div className="flex flex-col gap-6 mt-24 items-center">
        <p className="text-5xl text-blue-500 font-bold">
          About Us
        </p>
        <p className="text-medium font-medium text-gray-500">
          Welcome to our doctor appointment booking platform. We are dedicated to providing a convenient and efficient way for patients to connect with qualified healthcare professionals. Our mission is to simplify the process of booking appointments and managing healthcare needs. With our user-friendly interface and comprehensive database of trusted doctors, we strive to make healthcare more accessible for everyone.
        </p>
      </div>
      <div className="mt-24 flex md:flex-row flex-col gap-16 justify-between">
        <div className="flex flex-col items-center gap-2">
           <SlCalender className="text-7xl text-blue-600"/>
           <p className="font-semibold text-xl text-[#007E84] ">Easy Appointemnt Sheduling</p>
           <p className="text-gray-500 text-medium font-medium">Booking Appointments just by few clicks</p>
        </div>
         <div className="flex flex-col items-center gap-2">
           <FaUserDoctor className="text-7xl text-blue-600"/>
           <p className="font-semibold text-xl text-[#007E84] ">Qualified Doctors</p>
           <p className="text-gray-500 text-medium font-medium">Access a network of excellent healthcare providers</p>
        </div>
         <div className="flex flex-col items-center gap-2">
           <MdOutlinePhoneIphone className="text-7xl text-blue-600"/>
           <p className="font-semibold text-xl text-[#007E84] ">Manage Appointemnt</p>
           <p className="text-gray-500 text-medium font-medium">View and manage your Appointments online</p>
        </div>
      </div>
      </div>
     </div>
    </>
  );
};

export default About;
