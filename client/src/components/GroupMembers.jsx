import { useState } from "react";

export default function GroupMembers({ users }) {
  const [open, setOpen] = useState(false);

  if (!users || !Array.isArray(users)) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center space-x-2 bg-white hover:bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg shadow-sm transition-all duration-200"
      >
        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
        <span className="text-sm font-medium text-gray-700">Members ({users.length})</span>
        <svg className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-64 z-10 max-h-64 overflow-y-auto">
          <div className="p-2">
            <h4 className="text-sm font-semibold text-gray-800 mb-2 px-2">Group Members</h4>
            <ul className="space-y-1">
              {users.map((user, index) => (
                <li
                  key={user._id || user.id || index}
                  className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 rounded-md transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {(user.name || user.username || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{user.name || user.username || 'Unknown User'}</p>
                    {user.username && user.name !== user.username && (
                      <p className="text-xs text-gray-500">@{user.username}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
