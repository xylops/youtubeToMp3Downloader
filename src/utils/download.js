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
    audio(item) {
        let id = item.id
        this.list.push(item)
        let that = this
        let fileNameWithDir = path.join(os.tmpdir(), item.title )
                
        ytdl.getInfo(id, (err, info) => {
            let that = this
            let audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
            let downloadStream = ytdl(id, { format: audioFormats[4] })

            downloadStream.pipe(fs.createWriteStream(fileNameWithDir + '.mp4'))
            downloadStream.on('response', function (res) {
                var totalSize = res.headers['content-length'];
                var dataRead = 0;
                res.on('data', function (data) {
                    let idx = _.findIndex(that.list, (o) => { return o.id === id })
                    dataRead += data.length;
                    that.list[idx].complete = Math.round((dataRead / totalSize) * 100);
                });
            })

            downloadStream.on('finish', () => {

                let ffmpegChild = spawn (ffmpeg, ['-i',  fileNameWithDir  + '.mp4',  fileNameWithDir + '.mp3'])
                ffmpegChild.stdout.on('data', data => {
                    // console.log(`stdout: ${data}`);
                });
                ffmpegChild.stderr.on('data', data => {
                    // console.log(`stderr: ${data}`);
                });
                ffmpegChild.on('close', (code)=> {
                    let idx = _.findIndex(that.list, (o) => { return o.id === id })
                    that.list.splice(idx, 1)
                    storage.get('downloadDirectory', (err, dir) => {
                        let targetDir = isEmpty(dir) ? os.homedir() : dir;
                        let is = fs.createReadStream(fileNameWithDir + '.mp3');
                        let os = fs.createWriteStream(path.join( targetDir , item.title + '.mp3' ));
                        is.pipe(os);
                        is.on('end', function () {
                            fs.unlinkSync(fileNameWithDir + '.mp3');
                            fs.unlinkSync(fileNameWithDir + '.mp4');
                        });
                    })
                })

            })
            // downloadStream.on('error', (err) => {	
            //     // this.list.splice(idx, 1)	
            //     // fs.unlinkSync(fileNameWithDir)	
            //     // console.log(err)	
            // })	
        })
    }
}

module.exports = Download