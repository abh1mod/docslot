export default function DocCard({events}) {
  const {name, image, mobile, phone, about_us, email,specialization, city} = events
  return (
    <div className="w-[260px] sm:w-[320px] lg:w-[360px] mx-auto bg-white rounded-2xl shadow-md hover:shadow-[6px_6px_15px_rgba(0,0,0,0.2)] transition-shadow duration-300 p-6 border border-gray-100">
      {/* Profile Image */}
      <div className="flex justify-center">
        <img
          src={image}
          alt="Doctor"
          className="w-28 h-28 rounded-full border-4 object-cover"
        />
      </div>

      {/* Name */}
      <h2 className="mt-4 text-xl font-semibold text-gray-800 text-center">
        Dr. {name}
      </h2>

      <p className="mt-1 text-sm text-gray-700 text-center flex flex-col md:flex-row md:justify-center md:gap-1">
        {specialization} <span><img className="inline-block w-4 h-5" src="https://res.cloudinary.com/dahtedx9c/image/upload/v1754721724/doctor_images/pa2zuyhh3rbplop33j71.png" />{city}</span>
      </p>
      {/* Email */}
      <p className="mt-1 text-sm text-gray-600 text-center break-words">
        {email}
      </p>

      {/* Mobile */}
      <p className="mt-1 text-sm text-gray-600 text-center">
        {mobile}
      </p>

      {/* Divider */}
      <div className="my-4 border-t border-gray-300"></div>

      {/* About Us */}
      <h3 className="text-md font-medium text-gray-700">About</h3>
      <p
  className="mt-1 text-sm text-gray-600 leading-relaxed line-clamp-4 md:line-clamp-3"
  style={{ minHeight: `calc(1.5rem * 3)` }} // 1.5rem is ~24px (line-height)
>
  {(!about_us) ? "Empowering healthier lives through compassionate care, advanced treatments, and medical excellence." : about_us}
</p>

    </div>
  );
}
