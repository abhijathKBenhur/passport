import _ from "lodash";

import AxiosInstance from "../wrapper/apiWrapper"

export const signIn = (request) => {
    return AxiosInstance.post("/signIn",request)
}

export const signUp = (request) =>  { 
    return AxiosInstance.post("/signUp",request) 
}

const AuthInterface = {
    signIn,
    signUp
}

export default AuthInterface