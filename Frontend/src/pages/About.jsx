const About = () => {
  return (
    <>
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to Dental Clinic</h1>
        <p className="mb-8 text-gray-600">
          A descriptive paragraph that tells clients how good you are and proves that you are the best choice that they’ve made. This paragraph is also for those who are looking out for a reliable dental clinic.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-start p-4 bg-gray-100 rounded-lg">
            <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full">
              🏥
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Friendly Clinic Near You</h3>
              <p className="text-gray-600">
                This is a short description elaborating the service you have mentioned above.
              </p>
            </div>
          </div>

          <div className="flex items-start p-4 bg-gray-100 rounded-lg">
            <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full">
              🦷
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold">Experienced Dentist</h3>
              <p className="text-gray-600">
                This is a short description elaborating the service you have mentioned above.
              </p>
            </div>
          </div>
        </div>

        <a
          href="https://maps.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-8 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
        >
          View On Google Map
        </a>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <img
            src="https://images.unsplash.com/photo-1588776814546-9a8f32bc69e0?auto=format&fit=crop&w=800&q=80"
            alt="Dental equipment"
            className="rounded-lg"
          />
          <img
            src="https://images.unsplash.com/photo-1615323341896-c85c1f7cb83f?auto=format&fit=crop&w=800&q=80"
            alt="Happy dental patient"
            className="rounded-lg"
          />
        </div>
      </div>
    </>
  );
};

export default About;
