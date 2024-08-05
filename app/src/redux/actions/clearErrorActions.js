import * as types from './types'
export const handleError=()=>
    {
        return (dispatch)=>
        {
            dispatch({type:types.HANDLE_ERROR_SUCCESS});

        }
    }