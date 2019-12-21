import * as actionTypes from '../actionTypes'

export var mainPageReducer = (state = {
    list: [],
    isLoading: false
}, action)=>{
    switch (action.type){
        case actionTypes.UPDATE_SEARCH_RESULT:
            return {
                ...state,
                list: action.payload,
                isLoading: false
            };
        case actionTypes.TOGGLE_MAINPAGE_LOADING: 
            return {
                ...state,
                isLoading: action.payload
            }
        default:
            return state;
    }
}