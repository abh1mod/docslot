import { useEffect } from "react";
import ReactDom from "react-dom"

const EditDoctor=({data,set,close})=>{

    useEffect(()=>{
       document.body.style.overflowY="hidden";
       return ()=>{
            document.body.style.overflowY="Scroll";
       }
        },[])

    return ReactDom.createPortal(
    <>
    <div className="absolute bg-gray-900 bg-opacity-20 top-0 left-0 right-0 bottom-0"></div>
    <div style={{
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'lightgray',
    color: 'white',
    padding: '1rem'
  }}>
    <form className="w-full p-6 bg-white rounded-md shadow-md space-y-6">
  <h2 className="text-2xl font-semibold text-gray-700">Edit Profile</h2>

  <div className="flex">
    <div>
  {/*first part*/}
  <div>
    <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
    <input
      type="text"
      id="name"
      name="name"
      placeholder="Your name"
      className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none "
    />
  </div>


  <div>
    <label for="specialization" class="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
    <input
      type="text"
      id="specialization"
      name="specialization"
      placeholder="Your specialization"
      className="w-full text-black px-4 py-2 border border-gray-300 rounded-md focus:outline-none "
    />
  </div>


  <div>
    <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
    <input
      type="tel"
      id="phone"
      name="phone"
      placeholder="+1 234 567 890"
      className="w-full text-black px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
    />
  </div>


  <div>
    <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
    <input
      type="email"
      id="email"
      name="email"
      placeholder="you@example.com"
      className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none"
    />
  </div>

  
  <div>
    <label for="image" class="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
   <input
      type="text"
      id="image"
      name="image"
      placeholder="Image-url"
      className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none"
    />
  </div>
  </div>

<div className="ml-5">

<div>
    <label for="about_us" class="block text-sm font-medium text-gray-700 mb-1">About Us</label>
    <textarea
      id="about_us"
      name="about_us"
      rows="4"
      placeholder="Write something about yourself..."
      className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none resize-none"
    ></textarea>
  </div>

 
  <button
    onClick={close}
    type="submit"
    className="w-full bg-blue-600  text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
  >
    Save Changes
  </button>
</div>
  </div> 
</form>

    </div>
    </>,document.querySelector(".edit-doctor")
    );
}

export default EditDoctor;

















