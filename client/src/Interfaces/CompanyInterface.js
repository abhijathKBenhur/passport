import _ from "lodash";

import AxiosInstance from "../wrapper/apiWrapper"

export const getbalance = (request) => {
    return AxiosInstance.post("/getbalance",request)
}

export const configureDistribution = (request) =>  { 
    return AxiosInstance.post("/company/configureDistribution",request) 
}

export const updateDetails = (request) =>  { 
    return AxiosInstance.post("/company/updateDetails",request) 
}

export const getDetails = (request) =>  { 
    return AxiosInstance.get("/company/getDetails",request) 
}

export const getTokenForDummy = (request) =>  { 
    return AxiosInstance.post("/company/getTokenForDummy",request) 
}

export const getAll = (request) =>  { 
    return AxiosInstance.get("/company/getAll",request) 
}

export const verifyCompany = (request) =>  { 
    return AxiosInstance.post("/company/verifyCompany",request) 
}

const CompanyInterface = {
    getbalance,
    configureDistribution,
    updateDetails,
    getAll,
    getTokenForDummy,
    getDetails,
    verifyCompany
}

export default CompanyInterface