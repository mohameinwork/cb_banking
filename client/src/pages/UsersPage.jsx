import { Search } from "lucide-react";
import UserTable from "../components/users/UserTable";

export default function UsersPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-primary uppercase tracking-widest">
          User Management
        </h1>
        <button className="bg-primary text-white px-6 py-3 rounded shadow font-bold hover:bg-trust-light transition-colors">
          Add New User
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded outline-none focus:border-trust-DEFAULT"
            />
          </div>
          <select className="px-4 py-2 border border-gray-200 rounded outline-none font-bold text-gray-600">
            <option>All Roles</option>
            <option>Admin</option>
            <option>User</option>
          </select>
        </div>

        {/* Table */}
        <UserTable />
      </div>
    </div>
  );
}
