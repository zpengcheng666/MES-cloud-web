<template>
  <container :gutter="20" class="process-container" fit="contain">
    <swiper :slides-per-view="3" :space-between="50" class="process-step-swiper">
      <swiper-slide v-for="(step, index) in props.stepList" :key="index" class="process-step">
        <div :gutter="20" class="step-main" fit="contain">
          <el-header class="step-header">
            <el-row :gutter="20" class="step-title">
              <el-space style="height: 100%">
                <el-image fit="contain" :src="getStatus(step.status)" style="height: 1.6vh" />
                <span :span="16" class="text">工步 {{ index }}</span>
              </el-space>
            </el-row>
          </el-header>
          <el-main>
            <el-row style="height: 4vh">
              <el-col :span="6" class="step-detail-text">序号:</el-col>
              <el-col :span="6" class="step-detail-text">{{ step.number }}</el-col>
              <el-col :span="6" class="step-detail-text">名称:</el-col>
              <el-col :span="6" class="step-detail-text">{{ step.name }}</el-col>
            </el-row>
            <el-row style="height: 4vh">
              <el-col :span="6" class="step-detail-text">关重属性:</el-col>
              <el-col :span="6" class="step-detail-text">{{ step.key }}</el-col>
              <el-col :span="6" class="step-detail-text">工时(min):</el-col>
              <el-col :span="6" class="step-detail-text">{{ step.time }}</el-col>
            </el-row>
          </el-main>
        </div>
      </swiper-slide>
    </swiper>
    <div class="swiper-button-prev" @click.stop="pre()"></div>
    <div class="swiper-button-next" @click.stop="next()"></div>
  </container>
</template>
<script lang="ts" setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
//总体

const props = defineProps(['stepList'])

/*********************************状态(指示灯)********************************/
import lightGreen from '@/assets/produceterminal/images/lightGreen.png'
import lightRed from '@/assets/produceterminal/images/lightRed.png'
import lightYellow from '@/assets/produceterminal/images/lightYellow.png'
import lightGrizzly from '@/assets/produceterminal/images/lightGrizzly.png'

function getStatus(id) {
  switch (id) {
    case 0:
      return lightGreen
      break
    case 1:
      return lightRed
      break
    case 2:
      return lightYellow
      break
    case 3:
      return lightGrizzly
      break
  }
}
/**************************************其他*********************************/

const pre = () => {
  const swiper = document.querySelector('.swiper').swiper
  swiper.slidePrev()
}

const next = () => {
  const swiper = document.querySelector('.swiper').swiper
  swiper.slideNext()
}
</script>

<style lang="scss" scoped>
@import url('@/assets/produceterminal/scss/taskRunBottom.scss');
</style>
