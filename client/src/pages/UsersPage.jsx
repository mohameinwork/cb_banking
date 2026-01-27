import { Search } from "lucide-react";
import UserTable from "../components/users/UserTable";
import { AddUserModal } from "../components/users/AddUserModal";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [open, setOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const URL = import.meta.env.VITE_API_URL ?? "/api";

  const fetchUsers = async () => {
    setLoading(true);

    try {
      const resp = await axios.get(`${URL}/auth/users`);
      setUsers(resp.data.users ?? []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setOpen(true);

    try {
      const resp = await axios.post(`${URL}/auth/register`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      console.log("User added successfully:", resp.data);
      toast.success("User added successfully");
      setFormData({
        username: "",
        email: "",
        password: "",
      });
      setIsLoading(false);
      setOpen(false);
      // Optionally, refresh the user list
      fetchUsers();
    } catch (error) {
      console.error("Error adding user:", error);
      setIsLoading(false);
      setFormData({
        username: "",
        email: "",
        password: "",
      });
      toast.error("Failed to add user");
    }
  };
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-primary uppercase tracking-widest">
          User Management
        </h1>

        <AddUserModal
          isLoading={isLoading}
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          open={open}
          setOpen={setOpen}
        />
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
        <UserTable users={users} loading={loading} />
      </div>
    </div>
  );
}
