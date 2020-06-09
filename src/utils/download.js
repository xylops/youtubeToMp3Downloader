const _ = require('lodash')
const ytdl = require('ytdl-core')
const fs = require('fs')
const os = require('os')
const storage = require('electron-json-storage')
const path = require('path')
const { isEmpty } = require('lodash')
const { spawn } = require('child_process');
const ffmpeg = require('ffmpeg-static').path;

class Download {
    constructor() {
        this.list = [],
        this.ffmpegPath = ffmpeg.path
    }
    getList() {
        return this.list
    }
    async audio(item) {
        try {
            item.title = item.title.replace('/', '') 
            item.title = item.title.replace('/', '') // these are different character
            let id = item.id
            this.list.push(item)
            let fileNameWithDir = path.join(os.tmpdir(), item.title)
                    
            let info = await ytdl.getInfo(id)
            let that = this
            // let audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
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
                    that.list.splice(idx, 1)
                    storage.get('downloadDirectory', (err, dir) => {
                        let targetDir = isEmpty(dir) ? os.homedir() : dir;
                        let is = fs.createReadStream(fileNameWithDir + '.mp3')
                        let os = fs.createWriteStream(path.join( targetDir , item.title.replace('/') + '.mp3' ));
                        is.pipe(os);
                        is.on('end', () => {
                            fs.unlinkSync(fileNameWithDir + '.mp3');
                            fs.unlinkSync(tempFileWithDir + '.mp4');
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
            console.log(err)
        }
        
    }
}

module.exports = Download