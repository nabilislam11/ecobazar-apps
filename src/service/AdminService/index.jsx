
// Frontend-only admin auth
// Dummy credentials:
// admin@ecobazar.com / admin123

export const ADMIN_CREDENTIALS = {
    email: "admin@ecobazar.com",
    password: "admin123",
};

export const adminLogin = async (email, password) => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (
        email === ADMIN_CREDENTIALS.email &&
        password === ADMIN_CREDENTIALS.password
    ) {
        return {
            admin: {
                name: "Admin",
                email,
            },
            token: "dummy-admin-token",
        };
    }

    throw new Error("Invalid admin credentials");
};
