import * as actionTypes from '../actionTypes'

export var downloadPageReducer = (state = {
    downloadingList: [],
    completeList: []
}, action)=>{
    switch (action.type){
        case actionTypes.UPDATE_DOWNLOAD_LIST:
            return {
                ...state,
                downloadingList: action.payload,
            };
        case actionTypes.UPDATE_COMPLETE_LIST:
            return {
                ...state,
                completeList: action.payload,
            };
        default:
            return state;
    }
}