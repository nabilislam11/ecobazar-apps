// src/services/product.js
import api from "../api";

export const createProduct = async (data) => {
    const response = await api.post("/auth/createproduct", data);
    return response.data;
};

export const getProducts = async (data) => {
    const response = await api.get("/auth/getallproduct", data);
    return response.data;
};

export const getProductById = async (id) => {
    const response = await api.get(`/auth/getsingleproduct/${id}`);
    return response.data;
};

export const updateProduct = async (id, data) => {
    const response = await api.post(`/auth/updateproduct/${id}`, data);
    return response.data;
};

// Product details / slug based fetch
export const getProductBySlug = async (slug) => {
    const response = await api.get(`/auth/getsingleproduct/${slug}`);
    return response.data.data;
};

export const getProductsByParams = async (params = {}) => {
    const response = await api.get("/auth/getallproduct", {
        params,
    });
    return response.data;
};