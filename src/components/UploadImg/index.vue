<template>
  <div class="upload-img-container">
    <el-upload
      class="avatar-uploader"
      action="https://jsonplaceholder.typicode.com/posts/"
      :show-file-list="false"
      :before-upload="beforeAvatarUpload"
      :http-request="requestHandler"
    >
      <img v-if="value" :src="value" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon" />
    </el-upload>
    <!-- 删除按钮 -->
    <i v-if="value" class="el-icon-error" @click="removeImg" />
  </div>
</template>

<script>
// 导包
import COS from 'cos-js-sdk-v5'
// 实例化
const cos = new COS({
  SecretId: 'AKIDNaXDdltkKdfQv97sW1HI2WosgDTS9Zia', // 身份识别 ID
  SecretKey: 'cx1nIXVCcldDWYJn0wbz6wWprbLp2yg8' // 身份密钥
})
export default {
  name: 'UploadImg',
  props: {
    value: {
      type: String
    }
  },
  //   data() {
  //     return {
  //       imageUrl: ''
  //     }
  //   },
  methods: {
    //   删除图片
    removeImg() {
      //   this.imageUrl = ''
      this.$emit('input', '')
    },
    beforeAvatarUpload(file) {
      const isJPG = ['image/jpeg', 'image/png', 'image/gif'].includes(file.type)
      const isLt2M = file.size / 1024 / 1024 < 50

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG,PNG,GIF 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 50MB!')
      }
      return isJPG && isLt2M
    },
    requestHandler(params) {
      // 在需求的时候调用方法即可
      cos.putObject(
        {
          Bucket: 'yashiyani-1306581474' /* 容器名 必须 */,
          Region: 'ap-shenzhen-fsi' /* 存储桶所在地域，必须 */,
          Key: params.file.name /* 文件标记,可以用名字代替 必须 */,
          StorageClass: 'STANDARD' /* 固定值可以不管他 必须 */,
          Body: params.file, // 上传文件对象
          onProgress: progressData => {
            // 上传进度
            console.log(JSON.stringify(progressData))
          }
        },
        (err, data) => {
          // 有错就是err 没错就是 data
          //   console.log(err)
          if (data.statusCode === 200) {
            // this.imageUrl = 'https://' + data.Location
            this.$emit('input', 'https://' + data.Location)
          }
        }
      )
    }
  }
}
</script>

<style lang="scss">
.upload-img-container {
  position: relative;
  width: 178px;
  height: 178px;
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .el-icon-error {
    position: absolute;
    right: -10px;
    top: -10px;
    color: red;
    font-size: 20px;
    cursor: pointer;
  }
}
</style>
