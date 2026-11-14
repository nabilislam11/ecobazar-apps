
import api from "../api";

// Register
export const registerUser = async (userData) => {
    const response = await api.post("/auth/registration", userData);
    return response.data;
};

// Login
export const loginUser = async (data) => {
    const response = await api.post("/auth/login", data);
    return response.data;
};

// Update Profile
export const updateProfile = async (id, data) => {
    const response = await api.put(`/auth/updateuser/${id}`, data);
    return response.data;
};

// Forgot Password
export const forgotPassword = async (email) => {
    const response = await api.post("/auth/forgotpassword", {
        email,
    });
    return response.data;
};

// Reset Password
export const resetPassword = async (token, data) => {
    const response = await api.post(`/auth/resetpassword/${token}`, data);
    return response.data;
};

// Get All Users
export const getAllUsers = async () => {
    const response = await api.get("/auth/alluser");
    return response.data;
};

// Delete User
export const deleteUser = async (id) => {
    const response = await api.delete(`/auth/deletuser/${id}`);
    return response.data;
};

// Hold User
export const holdUser = async (id) => {
    const response = await api.put(`/auth/holduser/${id}`);
    return response.data;
};

// Search User
export const searchUser = async (searchText) => {
    const response = await api.post("/auth/searchuser", {
        value: searchText,
    });
    return response.data;
};

// Get User Orders
export const getUserOrders = async (userId) => {
    const response = await api.get(`/auth/user-orders/${userId}`);
    return response.data;
};
