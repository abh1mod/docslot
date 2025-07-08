import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { Userdata } from "../ContextApi/Context"; 
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

const { loged, logout ,setLoged} = useContext(Userdata);
const EditDoctor = ({ doctor, setDoctor, closeModal }) => {
  const [form, setForm] = useState({
    name: "",
    specialization: "",
    phone: "",
    email: "",
    image: "",
    about_us: ""
  });
  //  console.log(doctor);
  useEffect(() => {
    if (doctor) {
      setForm({
        name: doctor.name || "",
        specialization: doctor.specialization || "",
        phone: doctor.phone || "",
        email: doctor.email || "",
        image: doctor.image || "",
        about_us: doctor.about_us || ""
      });
    }
    document.body.style.overflowY = "hidden";
    return () => {
      document.body.style.overflowY = "scroll";
    };
  }, [doctor]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${BASE_URL}/api/doc_update/${doctor.doc_id}`, form);
      if (res.data.success) {
        setDoctor({ ...res.data.data });
 // update parent
      console.log("After setDoctor", res.data.data);
        closeModal(); // close modal
        
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  return ReactDOM.createPortal(
    <>
      <div className="absolute bg-gray-900 bg-opacity-20 top-0 left-0 right-0 bottom-0"></div>
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'lightgray',
        color: 'white',
        padding: '1rem',
        zIndex: 1000
      }}>
        <form onSubmit={handleSubmit} className="w-full p-6 bg-white rounded-md shadow-md space-y-6 text-black">
          <h2 className="text-2xl font-semibold text-gray-700">Edit Profile</h2>

          <div className="flex">
            <div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                <input
                  type="text"
                  id="specialization"
                  name="specialization"
                  value={form.specialization}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                />
              </div>
            </div>

            <div className="ml-5">
              <div>
                <label htmlFor="about_us" className="block text-sm font-medium text-gray-700 mb-1">About Us</label>
                <textarea
                  id="about_us"
                  name="about_us"
                  rows="8"
                  value={form.about_us}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </>,
    document.querySelector(".edit-doctor")
  );
};

export default EditDoctor;
