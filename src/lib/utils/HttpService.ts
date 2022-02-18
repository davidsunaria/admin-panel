import axios from "axios";
import { getToken, handleInvalidToken } from './Service';
const axiosApi = axios.create({
  headers: {
    Accept: "application/json",
    "Content-type": "application/json",
    language: `EN`
  }
});
// doing something with the request
axiosApi.interceptors.request.use((request: any) => {
  let token = getToken();
  if (token) {
    request.headers.common.Authorization = `Bearer ${token}`;
  }
  return request;
});

axiosApi.interceptors.response.use((response: any) => {
  if (response.data.status === "error" && response.data.status === 403) {
    handleInvalidToken();
  }
  return response;
}, function (error) {
  if (!error.response) {
   
   // handleInvalidToken();
   return {
    data: {
      data: "",
      message:
        "There is some error while processing this request. Please try again after some time.",
      status: 500,
    },
  };
  }
  else {
    if (error.response.status === 500) {
      return {
        data: {
          data: "",
          message:
            "There is some error while processing this request. Please try again after some time.",
          status: 500,
        },
      };
    }
    
  }
  // Any status codes outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error);
});


const objectToQuery = (obj: any) => {
  return (obj) ? Object.entries(obj).map(([k, v]: any) => `${k}=${encodeURIComponent(v)}`).join("&") : '';
}
const apiUrl = process.env.REACT_APP_API_URL;

export { objectToQuery, axiosApi, apiUrl};