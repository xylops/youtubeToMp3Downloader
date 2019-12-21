import * as actionTypes from '../actionTypes'

export var downloadPageReducer = (state = {
    list: [],
}, action)=>{
    switch (action.type){
        case actionTypes.UPDATE_DOWNLOAD_LIST:
            return {
                ...state,
                list: action.payload,
            };
        default:
            return state;
    }
}