'use server'

const ffmpeg = require('ffmpeg.js');
const fs = require('fs');




export async function createVideo(images:Array<string>){
    //let imageToCombine = images.map((src, i) => ({name: `${src}${i}`, data: src }));
    ffmpeg({
        MEMFS: [
            { name: 'image1.jpg', data: image1 },
            { name: 'image2.jpg', data: image2 }
        ],
        arguments: ['-framerate', '1', '-i', 'image%d.jpg', 'output.mp4']
      }, function (err, result) {
        if (err) {
          console.error(err);
          return;
        }
        // Save video to disk
        const video = result.MEMFS[0];
        fs.writeFileSync(video.name, video.data);
        return video;
      });
}