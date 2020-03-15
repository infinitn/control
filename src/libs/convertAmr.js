/****
 * amr音频编码解码库地址：https://github.com/jpemartins/amr.js
 */

let _blob = null;

export default function convertWithUrl(url, audioContext) {
  // return new Response(blob).arrayBuffer().then(array => initWithArrayBuffer(array))//由blob格式转为array buffer格式
  return fetch(url).then(res => res.arrayBuffer()).then(array => initWithArrayBuffer(array, audioContext))
}

function initWithArrayBuffer(array, audioContext) {

  return new Promise((resolve, reject) => {
    const sampleRate = audioContext.sampleRate
    decodeAudioArrayBufferByContext(array, audioContext).then((data) => {
      return AMR.encode(data, sampleRate || 8000, 7);
    }).then((rawData) => {
      _blob = new Blob([rawData.buffer], {type: 'audio/amr'});
      resolve(_blob)
    }).catch((err) => {
      reject(new Error('Failed to convert.'));
    });
  });
}

/* 音轨压缩 */
function decodeAudioArrayBufferByContext(array, audioContext) {
  return new Promise((resolve, reject) => {
    audioContext['decodeAudioData'](array, (audioBuf) => {
      const numberOfChannels = audioBuf.numberOfChannels;
      let dest = new Float32Array(audioBuf.length);

      switch (numberOfChannels) {
        default:
        case 1: {
          dest = audioBuf.getChannelData(0);
          break;
        }
        case 2: {
          const left = audioBuf.getChannelData(0);
          const right = audioBuf.getChannelData(1);
          for (let i = 0, l = dest.length; i < l; i++) {
            dest[i] = .5 * (left[i] + right[i])
          }
          break;
        }
        case 4: {
          const left = audioBuf.getChannelData(0);
          const right = audioBuf.getChannelData(1);
          const sLeft = audioBuf.getChannelData(2);
          const sRight = audioBuf.getChannelData(3);
          for (let i = 0, l = dest.length; i < l; i++) {
            dest[i] = .25 * (left[i] + right[i] + sLeft[i] + sRight[i])
          }
          break;
        }
        case 6: {
          const left = audioBuf.getChannelData(0);
          const right = audioBuf.getChannelData(1);
          const center = audioBuf.getChannelData(2);
          const sLeft = audioBuf.getChannelData(4);
          const sRight = audioBuf.getChannelData(5);
          for (let i = 0, l = dest.length; i < l; i++) {
            dest[i] = 0.7071 * (left[i] + right[i]) + center[i] + 0.5 * (sLeft[i] + sRight[i])
          }
          break;
        }
      }
      resolve(dest);
    }, reject);
  });
}
