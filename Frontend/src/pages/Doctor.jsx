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

  const specRef = useRef(null);
  const cityRef = useRef(null);

  const Specialization = ["Gastroenterology", "Neurologist", "Cardiologist", "Surgeon", "Dermatology"];
  const City = ["Mathura", "Kota", "Delhi", "Mumbai", "Bangalore", "Hyderabad", "Pune"];

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
  }, [isLogin]);

  // Close dropdowns on outside click
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

  const filteredDoctors = doctors.filter((doc) => {
    const specMatch = filterspec ? doc.specialization?.toLowerCase() === filterspec.toLowerCase() : true;
    const cityMatch = filterspeccity ? doc.city?.toLowerCase() === filterspeccity.toLowerCase() : true;
    return specMatch && cityMatch;
  });

  const clearFilters = () => {
    setFilterspec("");
    setFilterspeccity("");
    setSearch("");
    setSearchcity("");
  };

  const filteredSpecs = search
    ? Specialization.filter((item) => item.toLowerCase().includes(search.toLowerCase()))
    : Specialization;

  const filteredCities = searchcity
    ? City.filter((item) => item.toLowerCase().includes(searchcity.toLowerCase()))
    : City;

  if (!isLogin) return <LoginPt />;

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        {/* Specialization Filter */}
        <div className="relative w-full md:w-1/3" ref={specRef}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClick={() => setShowSpecDropdown(true)}
            placeholder="Search Specialization"
            className="border p-1 rounded w-full"
          />
          {showSpecDropdown && (
            <div className="absolute z-10 bg-white w-full mt-1 border rounded max-h-40 overflow-y-auto">
              {filteredSpecs.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setFilterspec(item);
                    setSearch("");
                    setShowSpecDropdown(false);
                  }}
                  className="cursor-pointer hover:bg-gray-200 px-2 py-1"
                >
                  {item}
                </div>
              ))}
            </div>
          )}
          {filterspec && (
            <div className="mt-1 flex items-center gap-2 bg-gray-200 text-sm p-1 rounded w-fit">
              {filterspec}
              <ImCross
                onClick={() => setFilterspec("")}
                className="cursor-pointer text-xs text-red-600"
              />
            </div>
          )}
        </div>

        {/* City Filter */}
        <div className="relative w-full md:w-1/3" ref={cityRef}>
          <input
            value={searchcity}
            onChange={(e) => setSearchcity(e.target.value)}
            onClick={() => setShowCityDropdown(true)}
            placeholder="Search City"
            className="border p-1 rounded w-full"
          />
          {showCityDropdown && (
            <div className="absolute z-10 bg-white w-full mt-1 border rounded max-h-40 overflow-y-auto">
              {filteredCities.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setFilterspeccity(item);
                    setSearchcity("");
                    setShowCityDropdown(false);
                  }}
                  className="cursor-pointer hover:bg-gray-200 px-2 py-1"
                >
                  {item}
                </div>
              ))}
            </div>
          )}
          {filterspeccity && (
            <div className="mt-1 flex items-center gap-2 bg-gray-200 text-sm p-1 rounded w-fit">
              {filterspeccity}
              <ImCross
                onClick={() => setFilterspeccity("")}
                className="cursor-pointer text-xs text-red-600"
              />
            </div>
          )}
        </div>

        {/* Clear Filters */}
        {(filterspec || filterspeccity) && (
          <button
            onClick={clearFilters}
            className="bg-red-500 text-white px-3 py-1 rounded self-start"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Doctor Cards */}
      {loading ? (
        <Loading />
      ) : filteredDoctors.length === 0 ? (
        <p>No doctors found.</p>
      ) : (
        <ul className="space-y-4">
          {filteredDoctors.map((doc, index) => (
            <li key={index}>
              <Link to={`/booking/${doc.doc_id}`} className="no-underline text-black">
                <DocCard events={doc} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Doctor;
