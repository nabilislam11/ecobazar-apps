// src/services/category.js
import api from "../api";

export const createCategory = async (data) => {
    const response = await api.post("/auth/createcategory", data);
    console.log(response.data.data);
    return response.data.data;
};

export const getCategories = async () => {
    const response = await api.get("/auth/allcategory");
    console.log(response.data);
    return response.data.data;
};

export const getProductsByCategory = async (id) => {
    const response = await api.get(`/auth/getproductsbycategory/${id}`);
    return response.data.data;
};

export const updateCategory = async (id, data) => {
    const response = await api.put(`/auth/updateCategory/${id}`, data);
    return response.data.data;
};

// Get single category by ID
export const getCategoryById = async (id) => {
    const response = await api.get(`/auth/singlecategory/${id}`);
    return response.data.data;
};