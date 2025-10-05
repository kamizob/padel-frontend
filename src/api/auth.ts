import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

export const signUp = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}) => {
    const res = await axios.post(`${API_URL}/signup`, data);
    return res.data;
};

export const login = async (data: { email: string; password: string }) => {
    const res = await axios.post(`${API_URL}/login`, data);
    return res.data;
};

export const verifyEmail = async (token: string) => {
    const res = await axios.get(`${API_URL}/verify?token=${token}`);
    return res.data;
};
