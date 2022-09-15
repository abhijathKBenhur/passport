import _ from "lodash";

import AxiosInstance from "../wrapper/apiWrapper"

export const getAllUsers = (request) => {
    return AxiosInstance.get("/customer/getAllUsers",request)
}

export const getUser = (request) =>  { 
    return AxiosInstance.post("/customer/getUser",request) 
}

export const getTotalUserCount = (request) =>  { 
    return AxiosInstance.post("/customer/getTotalUserCount",request) 
}

const CustomerInterface = {
    getAllUsers,
    getUser,
    getTotalUserCount,
}

export default CustomerInterface