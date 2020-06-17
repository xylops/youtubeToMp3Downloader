const _ = require('lodash')
const axios = require('axios')

const { apiKey } = require('../utils/config')

module.exports = (ipcMain, download) => {
    ipcMain.on('onYTLinkSubmit', async (event, arg) => {
        let params = arg.split('?')[1]
        let paramsArray = params.split('&')
        let listID = ''
        let watchID = ''

        paramsArray.forEach((item) => {
            if (item.includes('list=')) {
                listID = item.split('=')[1]
            } else if (item.includes('v=')) {
                watchID = item.split('=')[1]
            }
        })
        let type = null
        let path = ''
        let axiosParams = {
            key: apiKey,
            part: 'snippet',
        }
        if (!_.isEmpty(listID)) {
            path = '/playlistItems'
            axiosParams.maxResults = 9999
            axiosParams.playlistId = listID
            type = 'list'
        } else if (!_.isEmpty(watchID)) {
            path = '/videos'
            axiosParams.id = watchID
            type = 'single'
        }

        try {
            let result = []
            let res = await axios({
                method: 'get',
                url: 'https://www.googleapis.com/youtube/v3' + path,
                params: axiosParams
            })
            if (type === 'list') {
                res.data.items.forEach((items) => {
                    result.push(items.snippet)
                })
            } else if (type === 'single') {
                result.push(res.data.items[0].snippet)
                result[0].resourceId = {}
                result[0].resourceId.videoId = res.data.items[0].id
            }
            event.sender.send('onYTLinkSubmitResult', result);
        } catch (err) {
            console.log(err)
        }
    });


    ipcMain.on('onDownloadListSubmit', (event, list) => {
        // list.forEach((item) => {
        //     download.audio(item, event)
        // })
        download.downloadList(list)
        let cron = setInterval(() => {
            let downloadingList = download.getList()
            event.sender.send('updateDownloadList', downloadingList);
            if (_.isEmpty(downloadingList)) { clearInterval(cron) }
        }, 200)
    })
    
}