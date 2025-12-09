import axios, { AxiosError } from 'axios';
import { PharmaBrandPayload } from '@/types/pharmaBrand';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const registerPharmaBrand = async (payload: PharmaBrandPayload) => {
  try {
    const response = await axios.post(`${API_URL}/pharma-brands`, payload);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    return axiosError.response?.data;
  }
};

export const fetchPharmaBrands = async () => {
  try {
    const response = await axios.get(`${API_URL}/pharma-brands`);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    return axiosError.response?.data;
  }
};
