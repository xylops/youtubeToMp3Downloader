import * as actionTypes from '../actionTypes'

export let updateSelectedDirectory = (dir) => {
    return (dispatch) => {
        dispatch({ type: actionTypes.UPDATE_SELECTED_DIRECTORY, payload: dir })
    }
}

export let updateMaxConnection = (num) => {
    return (dispatch)=>{
        dispatch({type : actionTypes.UPDATE_MAX_CONNECTION, payload: num})
    }
}