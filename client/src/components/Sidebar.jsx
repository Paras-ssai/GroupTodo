export default function Sidebar({
  groups = [],
  selectedGroup,
  onSelectGroup,
  showCreate,
  onCreateClick,
  totalGroups,
}) {
  return (
    <aside className="w-64 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-800 text-white flex flex-col shadow-2xl">
      <div className="p-4 border-b border-slate-700 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h2 className="font-bold text-lg">Groups</h2>
            <p className="text-sm text-slate-400">
              Total: {totalGroups}
            </p>
          </div>
        </div>

        {showCreate && (
          <button
            onClick={onCreateClick}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 p-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            title="Create New Group"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        )}
      </div>

      {/* Tabs */}
     

      <ul className="flex-1 overflow-y-auto">
        {groups.map((group) => (
          <li
            key={group._id}
            onClick={() => onSelectGroup(group)}
            className={`p-3 mx-2 my-1 cursor-pointer rounded-lg transition-all duration-200 hover:bg-slate-700 hover:shadow-md ${
              selectedGroup?._id === group._id
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg"
                : "hover:bg-slate-700"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">{group.name}</p>
                <p className="text-xs text-slate-400">
                  {group.members?.length || 0} members
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
