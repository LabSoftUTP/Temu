import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:3000',
});

export const login = async (email, password) => {
    try {
        const response = await API.post('/users/login', { email, password });
        return response.data;
    } catch (error) {
        return error;
    }
};
