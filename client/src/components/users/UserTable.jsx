import { UserCheck, UserX, MoreHorizontal } from "lucide-react";
import PageLoader from "@/components/PageLoader";

const UserTable = ({ users, loading }) => {
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
        {users.map((user) => {
          const hasAccounts = user.accounts.length > 0;
          const hasActiveAccount = user.accounts.some(
            (account) => account.status === "ACTIVE",
          );

          return (
            <tr key={user.id} className="hover:bg-blue-50 transition-colors">
              {/* NAME */}
              <td className="p-4">
                <div className="font-bold text-primary capitalize">
                  {user.name || "Unknown User"}
                </div>
                <div className="text-xs text-gray-500">{user.email || "—"}</div>
              </td>

              {/* ROLE */}
              <td className="p-4 font-medium uppercase text-gray-700">
                {user.role}
              </td>

              {/* KYC */}
              <td className="p-4">
                <span className="px-2 py-1 rounded text-xs font-bold uppercase bg-green-100 text-green-700">
                  VERIFIED
                </span>
              </td>

              {/* ACCOUNT STATUS */}
              <td className="p-4">
                {!hasAccounts ? (
                  <span className="px-2 py-1 rounded text-xs font-bold uppercase bg-gray-100 text-gray-600">
                    No Account
                  </span>
                ) : hasActiveAccount ? (
                  <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                    <UserCheck className="h-4 w-4" />
                    Active
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                    <UserX className="h-4 w-4" />
                    Inactive
                  </div>
                )}
              </td>

              {/* ACTIONS */}
              <td className="p-4 text-right">
                <button className="text-gray-400 hover:text-primary">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default UserTable;
