<template>
  <div class="mp3-form-box">
    <el-form ref="form" label-width="80px">
      <el-form-item label="录制语音:">
        <el-button type="primary" v-if="!startFlag && !time" @click="startRecord">开始录音</el-button>
        <el-button type="primary" v-if="startFlag" @click="endRecord">结束录音</el-button>
        <el-button type="primary" v-if="!startFlag && time" @click="resetRecord">重新录制</el-button>
        <br v-if="audioSource.length > 0">
        <br v-if="audioSource.length > 0">
        <audio :src="audioSource" ref="audioEl" v-show="audioSource.length > 0"></audio>
      </el-form-item>
      <el-form-item label="录制时长:">
        <el-row>
          <el-col :span="2">{{time}}s</el-col>
          <el-col :span="20">
            <el-progress  :stroke-width="26" :percentage="percentage" :format="format"></el-progress>
          </el-col>
          <el-col :span="2">60s</el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="asyncOK">立即创建</el-button>
      </el-form-item>
    </el-form>
    <!-- <div>
      <audio :src="audioSource" controls="controls"></audio>
    </div> -->
    <div>
      语音生成
      <br>
      语音格式转码

    </div>
  </div>
</template>
<script>
  import { getMp3MediaRecorder } from 'mp3-mediarecorder';
  import convertAudioToAmr from '../../../libs/convertAmr'
  let Mp3MediaRecorder = null
export default {
  data () {
    return {
    loading: true,
      codeList: [],
      cancelDate: '',
      startFlag: false, //- 开始录制标识
      intervalHandler: null, //- 定时器id
      audioSource: "", //- 录音地址
      audioAmrSource: "", //- amr录音地址
      chunks: [],
      time: 0,
      mediaRecorderEntity: null,
      blob: null,
      amrBlob: null,
      loading: false,
      percentage: 0,
    }
  },
  mounted() {
      //- 录音初始化
      const supportsWasm = WebAssembly && typeof WebAssembly.instantiate === 'function';
      const supportsUserMediaAPI = navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function';
      const isBrowserSupported = supportsWasm && supportsUserMediaAPI;
      if (!isBrowserSupported) {
        // eslint-disable-next-line
        console.warn("当前浏览器不支持MediaDevices和WebAssembly，请升级浏览器！");
        return;
      }
      // ../libs/vmsg@0.3.5/vmsg.wasm
      getMp3MediaRecorder({ wasmURL: 'https://oss-upload.hz5800.com/2020/2/28/1582880539277613492.wasm'}).then(recorderClass => {
        Mp3MediaRecorder = recorderClass;
      });
  },
  methods: {
      startRecord() {
        const AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
        if (AudioContext) {
          this.audioContext = new AudioContext();
        } else {
          console.warn('Web Audio API is Unsupported.');
        }
        if (navigator.mediaDevices) {
          console.log('getUserMedia supported.');
          var constraints = { audio: true };
          navigator.mediaDevices.getUserMedia(constraints)
          .then((stream)=> {
            this.mediaRecorderEntity = new Mp3MediaRecorder(stream, {
              sampleRate:8000 //amr，MP3均可采用此采样率
            });
            this.mediaRecorderEntity.start();
            this.mediaRecorderEntity.onstart = (timeslice) => {
              console.log("recorder started",timeslice);
              this.startFlag = true
              this.chunks = [];
              this.intervalHandler = setInterval(() => {
                if (this.time >= 60) {
                  this.time = 60;
                  this.endRecord()
                } else {
                  this.time += 1;
                  this.percentage = this.time/60*100
                }
              }, 1000);
            }
            this.mediaRecorderEntity.onstop = () => {
              stream.getTracks().forEach(track => track.stop());
              this.$refs.audioEl.setAttribute("controls", "");
              this.blob = new Blob(this.chunks, { type: 'audio/mpeg' });
              const audioURL = window.URL.createObjectURL(this.blob);
              //- 音频转码
              convertAudioToAmr(audioURL, this.audioContext).then(data => {
                this.amrBlob = data;
              }).catch(err =>{
                this.$message.error('音频转码失败！')
              })
              this.audioSource = audioURL;
              this.$refs.audioEl.setAttribute("controls", true);
              this.$nextTick(() => {
                this.startFlag = false;
              });
            }
            this.mediaRecorderEntity.ondataavailable = evt => {
              this.chunks.push(evt.data);
            };
          }).catch((err)=>{

            this.$message.error('没有录音设备')
          })
        }else {
          this.$message.error('getUserMedia not supported')
        }
      },
      //- 语音文件上传服务器
      uploadRecord (formData) {
        const url = getUrl('onlyAudioload', {}, true)
        return postAudioFetch(url, formData).then(
          data=> data.json()).then(data => {
            if (data.code == 1 && data.data) {
              return data.data
            } else {
              this.$message.error('语音上传失败，请重试！');
            }
          }
        )
      },
      endRecord() {
        this.startFlag = false
        this.mediaRecorderEntity.stop();
        clearInterval(this.intervalHandler);
        console.log("recorder stopped");
      },
      resetRecord() {
        this.audioSource = '';
        this.audioAmrSource = '';
        this.time = 0
        this.percentage = 0
      },
      async asyncOK () {
        if (this.audioSource) {
          if (this.loading) return
          this.loading = true
          let formData = new FormData()
          const file = new File([this.blob], `${Date.now()}.mp3`, { type: "audio/mp3"})
          formData.append("attachment", file)
          const mp3Url = await this.uploadRecord(formData)
          let formData2 = new FormData()
          const file2 = new File([this.amrBlob], `${Date.now()}.amr`, { type: "audio/amr"})
          formData2.append("attachment", file2)
          const amrUrl = await this.uploadRecord(formData2)
          let params = {
            voice: mp3Url,
            voiceAmr: amrUrl,
            voiceTime: parseInt(document.getElementById('audioEl').duration),
            contentType: 'voice'
          }
          sendAudio(store, params).then(res => {
            if(res && res.code ==1) {
              this.$message.success('发送成功')
              this.close()
            } else {
              this.$message.error('发送失败')
            }
          })
        } else {
          this.$message.warning('请录制语音')
        }
      },
      format() {
        return ''
      }

  },
  created () {

  }
};
</script>
<style lang="scss" scoped>
.mp3-form-box{
  padding-bottom: 80px;
  width: 60%;
  margin: 0 auto;
  .btns{
    text-align: center;
    position: fixed;
    bottom: 0;
    background-color: #ccc;
    height: 60px;
    line-height: 60px;
    width: 100%;
  }
}
</style>

