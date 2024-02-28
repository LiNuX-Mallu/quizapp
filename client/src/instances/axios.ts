import axiosApi from "axios";
const url = import.meta.env.VITE_API_URL;

export default axiosApi.create({
    baseURL: url,
    withCredentials: true,
});

