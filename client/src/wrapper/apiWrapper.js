import axios from "axios";
import ENDPOINTS from "../commons/Endpoints";
import _ from "lodash";

const AxiosInstance = axios.create({
  baseURL:
    process.env.NODE_ENV == "production" || process.env.NODE_ENV == "test"
      ? ENDPOINTS.REMOTE_ENDPOINTS
      : ENDPOINTS.LOCAL_ENDPOINTS,
});



AxiosInstance.interceptors.request.use(function(config) {
  if(_.isEmpty(config.headers["x-access-token"])){
    config.headers["x-access-token"] =  sessionStorage.getItem("PASSPORT_TOKEN");
  }
  return config;
});

AxiosInstance.interceptors.response.use(
  function(response) {
    // Do something with response data
    return response;
  },
  function(error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

export default AxiosInstance;



