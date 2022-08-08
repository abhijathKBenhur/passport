import _ from "lodash";

import AxiosInstance from "../wrapper/apiWrapper"

export const signIn = (request) => {
    return AxiosInstance.post("/auth/signIn",request)
}

export const register = (request) =>  { 
    return AxiosInstance.post("/auth/register",request) 
}
export const verify = (request) =>  { 
    return AxiosInstance.post("/auth/verify",request) 
}

const AuthInterface = {
    signIn,
    register,
    verify
}

export default AuthInterface