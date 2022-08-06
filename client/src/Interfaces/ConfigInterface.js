import _ from "lodash";

import AxiosInstance from "../wrapper/apiWrapper"

export const getbalance = (request) => {
    return AxiosInstance.post("/getbalance",request)
}

export const configureDistribution = (request) =>  { 
    return AxiosInstance.post("/configureDistribution",request) 
}

const ConfigInterface = {
    getbalance,
    configureDistribution
}

export default ConfigInterface