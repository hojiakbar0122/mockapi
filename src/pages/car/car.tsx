import axios from "axios";
import { memo, useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { data } from "react-router-dom";




const api = axios.create({
  baseURL: "https://68a014896e38a02c5817b523.mockapi.io",
});

const useCars = () => {
  return useQuery({
    queryKey: ["cars"],
    queryFn: async () => {
      const res = await api.get("/cars");
      return res.data;
    },
  });
};

console.log(data);


const useAddCar = () => {
const client = useQueryClient();

  return useMutation({
    mutationFn: async (newCar) => {
      const res = await api.post("/cars", newCar);
      return res.data;
    },
    onSuccess: () => client.invalidateQueries({queryKey:["cars"]}),
  });
};

const useUpdateCar = () => {
const client = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updateCar}:any ) => {
      const res = await api.put(`/cars/${id}`, updateCar);
      return res.data;
    },
    onSuccess: () => client.invalidateQueries({queryKey:["cars"]}),
  });
};

const useDeleteCar = () => {
const client = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/cars/${id}`);
      return id;
    },
    onSuccess: () => client.invalidateQueries({queryKey:["cars"]}),
  });
};

// ================= COMPONENT =================
const Car = () => {
  const { data: cars = [], isLoading } = useCars();
  const addCar = useAddCar();
  const updateCar = useUpdateCar();
  const deleteCar = useDeleteCar();

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState<any>({
    name: "",
    price: "",
    brand: "",
    color: "",
    releaseDate: "",
    power: "",
  });

  if (isLoading) return <p>Loading cars...</p>;

  const handleChange = (e:any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (editingId) {
      updateCar.mutate({ id: editingId, ...form });
      setEditingId(null);
    } else {
      addCar.mutate(form);
    }
    setForm({ name: "", price: "", brand: "", color: "", releaseDate: "", power: "" });
    setOpen(false);
  };

  const handleEdit = (car:any) => {
    setForm({
      name: car.name,
      price: car.price,
      brand: car.brand,
      color: car.color,
      releaseDate: car.releaseDate,
      power: car.power,
    });
    setEditingId(car.id);
    setOpen(true);
  };

  return (
    <div className="p-6">
      {/* Trigger */}
      <button
        onClick={() => {
          setForm({ name: "", price: "", brand: "", color: "", releaseDate: "", power: "" });
          setEditingId(null);
          setOpen(true);
        }}
        className="px-4 py-2 mb-6 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
      >
        + Add Car
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? "Edit Car" : "Add New Car"}
            </h2>
            <div className="grid gap-3">
              <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="border p-2 rounded" />
              <input name="price" value={form.price} onChange={handleChange} placeholder="Price" className="border p-2 rounded" />
              <input name="brand" value={form.brand} onChange={handleChange} placeholder="Brand" className="border p-2 rounded" />
              <input name="color" value={form.color} onChange={handleChange} placeholder="Color" className="border p-2 rounded" />
              <input type="date" name="releaseDate" value={form.releaseDate} onChange={handleChange} className="border p-2 rounded" />
              <input name="power" value={form.power} onChange={handleChange} placeholder="Power" className="border p-2 rounded" />

              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setOpen(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  {editingId ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Car Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cars.map((car:any) => (
          <div key={car.id} className="bg-white shadow-md rounded-xl p-4 text-center hover:shadow-lg transition">
            <h2 className="text-lg font-semibold">{car.name}</h2>
            <p className="text-sm text-gray-600">💰 {car.price}</p>
            <p className="text-sm text-gray-600">🏷️ {car.brand}</p>
            <p className="text-sm text-gray-600">🎨 {car.color}</p>
            <p className="text-sm text-gray-600">📅 {car.releaseDate}</p>
            <p className="text-sm text-gray-600">⚡ {car.power}</p>

            <div className="flex gap-2 mt-4 justify-center">
              <button onClick={() => handleEdit(car)} className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">Edit</button>
              <button onClick={() => deleteCar.mutate(car.id)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default memo(Car);