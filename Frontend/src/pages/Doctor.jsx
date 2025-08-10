import { useEffect, useRef, useState } from "react";
import DocCard from "./DocCard";
import Loading from "./Loading";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../ContextAPI/AuthContext";
import LoginPt from "./LoginPages/LoginPt";
import { ImCross } from "react-icons/im";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

const Doctor = () => {
  const { isLogin } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterspec, setFilterspec] = useState("");
  const [filterspeccity, setFilterspeccity] = useState("");

  const [search, setSearch] = useState("");
  const [searchcity, setSearchcity] = useState("");

  const [showSpecDropdown, setShowSpecDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const [Specialization, setSpecializations] = useState([]); 
  const [City, setCities] = useState([]);

  const specRef = useRef(null);
  const cityRef = useRef(null);


  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const result = await axios.get(`${BASE_URL}/api/fetch_all`);
        if (result.data.success) {
          setDoctors(result.data.data);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  
  useEffect(() => {
    const fetchFilterAttributes = async () => {
      try {
        const result = await axios.get(`${BASE_URL}/api/patient/filter_attributes`);
        if (result.data.success) {
          setSpecializations(result.data.data.specializations);
          setCities(result.data.data.cities);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchFilterAttributes();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (specRef.current && !specRef.current.contains(e.target)) {
        setShowSpecDropdown(false);
      }
      if (cityRef.current && !cityRef.current.contains(e.target)) {
        setShowCityDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtered doctor list
  const filteredDoctors = doctors.filter((doc) => {
    const specMatch = filterspec ? doc.specialization?.toLowerCase() === filterspec.toLowerCase() : true;
    const cityMatch = filterspeccity ? doc.city?.toLowerCase() === filterspeccity.toLowerCase() : true;
    return specMatch && cityMatch;
  });

  // Reset filters
  const clearFilters = () => {
    setFilterspec("");
    setFilterspeccity("");
    setSearch("");
    setSearchcity("");
  };

  // Filter dropdown values based on search text
  const filteredSpecs = search
    ? Specialization.filter((item) => item.toLowerCase().includes(search.toLowerCase()))
    : Specialization;

  const filteredCities = searchcity
    ? City.filter((item) => item.toLowerCase().includes(searchcity.toLowerCase()))
    : City;

  // if (!isLogin) return <LoginPt />;



  return (
    <div className="flex flex-col align-items-center  p-4 bg-gray-50 min-h-screen ">
      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-start items-center justify-center gap-3 mb-6 mt-3">
  {/* Specialization Filter */}
  <div className="relative w-full max-w-xs " ref={specRef}>
    {/* Search input */}
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      onClick={() => setShowSpecDropdown(true)}
      placeholder="Search Specialization..."
      className="border border-gray-300 focus:border-blue-500 focus:ring-2 
                 focus:ring-blue-200 p-2 rounded-lg w-full shadow-sm 
                 transition-all duration-200 outline-none"
    />

    {/* Dropdown */}
    {showSpecDropdown && (
      <div className="absolute z-10 bg-white w-full mt-1 border border-gray-200 
                      rounded-lg shadow-lg max-h-40 overflow-y-auto animate-fadeIn">
        {filteredSpecs.length > 0 ? (
          filteredSpecs.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                setFilterspec(item);
                setSearch("");
                setShowSpecDropdown(false);
              }}
              className="cursor-pointer hover:bg-blue-100 px-3 py-2 text-gray-700 
                         transition-colors duration-150"
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </div>
          ))
        ) : (
          <div className="px-3 py-2 text-gray-500 italic">No results found</div>
        )}
      </div>
    )}

    {/* Selected specialization tag */}
    {filterspec && (
      <div className="mt-2 flex items-center gap-2 bg-blue-100 text-blue-800 
                      text-sm px-3 py-1 rounded-full shadow-sm w-fit">
        <span>{filterspec}</span>
        <ImCross
          onClick={() => setFilterspec("")}
          className="cursor-pointer text-xs hover:text-red-600 transition-colors"
        />
      </div>
    )}
  </div>

  {/* City Filter */}
  <div className="relative w-full max-w-xs " ref={cityRef}>
    {/* Search input */}
    <input
      value={searchcity}
      onChange={(e) => setSearchcity(e.target.value)}
      onClick={() => setShowCityDropdown(true)}
      placeholder="Search City..."
      className="border border-gray-300 focus:border-blue-500 focus:ring-2 
                 focus:ring-blue-200 p-2 rounded-lg w-full shadow-sm 
                 transition-all duration-200 outline-none"
    />

    {/* Dropdown */}
    {showCityDropdown && (
      <div className="absolute z-10 bg-white w-full mt-1 border border-gray-200 
                      rounded-lg shadow-lg max-h-40 overflow-y-auto animate-fadeIn">
        {filteredCities.length > 0 ? (
          filteredCities.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                setFilterspeccity(item);
                setSearchcity("");
                setShowCityDropdown(false);
              }}
              className="cursor-pointer hover:bg-blue-100 px-3 py-2 text-gray-700 
                         transition-colors duration-150"
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </div>
          ))
        ) : (
          <div className="px-3 py-2 text-gray-500 italic">No results found</div>
        )}
      </div>
    )}

    {/* Selected city tag */}
    {filterspeccity && (
      <div className="mt-2 flex items-center gap-2 bg-blue-100 text-blue-800 
                      text-sm px-3 py-1 rounded-full shadow-sm w-fit">
        <span>{filterspeccity}</span>
        <ImCross
          onClick={() => setFilterspeccity("")}
          className="cursor-pointer text-xs hover:text-red-600 transition-colors"
        />
      </div>
    )}
  </div>

  {/* Clear Filters */}
  {(filterspec || filterspeccity) && (
    <button
      onClick={clearFilters}
      className="bg-red-500 text-white px-3 py-1 rounded shadow-sm hover:bg-red-600 transition"
    >
      Clear Filters
    </button>
  )}
</div>


      {/* Doctor Cards */}
      {loading ? (
        <Loading />
      ) : filteredDoctors.length === 0 ? (
        <p>No Result Found.</p>
      ) : (
        <div className="w-full flex justify-center">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 place-items-center">
    {filteredDoctors.map((doc, index) => (
      <Link
        key={index}
        to={`/booking/${doc.doc_id}`}
        className="no-underline text-black w-full md:w-auto"
      >
        <DocCard events={doc} />
      </Link>
    ))}
  </div>
</div>

        
      )}
    </div>
  );
};

export default Doctor;
