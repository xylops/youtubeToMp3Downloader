const _ = require('lodash')
const ytdl = require('ytdl-core')
const fs = require('fs')
const os = require('os')
const storage = require('electron-json-storage')
const path = require('path')
const { isEmpty } = require('lodash')
const { spawn } = require('child_process');
const ffmpeg = require('ffmpeg-static').path;
const Bottleneck = require('bottleneck')

class Download {
    constructor() {
        this.list = [],
        this.completeList = []
        this.ffmpegPath = ffmpeg.path
        this.limiter = null
    }
    init(){
        this.updateMaxConnection()
    }
    updateMaxConnection(){
        storage.get('maxConnection', (err, count) => {
            this.limiter = new Bottleneck({
                maxConcurrent: Number(count),
            });
        })
    }
    getList() {
        return {
            downloading: this.list,
            complete: this.completeList
        }
    }
    downloadList(list){
        let that = this
        let audioDownloadWithLimiter = this.limiter.wrap(this.audio)
        this.list = [...this.list, ...list]
        const allTasks = list.map(x => audioDownloadWithLimiter(x, that));
        return Promise.all(allTasks);
    }
    audio(item, pthis) {
        return new Promise((resolve, reject)=>{
            try {
                item.title = item.title.replace('/', '') 
                item.title = item.title.replace('/', '') // these are different character
                let id = item.id
                let fileNameWithDir = path.join(os.tmpdir(), item.title)
                        
                let that = pthis
                let downloadStream = ytdl(id, { quality: 'highestaudio' })
                let tempFileWithDir = path.join(os.tmpdir(), id)
                let createTempFileStream = 
                    fs.createWriteStream(tempFileWithDir + '.mp4')
                    .on('error', (err)=>{
                        console.log(err)
                    })
    
                downloadStream.pipe(createTempFileStream)
                downloadStream.on('response', (res) => {
                    var totalSize = res.headers['content-length'];
                    var dataRead = 0;
                    res.on('data', (data) => {
                        let idx = _.findIndex(that.list, (o) => { return o.id === id })
                        dataRead += data.length;
                        that.list[idx].complete = Math.round((dataRead / totalSize) * 100);
                    });
                })
    
                downloadStream.on('finish', () => {
                    let ffmpegChild = spawn (ffmpeg, ['-i',  tempFileWithDir  + '.mp4',  fileNameWithDir + '.mp3'])
                    ffmpegChild.on('close', (code)=> {
                        let idx = _.findIndex(that.list, (o) => { return o.id === id })
                        that.completeList.push(that.list[idx])
                        that.list.splice(idx, 1)
                        storage.get('downloadDirectory', (err, dir) => {
                            let targetDir = isEmpty(dir) ? os.homedir() : dir;
                            let is = fs.createReadStream(fileNameWithDir + '.mp3')
                            let os = fs.createWriteStream(path.join( targetDir , item.title.replace('/') + '.mp3' ));
                            is.pipe(os);
                            is.on('end', () => {
                                fs.unlinkSync(fileNameWithDir + '.mp3');
                                fs.unlinkSync(tempFileWithDir + '.mp4');
                                resolve()
                            });
                            is.on('error', (err)=>{
                                console.log(err)
                            })
                            os.on('error', (err)=>{
                                console.log(err)
                            })
                        })
                    })
                })	
            } catch (err){
                reject()
                console.log(err)
            }
        })
        
    }
}

module.exports = Download