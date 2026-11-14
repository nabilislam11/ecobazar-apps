// src/service/reviewService.js
import api from "../api"; // তোমার axios/api instance যেখানে আছে

// কোনো প্রোডাক্টের সব রিভিউ
export const getReviews = async (productId) => {
  const response = await api.get(`/auth/getreviews/${productId}`);
  // response shape অনুযায়ী adjust করো
  return response.data?.data || response.data || [];
};

// সব রিভিউ (অ্যাডমিন)
export const getAllReviews = async () => {
  const response = await api.get("/auth/allreviews");
  return response.data?.data || response.data || [];
};

// রিভিউ স্ট্যাটাস আপডেট (approve / reject)
export const updateReviewStatus = async (id, status) => {
  const response = await api.put(`/auth/updatereview/${id}`, { status });
  return response.data?.data || response.data;
};

// রিভিউ ডিলিট
export const deleteReview = async (id) => {
  const response = await api.delete(`/auth/deletereview/${id}`);
  return response.data?.data || response.data || { success: true };
};

// নতুন রিভিউ সাবমিট (প্রয়োজন হলে)
export const createReview = async (data) => {
  // data: { productId, rating, comment, ... }
  const response = await api.post("/auth/createreview", data);
  return response.data?.data || response.data;
};
