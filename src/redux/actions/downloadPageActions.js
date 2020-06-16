import _ from 'lodash'
import * as actionTypes from '../actionTypes'

export let updateDownloadList = (list, cb) => {
    return (dispatch) => {
        dispatch({ type: actionTypes.UPDATE_DOWNLOAD_LIST, payload: list })
        if (_.isFunction(cb)) { cb() }
    }
}

export let updateCompleteList = (list, cb) => {
    return (dispatch) => {
        dispatch({ type: actionTypes.UPDATE_COMPLETE_LIST, payload: list })
        if (_.isFunction(cb)) { cb() }
    }
}