import { SlCalender } from "react-icons/sl";
import { FaUserDoctor } from "react-icons/fa6";
import { MdOutlinePhoneIphone } from "react-icons/md";

const About = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="w-11/12 max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl lg:text-5xl font-bold text-[#007E84] text-center">
          Welcome To <span className="text-blue-600">DocSlot</span>
        </h1>

        {/* About Text */}
        <div className="flex flex-col gap-6 mt-12 items-center text-center">
          <h2 className="text-3xl font-bold text-blue-500">About Us</h2>
          <p className="text-lg leading-relaxed font-medium text-gray-600 max-w-4xl">
            DocSlot is your all-in-one platform for booking and managing medical
            appointments with ease. Our mission is to connect patients with
            trusted healthcare professionals while providing doctors with tools
            to manage their practice efficiently.
          </p>
        </div>

        {/* Why Beneficial */}
        <div className="mt-16 grid md:grid-cols-2 gap-10 text-center">
          <div className="bg-white shadow-md rounded-2xl p-8 hover:shadow-lg transition duration-300">
            <h3 className="text-2xl font-semibold text-[#007E84] mb-3">For Patients</h3>
            <p className="text-gray-600">
              Easily find and book appointments with qualified doctors, upload
              and share medical reports securely, receive appointment reminders,
              and manage your healthcare from the comfort of your home.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-2xl p-8 hover:shadow-lg transition duration-300">
            <h3 className="text-2xl font-semibold text-[#007E84] mb-3">For Doctors</h3>
            <p className="text-gray-600">
              Manage appointments, view patient history, receive reports before
              consultations, and grow your reach by connecting with patients
              looking for your expertise.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 flex flex-col md:flex-row gap-12 justify-between">
          <div className="flex flex-col items-center gap-3 max-w-sm mx-auto text-center">
            <SlCalender className="text-6xl text-blue-600" />
            <p className="font-semibold text-lg text-[#007E84]">
              Easy Appointment Scheduling
            </p>
            <p className="text-gray-500 font-medium">
              Book appointments in just a few clicks with instant confirmation.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 max-w-sm mx-auto text-center">
            <FaUserDoctor className="text-6xl text-blue-600" />
            <p className="font-semibold text-lg text-[#007E84]">
              Qualified & Trusted Doctors
            </p>
            <p className="text-gray-500 font-medium">
              Access a network of verified healthcare professionals.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 max-w-sm mx-auto text-center">
            <MdOutlinePhoneIphone className="text-6xl text-blue-600" />
            <p className="font-semibold text-lg text-[#007E84]">
              Manage Appointments Anywhere
            </p>
            <p className="text-gray-500 font-medium">
              View, reschedule, and track appointments from any device.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
