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

export const incentivise = (request) =>  { 
    let config = {
        headers: {}
    }
    config.headers["x-access-token"] = request.token
    return AxiosInstance.post("/customer/incentivise",request,config) 
}

export const redeemGold = (payload) =>  { 
    return AxiosInstance.post("/redeemGold",payload) 
}

const CustomerInterface = {
    getAllUsers,
    getUser,
    getTotalUserCount,
    incentivise,
    redeemGold,
}

export default CustomerInterface