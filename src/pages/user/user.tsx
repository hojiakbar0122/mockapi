import axios from "axios";
import { memo, useEffect, useState } from "react";

const User = () => {
  const [data, setData] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    birthdate: "",
    address: "",
    email: "",
  });
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("https://68a014896e38a02c5817b523.mockapi.io/users")
      .then((res) => setData(res.data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (editingId) {
      // Update existing user
      const res = await axios.put(
        `https://68a014896e38a02c5817b523.mockapi.io/users/${editingId}`,
        form
      );
      setData(data.map((u) => (u.id === editingId ? res.data : u)));
      setEditingId(null);
    } else {
      // Create new user
      const res = await axios.post(
        "https://68a014896e38a02c5817b523.mockapi.io/users",
        form
      );
      setData([...data, res.data]);
    }

    setForm({ name: "", birthdate: "", address: "", email: "" });
    setOpen(false);
  };

  const handleDelete = async (id: string) => {
    await axios.delete(
      `https://68a014896e38a02c5817b523.mockapi.io/users/${id}`
    );
    setData(data.filter((u) => u.id !== id));
  };

  const handleEdit = (user: any) => {
    setForm({
      name: user.name,
      birthdate: user.birthdate,
      address: user.address,
      email: user.email,
    });
    setEditingId(user.id);
    setOpen(true);
  };

  return (
    <div className="p-6">
      {/* Modal Trigger */}
      <button
        onClick={() => {
          setForm({ name: "", birthdate: "", address: "", email: "" });
          setEditingId(null);
          setOpen(true);
        }}
        className="px-4 py-2 mb-6 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
      >
        + Add User
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? "Edit User" : "Add New User"}
            </h2>
            <div className="grid gap-3">
              
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="border p-2 rounded"
              />
              <input
                type="date"
                name="birthdate"
                value={form.birthdate}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Address"
                className="border p-2 rounded"
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="border p-2 rounded"
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editingId ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {data.map((user) => (
          <div
            key={user.id}
            className="bg-white shadow-md rounded-xl p-4 flex flex-col items-center text-center hover:shadow-lg transition"
          >
            <img
              src={user.img}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover mb-3"
            />
            <h2 className="text-lg font-semibold">{user.name}</h2>
            <p className="text-sm text-gray-600">📅 {user.birthdate}</p>
            <p className="text-sm text-gray-600">📍 {user.address}</p>
            <p className="text-sm text-gray-600">✉️ {user.email}</p>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleEdit(user)}
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(User);
