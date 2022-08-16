import _ from "lodash";

import AxiosInstance from "../wrapper/apiWrapper"

export const login = (request) => {
    return AxiosInstance.post("/auth/login",request)
}

export const register = (request) =>  { 
    return AxiosInstance.post("/auth/register",request) 
}
export const verify = (request) =>  { 
    return AxiosInstance.post("/auth/verify",request) 
}
export const validate = (request) =>  { 
    return AxiosInstance.post("/auth/validate",request) 
}


const AuthInterface = {
    login,
    register,
    verify,
    validate
}

export default AuthInterface