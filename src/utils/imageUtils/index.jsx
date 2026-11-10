// src/utils/imageUtils.js

// আপনার পিসির লোকাল IP অথবা Render এর লাইভ ব্যাকএন্ড URL দিন
// আইফোনে ইমেজ দেখার জন্য localhost কাজ করবে না!
const BACKEND_URL = "http://192.168.0.106:5000"; // আপনার IP বসিয়ে নিবেন

export const getImageUrl = (image) => {
    if (!image) return "";

    if (typeof image === "string") {
        return image.startsWith("http")
            ? image
            : `${BACKEND_URL}/${image.replace(/\\/g, "/")}`;
    }

    if (image.url) {
        return image.url.startsWith("http")
            ? image.url
            : `${BACKEND_URL}/${image.url.replace(/\\/g, "/")}`;
    }

    return "";
};

export const getMainImage = (images = []) => {
    if (!Array.isArray(images) || images.length === 0) return null;

    return images.find((image) => image?.isMain === true) || images[0];
};