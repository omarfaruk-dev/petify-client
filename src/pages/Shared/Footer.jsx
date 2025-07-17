import React from "react";
import { FaPaw, FaFacebookF, FaTwitter, FaInstagram, FaEnvelope, FaPhoneAlt, FaHome, FaPlus } from "react-icons/fa";
import { Link, NavLink } from "react-router";
import paymentIcon from '../../assets/images/Payment-Icons.png'
const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 text-secondary pt-14 pb-8 border-t border-primary/20 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10 text-sm items-start lg:justify-items-center">
        {/* Brand & Mission */}
        <div className="md:col-span-1 flex flex-col gap-2 items-start">
          <div className="flex items-center gap-3 mb-2">
            <FaPaw className="text-3xl text-primary drop-shadow" />
            <span className="font-bold text-xl tracking-wide text-primary">Petify</span>
          </div>
          <p className="text-secondary text-base leading-relaxed mb-2 max-w-xs">
            Connecting pets with loving families. Adopt, care, and make a difference with Petify.
          </p>
        </div>
        {/* Navigation Links */}
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold mb-2 text-primary">Explore</h3>
          <NavLink to='/' className="flex items-center gap-2 hover:translate-x-2 duration-500 hover:text-primary font-medium"><FaHome /> Home</NavLink>
          <NavLink to='/pet-listing' className="flex items-center gap-2 hover:translate-x-2 duration-500 hover:text-primary font-medium"><FaPaw /> Pet Listing</NavLink>
          <NavLink to='/donation-campaigns' className="flex items-center gap-2 hover:translate-x-2 duration-500 hover:text-primary font-medium"><FaPlus /> Donation Campaigns</NavLink>
          <NavLink to='/login' className="flex items-center gap-2 hover:translate-x-2 duration-500 hover:text-primary font-medium"><FaEnvelope /> Login</NavLink>
        </div>
        {/* Contact & Social */}
        <div className="flex flex-col gap-2 items-start">
          <h3 className="text-lg font-semibold mb-2 text-primary">Contact</h3>
          <div className="flex items-center gap-2 mb-1"><FaEnvelope className="text-primary" /> support@petify.com</div>
          <div className="flex items-center gap-2 mb-1"><FaPhoneAlt className="text-primary" /> +1 (800) 555-PAWS</div>
          <div className="flex items-center gap-2 mb-1"><FaHome className="text-primary" /> 101 Pet Lane, NY, USA</div>
          <div className="flex gap-4 text-lg mt-3">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-secondary/80"><FaFacebookF /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-secondary/80"><FaTwitter /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-secondary/80"><FaInstagram /></a>
          </div>
        </div>
        {/* Adoption Call-to-Action */}
        <div className="flex flex-col gap-3 items-start">
          <h3 className="text-lg font-semibold mb-2 text-primary">Get Involved</h3>
          <p className="text-secondary text-sm">Become a foster, volunteer, or donor and help us create more happy tails!</p>
        <Link to="/donation-campaigns" className="inline-block mt-2 px-4 py-2 bg-primary text-base-100 rounded-full font-semibold shadow hover:bg-secondary hover:text-primary transition-colors duration-300">Support a Campaign</Link>
        {/* Payment Methods */}
        <div className="mt-4 flex flex-wrap gap-2 items-center">
          <img src={paymentIcon} alt="Payment Methods" className="h-8" style={{maxWidth: '100%'}} />
          {/* Alt: WorldPay, Mastercard, Apple Pay, Visa, Google Pay, Bank Transfer */}
        </div>
        </div>
      </div>
      {/* Bottom: Terms/Privacy row, then copyright row */}
      <div className="pt-8 mt-8 text-center text-xs text-secondary border-t border-primary/10 flex flex-col items-center gap-2">
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/terms-and-conditions" className="hover:text-primary underline">Terms & Conditions</Link>
          <span className="text-primary/30">|</span>
          <Link to="/privacy-policy" className="hover:text-primary underline">Privacy Policy</Link>
        </div>
        <div>
          © {new Date().getFullYear()} <span className="text-primary font-semibold">Petify</span>. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;