import { axiosInstance } from '../http';

export const submissions = async (data) => {
    try {
        const response = await axiosInstance.post('/submission', data);

        return response;
    } catch (error) {
        throw error;
    }
};
