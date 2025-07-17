
const DocCard=({events})=>{
   
    const{name,specialization,phone,image,email,about_us}=events
    return <>
        <div className="bg-white rounded-xl min-h-60 shadow-md flex max-w-md overflow-hidden cursor-pointer hover:shadow-xl transition ">
  <div className="flex-shrink-0">
    <img className="h-44 w-44 object-cover rounded-full"  src={image || "https://png.pngtree.com/png-clipart/20241112/original/pngtree-smiling-cartoon-doctor-with-stethoscope-clipart-png-image_16976469.png"} alt="Dr. John Smith" />
  </div>
  <div className="p-6 flex flex-col justify-between">
    <div>
      <h2 className="text-xl font-bold text-blue-900">Dr. {name}</h2>
      <h3 className="text-sm text-gray-600 mb-4">{specialization}</h3>
      <div className="space-y-1 text-sm text-gray-700">
        <p>📞 {phone}</p>
        <p>✉️ {email}</p>
      </div>
    </div>
    <div className="mt-3">
      <h4 className="text-blue-900 font-semibold text-sm mb-1">About Us</h4>
      <p className="text-sm text-gray-600 leading-tight">
        {about_us}
      </p>
    </div>
  </div>
</div>

    </>
}

export default DocCard;