// services/api.js

import axios from "axios";

const LOCAL_API = "http://localhost:5000/";
const MOCKAPI1 = "https://688dd403a459d5566b134abe.mockapi.io/mycommerce/";
const MOCKAPI2 = "https://688dd951a459d5566b1356fc.mockapi.io/mycommerce/";

const isLocal = window.location.hostname === "localhost";

export const api = axios.create({
  baseURL: isLocal ? LOCAL_API : MOCKAPI1,
});

export const api2 = axios.create({
  baseURL: isLocal ? LOCAL_API : MOCKAPI2,
});


export default api;