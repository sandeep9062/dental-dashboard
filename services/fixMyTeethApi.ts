import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1`
  : "http://localhost:9000/api/v1";

const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

export const submitFixMyTeethCase = async (formData: FormData) => {
  try {
    const token = getToken();
    const headers: { "Content-Type": string; Authorization?: string } = {
      "Content-Type": "multipart/form-data",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios.post(`${API_URL}/fix-my-teeth`, formData, {
      headers,
    });
    return { success: true, data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        message: error.response.data.message || "An unknown error occurred",
      };
    }
    return {
      success: false,
      message: (error as Error).message || "An unknown error occurred",
    };
  }
};

export const getFixMyTeethCases = async () => {
  try {
    const token = getToken();
    const headers: { Authorization?: string } = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios.get(`${API_URL}/fix-my-teeth`, { headers });
    return { success: true, data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        message: error.response.data.message || "An unknown error occurred",
      };
    }
    return {
      success: false,
      message: (error as Error).message || "An unknown error occurred",
    };
  }
};

export const updateFixMyTeethCase = async (
  id: string,
  data: { name: string; email: string; selectedState: string }
) => {
  try {
    const token = getToken();
    const headers: { Authorization?: string } = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios.put(`${API_URL}/fix-my-teeth/${id}`, data, {
      headers,
    });
    return { success: true, data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        message: error.response.data.message || "An unknown error occurred",
      };
    }
    return {
      success: false,
      message: (error as Error).message || "An unknown error occurred",
    };
  }
};

export const deleteFixMyTeethCase = async (id: string) => {
  try {
    const token = getToken();
    const headers: { Authorization?: string } = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios.delete(`${API_URL}/fix-my-teeth/${id}`, {
      headers,
    });
    return { success: true, data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        message: error.response.data.message || "An unknown error occurred",
      };
    }
    return {
      success: false,
      message: (error as Error).message || "An unknown error occurred",
    };
  }
};

export const getFixMyTeethCaseById = async (id: string) => {
  try {
    const token = getToken();
    const headers: { Authorization?: string } = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios.get(`${API_URL}/fix-my-teeth/${id}`, {
      headers,
    });
    return { success: true, data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        message: error.response.data.message || "An unknown error occurred",
      };
    }
    return {
      success: false,
      message: (error as Error).message || "An unknown error occurred",
    };
  }
};
