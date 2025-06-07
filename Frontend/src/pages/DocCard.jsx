
const DocCard=({events})=>{
   
    const{name,specialization,phone}=events
    return <>
        <div className="bg-white rounded-xl shadow-md flex max-w-md overflow-hidden cursor-pointer hover:shadow-xl transition ">
  <div className="flex-shrink-0">
    <img className="h-48 w-48 object-cover" src="https://png.pngtree.com/png-clipart/20241112/original/pngtree-smiling-cartoon-doctor-with-stethoscope-clipart-png-image_16976469.png" alt="Dr. John Smith" />
  </div>
  <div className="p-6 flex flex-col justify-between">
    <div>
      <h2 className="text-xl font-bold text-blue-900">{name}</h2>
      <h3 className="text-sm text-gray-600 mb-4">{specialization}</h3>
      <div className="space-y-1 text-sm text-gray-700">
        <p>📞 {phone}</p>
        <p>✉️ john.smith@email.com</p>
      </div>
    </div>
    <div className="mt-4">
      <h4 className="text-blue-900 font-semibold text-sm mb-1">About Us</h4>
      <p className="text-sm text-gray-600 leading-tight">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </p>
    </div>
  </div>
</div>

    </>
}

export default DocCard;