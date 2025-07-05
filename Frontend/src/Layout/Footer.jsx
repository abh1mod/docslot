import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#007E85] text-white py-10 px-6 overflow-x-hidden">
      <div className="max-w-screen-xl w-full mx-auto grid grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Left Section */}
        <div>
          <h2 className="text-xl font-bold mb-2">Healthcare</h2>
          <p className="text-sm">
            Copyright © 2022 BRIX Templates<br />
            All Rights Reserved
          </p>
        </div>

        {/* Product Links */}
        <div>
          <h3 className="font-semibold mb-3">Product</h3>
          <ul className="text-sm space-y-2">
            <li>Features</li>
            <li>Pricing</li>
            <li>Case studies</li>
            <li>Reviews</li>
            <li>Updates</li>
          </ul>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="font-semibold mb-3">Company</h3>
          <ul className="text-sm space-y-2">
            <li>About</li>
            <li>Contact us</li>
            <li>Careers</li>
            <li>Culture</li>
            <li>Blog</li>
          </ul>
        </div>

        {/* Follow Us */}
        <div>
          <h3 className="font-semibold mb-3">Follow us</h3>
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-center gap-2">
              <FaFacebookF /> Facebook
            </div>
            <div className="flex items-center gap-2">
              <FaTwitter /> Twitter
            </div>
            <div className="flex items-center gap-2">
              <FaInstagram /> Instagram
            </div>
            <div className="flex items-center gap-2">
              <FaLinkedinIn /> LinkedIn
            </div>
            <div className="flex items-center gap-2">
              <FaYoutube /> YouTube
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
