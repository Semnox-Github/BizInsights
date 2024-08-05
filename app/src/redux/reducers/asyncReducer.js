let initialState = {
    userId:null,
    clientgatewayURL:''
}

export const asyncStore=(state=initialState, action)=>
{
    switch (action.type) {

        case 'SET_GATE_WAY_URL': return {
            ...state, clientgatewayURL:action.payload
        }
            
           
    
        default: return state
            
    }


}