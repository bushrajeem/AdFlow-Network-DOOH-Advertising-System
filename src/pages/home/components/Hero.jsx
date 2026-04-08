import { motion } from "framer-motion";
import bannerBg from "../assets/bannerbg.jpg"; 

const Hero = () => {
  return (
    <section id="home" className="relative h-150 flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ 
        backgroundImage: `url(${bannerBg})`,
          filter: 'brightness(0.4)'
        }}
      />
      <div className="relative z-10 text-center text-white px-4 max-w-5xl">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-black tracking-tight leading-tight mb-4"
        >
          MOST ADVANCED <br /> ADVERTISING SOLUTION <br /> IN BANGLADESH
        </motion.h1>
        <div className="hidden md:flex items-center space-x-8 font-medium text-indigo-900">
  <a href="#home" className="hover:text-red-500 transition-colors">Home</a>
  <a href="#about" className="hover:text-red-500 transition-colors">About</a>
  <a href="#services" className="hover:text-red-500 transition-colors">Services</a>
  <a href="#contact" className="hover:text-red-500 transition-colors">Contact Us</a>
</div>
      </div>
    </section>
  );
};

export default Hero;