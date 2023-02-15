import _ from "lodash";

import AxiosInstance from "../wrapper/apiWrapper"

export const getAllTransactions = (request) => {
    return AxiosInstance.get("/transaction/getAllTransactions",request)
}
export const getGroupedEarnings = (request) => {
    return AxiosInstance.post("/transaction/getGroupedEarnings",request)
}
const TransactionInterface = {
    getAllTransactions,
    getGroupedEarnings
}

export default TransactionInterface