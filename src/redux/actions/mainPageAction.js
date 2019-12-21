import * as actionTypes from '../actionTypes'

export let updateSearchResult = (list) => {
    return (dispatch) => {
        dispatch({ type: actionTypes.UPDATE_SEARCH_RESULT, payload: list })
    }
}

export let toggleMainPageLoading = (isLoading) => {
    return (dispatch,) => {
        dispatch({ type: actionTypes.TOGGLE_MAINPAGE_LOADING, payload: isLoading })
    }
}