<template>
    <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24" class="mb-8px" v-hasPermi="['qms:inspectionSheetToGenerate:list']">
      <el-card shadow="never" style="height: 400px">
        <template #header>
          <div class="h-3 flex justify-between">
            <span>检验单待生成（质检）</span>
            <router-link :to="'/qms/inspection/inspection-sheet-generate-task'">
              <el-button link type="primary">{{ t('action.more') }}</el-button>
            </router-link>
          </div>
        </template>
        <template #default>
          <InspectionSheetGenerateTask ref="regFormRef"/>
        </template>
      </el-card>
    </el-col>
    <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24" class="mb-8px" v-hasPermi="['qms:inspectionSheetToClaim:list']">
      <el-card shadow="never" style="height: 400px">
        <template #header>
          <div class="h-3 flex justify-between">
            <span>检验任务待认领（质检）</span>
            <router-link :to="'/qms/inspection/inspection-sheet-task'">
              <el-button link type="primary">{{ t('action.more') }}</el-button>
            </router-link>
          </div>
        </template>
        <InspectionClaimTask ref="regFormRef"/>
      </el-card>
    </el-col>
    <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24" class="mb-8px" v-hasPermi="['qms:inspectionSheetToInspect:list']">
      <el-card shadow="never" style="height: 400px">
        <template #header>
          <div class="h-3 flex justify-between">
            <span>检验任务待检验（质检）</span>
            <router-link :to="'/qms/inspection/inspection-sheet'">
              <el-button link type="primary">{{ t('action.more') }}</el-button>
            </router-link>
          </div>
        </template>
        <InspectionInspectionTask ref="regFormRef"/>
      </el-card>
    </el-col>
    <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24" class="mb-8px" v-hasPermi="['qms:inspectionToolToVerificate:list']">
      <el-card shadow="never" style="height: 400px">
        <template #header>
          <div class="h-3 flex justify-between">
            <span>检验工具送检（质检）</span>
            <router-link :to="'/qms/inspection/inspection-tool-verification-record'">
              <el-button link type="primary">{{ t('action.more') }}</el-button>
            </router-link>
          </div>
        </template>
        <InspectionToolVerificationTask />
      </el-card>
    </el-col>
    <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24" class="mb-8px" v-hasPermi="['qms:inspectionUnqualifiedToRegistion:list']">
      <el-card shadow="never" style="height: 400px" >
        <template #header>
          <div class="h-3 flex justify-between">
            <span>不合格品登记（质检）</span>
            <router-link :to="'/qms/inspection/inspection-sheet'">
              <el-button link type="primary">{{ t('action.more') }}</el-button>
            </router-link>
          </div>
        </template>
        <InspectionUnqualifiedTask ref="regFormRef"/>
      </el-card>
    </el-col>
    <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24" class="mb-8px" v-hasPermi="['qms:inspection-sheet:query']">
        <WorkerQualifiedStastic ref="regFormRef"/>
    </el-col>

</template>
<script lang="ts" setup>

import InspectionSheetGenerateTask from '@/views/qms/home/components/InspectionGenerateTask.vue'
import InspectionClaimTask from '@/views/qms/home/components/InspectionClaimTask.vue'
import InspectionInspectionTask from '@/views/qms/home/components/InspectionInspectionTask.vue'
import InspectionUnqualifiedTask from '@/views/qms/home/components/InspectionUnqualifiedTask.vue'
import InspectionToolVerificationTask from '@/views/qms/home/components/InspectionToolVerificationTask.vue'
import WorkerQualifiedStastic from '@/views/qms/home/components/WorkerQualifiedStastic.vue'
import {checkPermi} from "@/utils/permission";

defineOptions({ name: 'QmsHomeForm' })
const message = useMessage() // 消息弹窗
const { t } = useI18n()

</script>
