import { NavLink } from "react-router-dom";


const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-20 py-7 bg-white shadow-sm sticky top-0 z-50">

      <div className="flex items-center">
        <img
          src="./adflowlogo.png "
          alt="AdFlow Network"
          className="h-10 w-auto"   // 40px height logo
        />
      </div>

      <div className="hidden md:flex items-center space-x-8 font-medium text-indigo-900">
        <a href="#home" className="hover:text-red-500 transition-colors">Home</a>
        <a href="#about" className="hover:text-red-500 transition-colors">About</a>
        <a href="#services" className="hover:text-red-500 transition-colors">Services</a>
        <a href="#contact" className="hover:text-red-500 transition-colors">Contact Us</a>

        <NavLink to="/login" className="bg-indigo-900 text-white px-6 py-2 rounded-md hover:bg-indigo-800 transition-colors">
          Login/Sign Up
        </NavLink>
      </div>

    </nav>
  );
};

export default Navbar;