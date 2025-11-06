import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
const ProfileDropdown=({
                isOpen,
                onToggle,
                avatar,
                companyName,
                email,
                onLogout,
})=>{

    const navigate= useNavigate();

    return (
      <div className="relative">
        <button
          onClick={onToggle}
          className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-800 transition-colors duration-200"
        >
          {/* Avatar */}
          {avatar ? (
            <img
              src={avatar}
              alt="Avatar"
              className="w-9 h-9 object-cover rounded-xl"
            />
          ) : (
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {companyName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* Company Name + Email */}
          <div className="text-left">
            <p className="text-sm font-medium text-gray-100">{companyName || "user"}</p>
            <p className="text-xs text-gray-400">{email}</p>
          </div>

          {/* Chevron */}
          <ChevronDown
            className={`w-4 h-4 text-gray-300 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-gray-900 rounded-xl shadow-lg border border-gray-700 py-2 z-50">
            <div className="px-4 py-3 border-b border-gray-700 mb-2">
              <p className="text-sm text-gray-100">{companyName}</p>
              <p className="text-xs text-gray-400">{email}</p>
            </div>
            <a
              onClick={() => navigate("/profile")}
              className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
            >
              View Profile
            </a>
            <a
              href="#"
              onClick={onLogout}
              className="block px-4 py-2 text-sm text-red-400 hover:bg-red-500 hover:text-white transition-colors duration-200"
            >
              Logout
            </a>
          </div>
        )}
      </div>
    );
}
export default ProfileDropdown;