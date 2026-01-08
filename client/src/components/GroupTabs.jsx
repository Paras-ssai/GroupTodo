export default function GroupTabs({ activeTab, setActiveTab }) {
  return (
    <div className="flex bg-white rounded-lg p-1 shadow-sm border mb-6">
      <button
        onClick={() => setActiveTab("admin")}
        className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md font-medium transition-all duration-200 ${
          activeTab === "admin"
            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
            : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
        }`}
      >
        <svg className={`w-5 h-5 ${activeTab === "admin" ? "text-white" : "text-gray-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span>Admin Groups</span>
      </button>

      <button
        onClick={() => setActiveTab("member")}
        className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md font-medium transition-all duration-200 ${
          activeTab === "member"
            ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md"
            : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
        }`}
      >
        <svg className={`w-5 h-5 ${activeTab === "member" ? "text-white" : "text-gray-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
        <span>Member Groups</span>
      </button>
    </div>
  );
}
