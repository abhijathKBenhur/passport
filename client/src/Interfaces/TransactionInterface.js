import _ from "lodash";

import AxiosInstance from "../wrapper/apiWrapper"

export const getAllTransactions = (request) => {
    return AxiosInstance.get("/transaction/getAllTransactions",request)
}

const TransactionInterface = {
    getAllTransactions,
}

export default TransactionInterface