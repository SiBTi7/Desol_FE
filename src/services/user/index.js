import { axiosInstance } from "../http";

export const login = async (data) => {
    try {
        const response = await axiosInstance.post('/login', data);

        return response;

    } catch (error) {
        throw error;
    }
};

export const signUp = async (data) => {
    try {
        const response = await axiosInstance.post('/signup', data, {
            headers: { "Content-Type": "application/json" },
        });

        return response;
    } catch (error) {
        throw error;
    }
};