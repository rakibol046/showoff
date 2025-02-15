import axios from "axios";

export default api = axios.create({
  baseURL: "http://localhost:8080/admin_ap/",
  timeout: 5000, // 5 seconds
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_TOKEN",
  },
});

