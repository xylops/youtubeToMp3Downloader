const { ipcRenderer } = window.require('electron')
import * as actions from '../redux/actions'

module.exports = (dispatch) => {
    ipcRenderer.on('onYTLinkSubmitResult', (event, arg) => {
        dispatch(actions.updateSearchResult(arg))
    });
    ipcRenderer.on('selectedDirectory', (event, arg) => {
        console.log(arg)
        dispatch(actions.updateSelectedDirectory(arg))
    });
    ipcRenderer.on('getDownloadDirectory', (event, arg) => {
        dispatch(actions.updateSelectedDirectory(arg))
    });
    ipcRenderer.on('updateMaxConnection', (event, arg) => {
        dispatch(actions.updateMaxConnection(arg))
    })
    ipcRenderer.on('getMaxConnection', (event, arg) => {
        dispatch(actions.updateMaxConnection(arg))
    });
    ipcRenderer.on('updateDownloadList', (event, list) => {
        dispatch(actions.updateDownloadList(list.downloading))
        dispatch(actions.updateCompleteList(list.complete))
    });
}