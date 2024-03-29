import ENDPOINTS from "../commons/Endpoints";

let liveInstance = null;
export const getNewConnection = metamaskID => {
    console.log("checking env")
    let socketEndpoint = process.env.NODE_ENV == "production" || process.env.NODE_ENV == "test"  ? ENDPOINTS.WEBSOCKET_REMOTE_ENDPOINT : ENDPOINTS.WEBSOCKET_ENDPOINT
    console.log("socketEndpoint" , socketEndpoint)
    try{
        liveInstance = new WebSocket(socketEndpoint+"?metamaskId="+metamaskID);
    }
    catch(err){
        console.log("SOCKET INIT FAILURE", err)
    }

    return liveInstance
}

const SocketInstance = {
    getNewConnection,

}

export default SocketInstance;
