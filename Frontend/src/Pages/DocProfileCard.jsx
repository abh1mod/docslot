
const defaultPicture = "https://png.pngtree.com/png-clipart/20241112/original/pngtree-smiling-cartoon-doctor-with-stethoscope-clipart-png-image_16976469.png";
const DocProfileCard=({events})=>{
       
    const{name,specialization,phone,email,image,about_us}=events
    return <>
        <div className="max-w-[260px] flex flex-col items-center justify-center gap-1">
            <img className="h-48 w-48 object-cover rounded-full mx-auto" src={image || defaultPicture} alt="Profile Picture" />
            <h1 className="text-xl font-bold text-blue-900 mt-3">{name}</h1>
            <h2 className="text-l text-gray-600 mb-2">{specialization}</h2>
            <p>📞 {phone}</p>
            <h2 className="text-blue-900 font-semibold text-sm mb-1 mt-2">About Us</h2>
            <p className="text-sm text-gray-600 leading-tight text-justify">{about_us}</p>     
        </div>
    </>
}

export default DocProfileCard;