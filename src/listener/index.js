const Download = require('../utils/download')

module.exports = function(ipcMain){
    let download = new Download()
    download.init()
    require('./MainPageListener')(ipcMain, download)
    require('./SettingPageListener')(ipcMain, download)
    require('./downloadPageListener')(ipcMain)
}