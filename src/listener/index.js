
module.exports = function(ipcMain){
    require('./MainPageListener')(ipcMain)
    require('./SettingPageListener')(ipcMain)
    require('./downloadPageListener')(ipcMain)
}