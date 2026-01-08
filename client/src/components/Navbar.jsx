import { useDispatch, useSelector } from "react-redux";
import { logoutRequest } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    dispatch(logoutRequest());
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-6 py-4 flex justify-between items-center shadow-lg">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
          <span className="text-xl">📋</span>
        </div>
        <h2 className="font-bold text-xl">GroupTodo</h2>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center space-x-3 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-full transition-all duration-200 backdrop-blur-sm"
          >
            <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <span className="font-medium">{user?.name || "User"}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showProfile && (
            <div className="absolute right-0 mt-2 w-64 bg-white text-black rounded-lg shadow-xl z-10 border">
              <div className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-500">@{user?.username}</p>
                  </div>
                </div>
                <div className="border-t pt-3">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Email:</span>
                  </p>
                  <p className="text-sm text-gray-800 break-all" title={user?.email}>
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 bg-white text-indigo-600 hover:bg-gray-50 px-4 py-2 rounded-full font-medium transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}
