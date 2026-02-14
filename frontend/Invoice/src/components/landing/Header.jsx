// import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import{ FileText, Menu, X} from "lucide-react";
import ProfileDropdown from "../layout/ProfileDropdown";
import Button from "../ui/Button";
import { useAuth } from "../../context/AuthContext";

// import Dashboard from "../../pages/Dashboard/Dashboard";    
const Header=()=>{
 const [isScrolled, setScrolled]= useState(false);
 const [isMenuOpen, setIsMenuOpen]= useState(false);

 const { isAuthenticated, user, logout}= useAuth();

//  const isAuthenticated=false;
//  const user= {name:'Sukanya', email: 'abcd@gmail.com'};
//  const logout=()=>{
//     // logout logic
//  }
 const navigate=useNavigate();

 const [profileDropDownOpen, setProfileDropDownOpen]= useState(false);
    useEffect(()=>{
        const handleScroll=()=>{
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return()=> window.removeEventListener("scroll", handleScroll);
    }, []
)

    return (
      // <header className={`fixed top-0 left-0 w-full z-50 transition-all ${isScrolled ? "bg-white/95 backdrop-blur-sm shadow-lg": "bg-white/0"}text-white`}
      // >
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all text-white ${
          isScrolled
            ? "bg-black/80 backdrop-blur-sm shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-md flex items-center justify-center">
                {/* <FileText className="w-4 h-4 text-white" /> */}
                <FileText className="w-8 h-8 text-blue-700 drop-shadow-lg hover:text-blue-900 transition-colors duration-300" />
              </div>
              <span className="text-xl font-bold text-white">InvoSmart</span>
            </div>
            <div className="hidden lg:flex lg:items-center lg:space-x-8">
              {/* <div className="flex items-center space-x-6">  can write this for everything on full screen*/}

              <a
                href="#features"
                className="text-white hover:text-gray-400 font-medium transition-colors duration-300 relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-white  after:transition-all hover:after:w-full"
              >
                Features
              </a>
              <a
                href="#testimonials"
                className="text-white hover:text-gray-400 font-medium transition-colors duration-300 relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-white  after:transition-all hover:after:w-full"
              >
                Testimonials
              </a>

              <a
                href="#faq"
                className="text-white hover:text-gray-400 font-medium transition-colors duration-300 relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-white  after:transition-all hover:after:w-full"
              >
                FAQs
              </a>
            </div>
            <div className=" hidden lg:flex lg:items-center lg:space-x-4">
              {isAuthenticated ? (
                // <>Let AI Create Your Invoice</>
                <ProfileDropdown
                  isOpen={profileDropDownOpen}
                  onToggle={(e) => {
                    e.stopPropagation();
                    setProfileDropDownOpen(!profileDropDownOpen);
                  }}
                  avatar={user?.avatar || ""}
                  companyName={user?.name || ""}
                  email={user?.email || ""}
                  onLogout={logout}
                />
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-white font-medium hover:text-gray-400 transition-colors duration-300"
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 
             text-white px-6 py-2 rounded-full font-semibold shadow-lg
             transition-all duration-300 hover:scale-110 hover:shadow-pink-500/50"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-white hover:bg-gray-700 hover:text-gray-400 transition-colors duration-300"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-gray-800 border-b border-gray-200 shadow-lg">
            <div className="px-2 pxt-2 pb-3 space-y-1 sm:px-3">
              <a
                href="#features"
                className="block px-4 py-3 text-white hover:text-gray-500 hover:bg-gray-50 font-medium transition-colors duration-300 "
              >
                Features
              </a>
              <a
                href="#testimonials"
                className="block px-4 py-3 text-white hover:text-gray-500 hover:bg-gray-50 font-medium transition-colors duration-300"
              >
                Testimonials
              </a>
              <a
                href="#faq"
                className="block px-4 py-3 text-white hover:text-gray-500 hover:bg-gray-50 font-medium transition-colors duration-300"
              >
                FAQs
              </a>
              <div className="border-t border-gray-200 my-2">
                {isAuthenticated ? (
                  <div className="p-4">
                    <Button
                      onClick={() => navigate("/Dashboard")}
                      className="w-full cursor-pointer 
             bg-gradient-to-r from-blue-700 to-blue-600 
             text-white font-semibold 
             shadow-md hover:brightness-110 hover:scale-105 
             focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 
             transition-all duration-200 rounded-lg pt-3 pb-3"
                    >
                        {/* earlier classname was only w-full */}
                      Go to Dashboard
                    </Button>
                  </div>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-3 text-gray-300 hover:text-gray-500 hover:bg-gray-50 font-medium transition-colors duration-300"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="block w-full text-left bg-blue-500 hover:bg-gray-500 text-white px-4 py-3 rounded-lg font-medium  transition-all duration-300"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    );
}
export default Header;