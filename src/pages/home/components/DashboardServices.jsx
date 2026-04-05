// import "./DashboardServices.css";

function DashboardServices() {
  return (
    <section className="bg-white py-16 px-6 md:px-12 lg:px-24 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Text Content */}
        <div className="space-y-8">
          <h2 className="text-6xl md:text-7xl font-bold text-[#003067] tracking-tight">
            Our Services
          </h2>
          <p className="text-[#1a3a5f] text-lg leading-relaxed text-justify lg:pr-10">
            Adflow Network is a digital marketing platform that helps businesses create, run, and optimize advertisements using artificial intelligence. It provides automated tools to design ads, manage campaigns, and target the right audience across different online platforms. By using AI-based optimization, Adflow Network improves ad performance, increases reach, and helps businesses attract more customers and boost their sales more effectively.

          </p>
          
          <div>
            <button className="bg-[#003067] text-white px-6 py-3 rounded shadow-lg text-xl font-medium hover:bg-blue-900 transition-all flex items-center gap-2">
              More Informations <span>{`>>`}</span>
            </button>
          </div>
        </div>

        {/* Right Side: Image Grid Layout (Bangladesh Advertisement Theme) */}
        <div className="relative h-[450px] md:h-[550px] w-full mt-12 lg:mt-0">
          
          {/* Top Left Image - Shopping Mall Outdoor Ad */}
          <div className="absolute top-0 left-0 w-[45%] h-[55%] overflow-hidden rounded-sm shadow-md border border-gray-200">
            <img 
              src="https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?q=80&w=800" 
              alt="Bangladesh Shopping Mall Billboard" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Middle Right Image - Colorful Digital Display Ad */}
          <div className="absolute top-[20%] right-0 w-[45%] h-[50%] z-20 overflow-hidden rounded-sm shadow-2xl border-4 border-white">
            <img 
              src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800" 
              alt="Digital Advertisement Display" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Bottom Left Image - Clean Outdoor Advertising Board */}
          <div className="absolute bottom-0 left-[10%] w-[55%] h-[45%] z-10 overflow-hidden rounded-sm shadow-lg border border-gray-100">
            <img 
              src="https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800" 
              alt="Professional Outdoor Ad" 
              className="w-full h-full object-cover"
            />
          </div>

        </div>

      </div>
    </section>
  );
}

export default DashboardServices;