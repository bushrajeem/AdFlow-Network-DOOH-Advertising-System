import { ArrowLeft, Eye, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getUsers } from "../../services/api";

// Auto-generate initials from name — e.g. "Jeem" → "J"
function getInitials(name) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function UsersPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
       getUsers().then(setUsers).catch((err) => setError(err.message))
       .finally(() => setLoading(false));
},[])

  const filtered = users.filter((u) =>
    (u.name || "").toLowerCase().includes(search.toLowerCase())
  );

  // TODO: open modal or navigate to add Users form
  const handleAdd = () => console.log("Add User — POST /api/admin/users");
  // TODO: connect to DELETE /api/admin/users/:id
  const handleDelete = (id) => console.log("Delete User:", id);
  // TODO: connect to PATCH /api/admin/users/:id
  const handleEdit = (id) => console.log("Edit User:", id);

  return (
    <div>

      {/* Page Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Users</h1>
      </div>

      {/* Action Row */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <NavLink to="/Signup"
            onClick={handleAdd}
            className="bg-[#002B6B] hover:bg-blue-900 text-white text-sm font-semibold px-5 py-2.5 rounded-lg tracking-wide transition-colors"
          >
            + ADD NEW USER
          </NavLink>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 bg-white hover:bg-red-500 hover:text-white text-black text-sm font-semibold px-5 py-2.5 rounded-lg tracking-wide transition-colors border border-gray-200"
          >
            <Trash2 size={14} />
            Delete Users
          </button>
        </div>

        {/* TODO: connect to pagination logic */}
        <select className="text-[14px] border bg-white border-gray-200 rounded-lg px-2 py-2 outline-none">
          <option>10</option>
          <option>25</option>
          <option>50</option>
        </select>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-gray-200">

        {/* Search */}
        <div className="p-4 border-b border-gray-100">
          <input
            type="text"
            placeholder="Search by user name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-72 outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Table */}
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: "#002B6B" }} className="text-white">
              <th className="px-8 py-3 text-left font-medium">User</th>
              <th className="px-4 py-3 text-center font-medium">Assigned Roles</th>
              <th className="px-4 py-3 text-center font-medium">Email</th>
              <th className="px-4 py-3 text-center font-medium">Phone</th>
              <th className="px-4 py-3 text-center font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">
                  No users found
                </td>
              </tr>
            ) : (
              filtered.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">

                  {/* User — avatar + name + email, left aligned */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      {/* Show image if available, otherwise show initials */}
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-9 h-9 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
                          {getInitials(user.name)}
                        </div>
                      )}
                      <div className="leading-tight">
                        <p className="font-semibold text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-center text-gray-700">{user.role}</td>
                  <td className="px-4 py-4 text-center text-gray-700">{user.email}</td>
                  <td className="px-4 py-4 text-center text-gray-700">{user.phone}</td>

                  {/* Actions */}
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleEdit(user.id)}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(user.id)}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Pencil size={16} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UsersPage;