import _ from "lodash";

import AxiosInstance from "../wrapper/apiWrapper"

export const getClientSecret = (request) => {
    return AxiosInstance.get("/payment/getClientSecret",request)
}

const PaymentInterface = {
    getClientSecret
}

export default PaymentInterface