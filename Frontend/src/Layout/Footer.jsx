const Footer = () => {
  return (
    <>
      <footer className="bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center px-4">
          {/* Clinic Logo and Name */}
          <div className="flex items-center mb-6 md:mb-0">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2965/2965567.png"
              alt="Dental Clinic Logo"
              className="w-10 h-10 mr-2"
            />
            <div>
              <h2 className="text-xl font-bold text-gray-800">Dr. Teeth</h2>
              <p className="text-gray-600">Dental Clinic</p>
            </div>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col md:flex-row md:space-x-12 text-gray-700">
            <div className="mb-4 md:mb-0">
              <h3 className="font-semibold text-lg">Call Us</h3>
              <p>+1800 456 789</p>
              <p>+1800 456 780</p>
            </div>
            <div className="mb-4 md:mb-0">
              <h3 className="font-semibold text-lg">Reach Us</h3>
              <p>117 Crown Street,</p>
              <p>Camberwell, London, UK</p>
            </div>
            <div className="mb-4 md:mb-0">
              <h3 className="font-semibold text-lg">Open Hours</h3>
              <p>Mon-Fri 09:00 – 19:00</p>
              <p>Sat-Sun 10:00 – 14:00</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex space-x-2 mt-4 md:mt-0">
            <a
              href="#"
              className="bg-cyan-400 p-2 rounded hover:bg-cyan-500 transition"
            >
              <img
                src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg"
                alt="Facebook"
                className="w-4 h-4 invert"
              />
            </a>
            <a
              href="#"
              className="bg-cyan-400 p-2 rounded hover:bg-cyan-500 transition"
            >
              <img
                src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linkedin.svg"
                alt="LinkedIn"
                className="w-4 h-4 invert"
              />
            </a>
            <a
              href="#"
              className="bg-cyan-400 p-2 rounded hover:bg-cyan-500 transition"
            >
              <img
                src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/google.svg"
                alt="Google"
                className="w-4 h-4 invert"
              />
            </a>
            <a
              href="#"
              className="bg-cyan-400 p-2 rounded hover:bg-cyan-500 transition"
            >
              <img
                src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/yelp.svg"
                alt="Yelp"
                className="w-4 h-4 invert"
              />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
