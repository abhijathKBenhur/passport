import _ from "lodash";

import AxiosInstance from "../wrapper/apiWrapper"

export const getbalance = (request) => {
    return AxiosInstance.post("/getbalance",request)
}

export const configureDistribution = (request) =>  { 
    return AxiosInstance.post("/configureDistribution",request) 
}

export const updateDetails = (request) =>  { 
    return AxiosInstance.post("/updateDetails",request) 
}


const CompanyInterface = {
    getbalance,
    configureDistribution,
    updateDetails
}

export default CompanyInterface