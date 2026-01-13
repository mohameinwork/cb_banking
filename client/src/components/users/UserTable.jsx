import React, { useEffect, useState } from "react";
import { MoreHorizontal, UserCheck, UserX, Search } from "lucide-react";
import axios from "axios";
import PageLoader from "../PageLoader";
const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const URL = "https://cb-banking.onrender.com/api";

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const resp = await axios.get(`${URL}/auth/users`);
        setUsers(resp.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  console.log(users.users);
  if (loading) return <PageLoader />;
  return (
    <table className="w-full text-left">
      <thead className="bg-primary text-white uppercase text-sm">
        <tr>
          <th className="p-4 font-bold">Name</th>
          <th className="p-4 font-bold">Role</th>
          <th className="p-4 font-bold">KYC Status</th>
          <th className="p-4 font-bold">Account Status</th>
          <th className="p-4 font-bold text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {users.users?.map((user) => (
          <tr key={user.id} className="hover:bg-blue-50 transition-colors">
            <td className="p-4">
              <div className="font-bold text-primary capitalize">
                {user.users.name}
              </div>
              <div className="text-xs text-gray-500">{user.users.email}</div>
            </td>
            <td className="p-4 font-medium uppercase text-gray-700">
              {user.users.role}
            </td>
            <td className="p-4">
              <span
                className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                  user.accounts.status === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {/* {user.kyc} */}
                VERIFIED
              </span>
            </td>
            <td className="p-4">
              {user.accounts.status === "ACTIVE" ? (
                <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                  <UserCheck className="h-4 w-4" /> Active
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                  <UserX className="h-4 w-4" /> {user.account.status}
                </div>
              )}
            </td>
            <td className="p-4 text-right">
              <button className="text-gray-400 hover:text-primary">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
