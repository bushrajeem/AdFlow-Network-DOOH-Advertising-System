import { Facebook, Instagram, Linkedin, Mail, MapPinIcon, Phone, Youtube } from 'lucide-react';
 

export default function App() {
  return (
    // Main Container with balanced max-width
    <div className="max-w-[1250px] mx-auto px-8 py-16 font-sans text-[#003366]">
      
      {/* ================= ABOUT US SECTION ================= */}
      <section className="flex flex-col lg:flex-row items-center justify-between gap-16 mb-28">
        
        {/* Images Grid - Balanced size to match reference design */}
        <div className="relative w-full max-w-[480px] h-[380px]">
          {/* Back Image */}
          <div className="absolute top-0 left-0 w-[200px] h-[260px] rounded-[30px] overflow-hidden shadow-xl -rotate-6 border">
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400" className="w-full h-full object-cover" alt="Team" />
          </div>
          
          {/* Middle Image (Award) - Balanced Gap & Overlap as requested */}
          <div className="absolute bottom-[-10px] left-32 w-[170px] h-[230px] rounded-[30px] overflow-hidden shadow-2xl z-10 border-[6px] border-white rotate-3">
             <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400" className="w-full h-full object-cover" alt="Award" />
          </div>
          
          {/* Right/Top Image */}
          <div className="absolute top-8 right-0 w-[180px] h-[240px] rounded-[30px] overflow-hidden shadow-lg rotate-6 border">
             <img src="https://images.unsplash.com/photo-1497215842964-222b430dc094?w=400" className="w-full h-full object-cover" alt="Office" />
          </div>
        </div>

        {/* Text Section - Deep Blue Color Applied to Title */}
        <div className="lg:text-right lg:w-1/2">
          <h1 className="text-6xl font-black mb-6 text-[#003366] tracking-tighter">About US</h1>
          <p className="text-lg leading-relaxed text-gray-700 max-w-[500px] lg:ml-auto">
            At AdFlow Network, we are committed to providing the best advertising solutions. 
            Our team works tirelessly to ensure your success in the digital landscape.
           
          </p>
        </div>
      </section>

      {/* ================= CONTACTS SECTION ================= */}
      <section className="flex flex-col lg:flex-row justify-between items-start gap-16">
        
        {/* Left Side: Contact Info - Deep Blue Theme */}
        <div className="lg:w-1/2">
          <h2 className="text-6xl font-black mb-10 text-[#003366] tracking-tighter">Contacts</h2>
          
          <div className="space-y-6 mb-10 text-2xl font-bold text-[#003366]">
            <div className="flex items-center gap-5">
              <Phone className="text-xl text-[#003366]" /> 
              <span>01759639439</span>
            </div>
            <div className="flex items-center gap-5">
              <Mail className="text-xl text-[#003366]" /> 
              <span>info@adflow.com</span>
            </div>
          </div>
          
          {/* Social Icons - Sizes maintained for clarity */}
     <div className="flex gap-6 text-4xl">
            <Facebook className="text-[#1877F2] cursor-pointer hover:scale-110 transition" />
            <Instagram className="text-[#E4405F] cursor-pointer hover:scale-110 transition" />
            <Linkedin className="text-[#0A66C2] cursor-pointer hover:scale-110 transition" />
            <Youtube className="text-[#FF0000] cursor-pointer hover:scale-110 transition" />
          </div>
        </div>  

        {/* Right Side: Map Section */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-end">
          <div className="w-full max-w-[650px]">
            <div className="flex items-center gap-3 mb-6 font-bold text-2xl text-[#003366]">
              <MapPinIcon className="text-red-600" />
              <span>Mohammadpur, Dhaka</span>
            </div>

            {/* Map Image Container - Increased size and styling */}
            <div className="w-full rounded-[40px] overflow-hidden shadow-2xl border-[10px] border-white ring-1 ring-gray-100">
  <img 
    src='./map.png'
    className="w-full h-[350px] object-cover" 
    alt="Location Map" 
  />
</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-28 mb-10 text-center font-bold text-[#003366] text-base">
        © AdFlow Network 2026
      </footer>
    </div>
  );
}