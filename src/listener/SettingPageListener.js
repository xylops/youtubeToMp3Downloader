const { dialog } = require('electron');
const storage = require('electron-json-storage')
const _ = require('lodash')
const os = require('os')

module.exports = (ipcMain) => {
    ipcMain.on('openSelectFolderDialog', async (event, list) => {
        dialog.showOpenDialog({
            properties: ['openDirectory']
        }, (dir) => {
            if(_.isEmpty(dir)){ return }
            storage.set('downloadDirectory', dir[0], (err) => {
                event.sender.send('selectedDirectory', dir[0]);
            });
        });
    })
    ipcMain.on('getDownloadDirectory', async (event, list) => {
        storage.get('downloadDirectory', (err, dir) => {
            if(_.isEmpty(dir)){
                let defaultLocation = os.homedir()
                storage.set('downloadDirectory', defaultLocation, (err) => {
                    event.sender.send('selectedDirectory', defaultLocation);
                });
            } else {
                event.sender.send('getDownloadDirectory', dir)
            }
        })
    })
    ipcMain.on('getMaxConnection', async (event, list) => {
        storage.get('maxConnection', (err, num) => {
            event.sender.send('getMaxConnection', num)
        })
    })
    ipcMain.on('updateMaxConnection', async (event, num) => {
        storage.set('maxConnection', num, (err) => {
            event.sender.send('updateMaxConnection', num)
        })
    })
}