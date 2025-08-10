import React from 'react';

const defaultPicture = "https://res.cloudinary.com/dahtedx9c/image/upload/v1753246193/doctor_images/iurgcqfmt9xsydjrpbho.png";

const DocProfileCard = ({ events }) => {
  const { name, specialization, phone, email, image, about_us } = events;

  return (
    <div className="w-full md:max-w-[260px] bg-white p-4 justify-around rounded-lg shadow-sm flex flex-row md:flex-col md:gap-4 items-center gap-10">
      
      {/* Doctor Image */}
      <img
        className="h-32 w-32 md:h-32 md:w-32 object-cover rounded-full"
        src={image || defaultPicture}
        alt="Profile"
      />

      {/* Info Section */}
      <div className="flex flex-col justify-center text-left md:text-center">
        <h1 className="text-lg md:text-xl font-bold text-blue-900">Dr {name}</h1>
        <h2 className="text-sm md:text-base text-gray-600">{specialization}</h2>
        <p className="text-sm">📞 {phone}</p>
        <h2 className="text-blue-900 font-semibold text-sm mt-2 ">About Us</h2>
        <p className="text-xs md:text-sm text-gray-600 line-clamp-6 md:text-justify">{about_us}</p>
      </div>
      
    </div>
  );
};

export default DocProfileCard;
