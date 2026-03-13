import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://logicalsugar-eu.backendless.app/api",
});
