import adflowLogo from "../assets/adflowlogo.png"; // adjust path if needed

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm sticky top-0 z-50">
      
      <div className="flex items-center">
        <img 
          src={adflowLogo} 
          alt="AdFlow Network"
          className="h-10 w-auto"   // 40px height logo
        />
      </div>

      <div className="hidden md:flex items-center space-x-8 font-medium text-indigo-900">
        <a href="#home" className="hover:text-red-500 transition-colors">Home</a>
        <a href="#about" className="hover:text-red-500 transition-colors">About</a>
        <a href="#services" className="hover:text-red-500 transition-colors">Services</a>
        <a href="#contact" className="hover:text-red-500 transition-colors">Contact Us</a>

        <button className="bg-indigo-900 text-white px-6 py-2 rounded-md hover:bg-indigo-800 transition-colors">
          Login/Sign Up
        </button>
      </div>

    </nav>
  );
};

export default Navbar;