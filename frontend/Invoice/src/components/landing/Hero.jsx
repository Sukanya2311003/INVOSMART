import { Link } from "react-router-dom";
import HeroImg from "../../assets/Hero-img.png";


const Hero=()=>{
  const isAuthenticated = false;
  return (
    <section className="relative bg-[#06000a] overflow-hidden ">
      <div className="absolute inset-0 bg-grid/white/[0.05] bg-[size:60px_60px]"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div>
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              Your AI Partner for Perfect Invoices
            </h1>
            <p className="text-base sm:text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              Let AI turn your plain text into polished invoices, automate
              reminders, and provide smart financial insights to streamline your
              business operations
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-x-4">
              {isAuthenticated ? (
                <a
                  href="/dashboard"
                  className="bg-gradient-to-r from-blue-950 to blue-900 text-white px-8 py-4 rounded-xl font-bold text-base  sm:text-lg hover:bg-blue-900 transition-all duration-300 hover:scale-105 hover: shadow-2xl transform"
                >
                  {" "}
                  Go to Dashboard
                </a>
              ) : (
                <>
                  <a
                    href="/signup"
                    className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 
             text-white px-8 py-4 rounded-2xl font-semibold text-base sm:text-lg 
             shadow-lg hover:shadow-pink-500/40 
             transition-transform duration-300 hover:scale-105"
                  >
                    Get Started for Free
                  </a>
                  {/* <a
                    href="#features"
                    className="border-black text-white px-4 rounded-xl font-bold text-lg hover:bg-white hover:text-black  transition-all duration-300 hover:scale-105"
                  >
                    {" "}
                    Learn More
                  </a> */}
                  <a
                    href="#features"
                    className=" px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-800 
             text-white font-bold text-base sm:text-lg shadow-md 
             hover:from-purple-600 hover:to-purple-700 
             transition-transform duration-300 transform hover:scale-105 ml-4"
                  >
                    {" "}
                    Learn More
                  </a>
                </>
              )}
            </div>
          </div>
          <div className="mt-12 sm:mt-16 relative max-w-5xl mx-auto">
            <img
              src={HeroImg}
              alt="Invoice app screenshot"
              className="w-full rounded-2xl shadow-2xl shadow-gray-300 border-4 border-gray-200/20"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
export default Hero;