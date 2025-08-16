import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const client = useQueryClient();

const api = axios.create({
  baseURL: "https://68a014896e38a02c5817b523.mockapi.io",
});

export const useCars = () => {
  return useQuery({
    queryKey: ["cars"],
    queryFn: async () => {
      const res = await api.get("/cars");
      return res.data;
    },
  });
};

export const useAddCar = () => {
  return useMutation({
    mutationFn: async (newCar) => {
      const res = await api.post("/cars", newCar);
      return res.data;
    },
    onSuccess: () => client.invalidateQueries({queryKey:["cars"]}),
  });
};

export const useUpdateCar = () => {
  return useMutation({
    mutationFn: async ({ id, ...updateCar}:any ) => {
      const res = await api.put(`/cars/${id}`, updateCar);
      return res.data;
    },
    onSuccess: () => client.invalidateQueries({queryKey:["cars"]}),
  });
};

export const useDeleteCar = () => {
  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/cars/${id}`);
      return id;
    },
    onSuccess: () => client.invalidateQueries({queryKey:["cars"]}),
  });
};