<template>
  <!-- 选择检验方案弹窗 -->
  <el-dialog class="taskRunSetInspectionScheme" v-model="startDialog" width="500">
    <el-form :model="formData" label-width="auto" class="form">
      <el-form-item label="检验方案" prop="inspectionScheme">
        <el-select
          v-model="formData.inspectionScheme as any"
          placeholder="请选择检验方案"
          class="set-inspection-scheme-select"
          popper-class="set-inspection-scheme-select-div"
        >
          <el-option class="set-inspection-scheme-select-item" v-for="dict in inspectionSchemeList" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <div style="color: rgb(160, 241, 243)">{{ selectInspectionSchemeInfo }}</div>
    </el-form>
    <template #footer>
      <div class="confirmBtn">
        <el-image class="btn" :src="confirmBtn" @click="handleSetInspectionScheme" />
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
/*********************************引入****************************************/
import confirmBtn from '@/assets/produceterminal/images/confirmBtn.png';
//确认按钮图片
import { ElNotification } from 'element-plus';

/**********************************公共数据*******************************/

const startDialog = ref(false);
//是否开启检验方案选择弹窗
const formData = ref({
  inspectionScheme: null
});
//表单数据
const selectInspectionSchemeInfo = ref('');
//警告信息

let isClick = false;
//是否已点击

/*********************************打开、结束行为******************************/

let submitData;
//提交数据

import { InspectionSchemeApi } from '@/api/qms/inspectionscheme';
const inspectionSchemeList = ref(); //检验方案列表
//打开弹窗
async function open(processId, technologyId, otherData) {
  submitData = {
    recordId: otherData.recordId,
    barCode: otherData.barCode,
    userId: otherData.userId
  };
  //设置提交数据

  inspectionSchemeList.value = await InspectionSchemeApi.getInspectionSchemeList4InspectionSheet({
    processId: processId,
    technologyId: technologyId,
    schemeType: 2
  });
  inspectionSchemeList.value = inspectionSchemeList.value.map((v) => ({
    value: v.id,
    label: v.schemeName,
    ...v
  }));
  //获得下拉菜单列表

  formData.value = {
    inspectionScheme: null
  };
  selectInspectionSchemeInfo.value = '';
  isClick = false;
  //初始化数据

  //存在一个选项是默认选择
  if (inspectionSchemeList.value.length == 1) {
    formData.value.inspectionScheme = inspectionSchemeList.value[0].value;
    try {
      await handleSetInspectionScheme();
      ElNotification({
        title: '成功',
        message: '检验方案已自动选择',
        type: 'success'
      });
    } catch (e) {
      startDialog.value = false;
      throw e;
    }
  } else {
    startDialog.value = true;
  }
}
defineExpose({ open });

import { TerminalApi } from '@/api/mcs/terminal';
//选择检验方案
async function handleSetInspectionScheme() {
  if (isClick == false) {
    try {
      isClick = true;
      await TerminalApi.createInspectionSheet({
        recordId: submitData.recordId,
        barCode: submitData.barCode,
        schemeId: formData.value.inspectionScheme,
        userId: submitData.userId
      });
    } catch (e) {
      isClick = false;
      throw e;
    }
    startDialog.value = false;
  }
}
</script>

<style lang="scss">
/********************************弹窗*****************************/

.taskRunSetInspectionScheme {
  --el-dialog-bg-color: transparent;
  background-image: url(../../../../assets/produceterminal/images/taskRunDetailBackground.png);
  background-size: 100% 100%;

  height: 30vh;
}

.taskRunSetInspectionScheme :deep(*) {
  background-color: transparent;
}

.taskRunSetInspectionScheme {
  .el-dialog__header {
    display: none;
  }

  .form {
    width: 70%;
    margin: 5vh auto 0px auto;
  }

  .btn:hover {
    background: #15bc83;
    box-shadow: -1px 1px 1px rgba(0, 0, 0, 0.5);
    opacity: 0.8;
    cursor: pointer;
  }

  .btn {
    height: 3vh;
    margin-right: 5vw;
  }

  .el-input__wrapper {
    background-color: transparent;
    border: 2px solid #01e0fc !important;
    box-shadow: none !important;
  }

  .el-input__inner {
    color: #76f0ee;
    font-size: large;
    outline: none;
    border-color: transparent;
    background: transparent !important;
  }

  .el-form-item__label {
    font-size: 0.9vw;
    color: #76f0ee;
  }
}

/************************************下拉列表*******************************/

.set-inspection-scheme-select {
  width: 10vw;
}

.set-inspection-scheme-select .el-select__wrapper {
  border: 1px solid rgb(37, 217, 253) !important;
  box-shadow: none !important;
  background-color: transparent;
  padding: 0px;

  .el-select__suffix {
    display: none;
  }
  .el-select__selection .el-select__input-wrapper {
    display: none;
  }

  .el-select__selection .el-select__placeholder {
    color: #76f0ee;
    font-size: 2vh;
  }
}

.set-inspection-scheme-select-div {
  border: 1px solid rgb(37, 217, 253) !important;
  --el-bg-color-overlay: black;
  --el-fill-color-light: #18262c;
  --el-text-color-regular: #76f0ee;
  --el-color-primary: #76f0ee;

  .el-scrollbar {
    .el-scrollbar__view {
      padding: 0px;
      text-align: center;
    }
  }

  .el-popper__arrow {
    display: none;
  }
}

.set-inspection-scheme-select-item {
  border: 0.001vh solid rgb(37, 217, 253);
}
</style>
