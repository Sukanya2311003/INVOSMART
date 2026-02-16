import React from "react";
import { useState, useEffect } from "react";
import{
    LogOut, Briefcase, Menu, X, 
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";
import {NAVIGATION_MENU} from "../../utils/data";
import { useAuth } from "../../context/AuthContext";

const NavigationItem=({item, isActive, onClick, isCollapsed})=>{
    const Icon= item.icon;

    return <
        button onClick={()=>onClick(item.id)} className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 group ${
            isActive
            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
            : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
        }`}
    >
        <Icon className={`h-5 w-5 flex-shrink-0 ${
            isActive ? "text-white" : "text-zinc-400 group-hover:text-white"
        }`}
         />
         { !isCollapsed && (
            <span className="ml-3 truncate">{item.name}</span>
         )}
    </button>
}

const DashboardLayout=({children, activeMenu})=>{

    const { user, logout}= useAuth();
    const navigate= useNavigate();
    const [sidebarOpen, setSidebarOpen]= useState(false);
    const [activeNavItem, setActiveNavItem]= useState(activeMenu || "dashboard");
 const [ profileDropDownOpen, setProfileDropDownOpen]= useState(false);
 const [isMobile, setIsMobile] = useState(false);
//  const [toggleSidebar, setToggleSidebar] = useState(true);
const toggleSidebar = () => {
  setSidebarOpen((prev) => !prev);
};

//  handling response behaviour
 useEffect(()=>{
    const handleResize=()=>{
        const mobile= window.innerWidth < 768;
        setIsMobile(mobile);
        if(!mobile){
            setSidebarOpen(false);
        }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return()=> window.removeEventListener("resize", handleResize);
 }, []);
//  closing dropdown when clicking outside
useEffect(()=>{
    const handleClickOutside= (event)=>{
        if(profileDropDownOpen ){
            setProfileDropDownOpen(false);
        }
    };
    document.addEventListener("click", handleClickOutside);
    return()=> document.removeEventListener("click", handleClickOutside);
}, [profileDropDownOpen]);

const handleNavigation = ( itemId)=> {
    setActiveNavItem(itemId);
    navigate(`/${itemId}`);
    if(isMobile){
        setSidebarOpen(false);
    }
};

const sidebarCollapsed= !isMobile && false;

return (
  // <div className="bg-black text-white flex h-screen overflow-hidden">
  <div className="bg-black text-white flex h-screen overflow-hidden print:block">

    {/* Sidebar */}
    <div
      className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 transform print:hidden
        ${
          isMobile
            ? sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0"
        }
        ${sidebarCollapsed ? "w-20" : "w-64"}
        bg-zinc-900 border-r border-zinc-800
      `}
    >
      {/* Logo */}
      <div className="flex items-center h-16 border-b border-zinc-800 px-6">
        <Link
          className="flex items-center space-x-3"
          to="/dashboard"
        >
          <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          {!sidebarCollapsed && (
            <span className="font-bold text-xl tracking-wide">
              InvoSmart
            </span>
          )}
        </Link>
      </div>

      {/* Navigation Placeholder */}
      <nav className="p-4 space-y-2">
        {NAVIGATION_MENU.map((item) => (
            <NavigationItem
              key={item.id}
              item={item}
              isActive={activeNavItem === item.id}
              onClick={ handleNavigation}
              isCollapsed={sidebarCollapsed}
            />
        ))}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={logout}
          className="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all duration-300"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!sidebarCollapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </div>

    {/* Mobile Overlay */}
    {isMobile && sidebarOpen && (
      <div
        className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
        onClick={() => setSidebarOpen(false)}
      />
    )}

    {/* Main Content */}
    <div
      className={`flex-1 flex flex-col transition-all duration-300 ${
        isMobile
          ? "ml-0"
          : sidebarCollapsed
          ? "ml-16"
          : "ml-64"
      }`}
    >
      {/* Top Navbar */}
      <header className="bg-zinc-950 border-b border-zinc-800 h-16 flex items-center justify-between px-6 sticky top-0 z-30">
        <div className="flex items-center space-x-4">
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-zinc-800 transition-colors duration-300"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5 text-zinc-400" />
              ) : (
                <Menu className="h-5 w-5 text-zinc-400" />
              )}
            </button>
          )}

          <div>
            <h1 className="text-lg font-semibold text-white">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-sm text-zinc-400 hidden sm:block">
              Here's your dashboard overview.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
            {/* profile dropdown */}
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
        </div>

      </header>

      {/* Content Area */}
      <main className="flex-1 overflow-auto p-6 bg-black">
        {children}
      </main>
    </div>
  </div>
);
};

export default DashboardLayout;