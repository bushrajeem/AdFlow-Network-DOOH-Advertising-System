
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
            <button className="bg-[#003067] text-white px-6 py-3 rounded-xl shadow-lg text-xl font-medium hover:bg-blue-900 transition-all flex items-center gap-2">
              More Informations <span>{`>>`}</span>
            </button>
          </div>
        </div>

        {/* Right Side: Image Grid Layout (Bangladesh Advertisement Theme) */}
        <div className="relative h-112.5 md:h-137.5 w-full mt-12 lg:mt-0">

          {/* Top Left Image - Shopping Mall Outdoor Ad */}
          <div className="absolute top-10 left-7 w-[45%] h-[45%] overflow-hidden rounded-sm shadow-md border border-gray-200">
            <img
              src="./chairImage.png"
              alt="Bangladesh Shopping Mall Billboard"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Middle Right Image - Colorful Digital Display Ad */}
          <div className="absolute top-[20%] right-3 w-[45%] h-[45%] z-20 overflow-hidden rounded-sm shadow-2xl border-4 border-white">
            <img
              src="./conferenceimage.png"
              alt="Digital Advertisement Display"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Bottom Left Image - Clean Outdoor Advertising Board */}
          <div className="absolute bottom-0 left-7 w-[45%] h-[45%] z-10 overflow-hidden rounded-sm shadow-lg border border-gray-100">
            <img
              src="./laptopimage.png"
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