import _ from "lodash";

import AxiosInstance from "../wrapper/apiWrapper"

export const getClientSecret = (request) => {
    return AxiosInstance.post("/payment/getClientSecret",request)
}
export const depositGold = (request) => {
    return AxiosInstance.post("/payment/depositGold",request)
}

export const getClientKey = (request) => {
    return AxiosInstance.post("/payment/getClientKey",request)
}

const PaymentInterface = {
    getClientKey,
    getClientSecret,
    depositGold
}

export default PaymentInterface