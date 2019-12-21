import * as actionTypes from '../actionTypes'

export var settingPageReducer = (state = {
    directory: null,
    maxConnection: 0
}, action)=>{
    switch (action.type){
        case actionTypes.UPDATE_SELECTED_DIRECTORY:
            return {
                ...state,
                directory: action.payload,
            };
        case actionTypes.UPDATE_MAX_CONNECTION: 
            return {
                ...state,
                maxConnection: action.payload
            }
        default:
            return state;
    }
}