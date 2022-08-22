import _ from "lodash";

import AxiosInstance from "../wrapper/apiWrapper"

export const getAllUsers = (request) => {
    return AxiosInstance.get("/customer/getAllUsers",request)
}

export const getUser = (request) =>  { 
    return AxiosInstance.post("/customer/getUser",request) 
}

const CustomerInterface = {
    getAllUsers,
    getUser,
}

export default CustomerInterface