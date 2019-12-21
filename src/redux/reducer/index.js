import { combineReducers } from 'redux'
import { mainPageReducer } from './mainPageReducer'
import { settingPageReducer } from './settingPageReducer'
import { downloadPageReducer } from './downloadPageReducer'

export default combineReducers({
    mainPage: mainPageReducer,
    settingPage: settingPageReducer,
    downloadPage: downloadPageReducer
})