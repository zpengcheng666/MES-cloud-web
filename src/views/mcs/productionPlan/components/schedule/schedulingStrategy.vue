<template>
  <ContentWrap>
    <el-form
      ref="formRef"
      :model="formData"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="开始时间">
        <el-switch v-model="formData.customerTime"/>
        <el-date-picker :disabled="!formData.customerTime" style="margin-left: 20px" v-model="formData.time" type="datetime" value-format="x"/>
      </el-form-item>
      <el-form-item label="资源数量">
        <el-switch inline-prompt inactive-text="无限制" v-model="formData.resourceLimitations"/>
      </el-form-item>
      <ContentWrap style="margin-left: 30px;margin-right: 60px;background-color: #f5f5f5" v-show="formData.resourceLimitations">
        <el-row :gutter="20">
          <el-col :span="4" v-for="item in formData.resource" :key="item.key">
            <el-form-item label-width="150px" :label="item.cutterNumber||item.materialNumber">
              <el-input type="number" v-model="item.value"/>
            </el-form-item>
          </el-col>
        </el-row>
      </ContentWrap>
    </el-form>
  </ContentWrap>
</template>

<script lang="ts" setup>
import {ContentWrap} from "@/components/ContentWrap";
import {inject, ref, onMounted} from "vue";
import {OrderFormApi} from "@/api/mcs/orderform";
import {LedgerApi} from "@/api/dms/ledger";

const formLoading = ref(false)
const formData = ref({
  customerTime: false,
  time: undefined,
  resourceLimitations: false,
  resource: []
})

const sharedInfo = inject("sharedInfo");

const getResourceDemand = async () => {
  formLoading.value = true
  try {
    if (sharedInfo.orderIdList) {
      if (sharedInfo.orderIdList.length == 0) {
        formData.value.resource = [];
      } else {
        const params = {orderIds: sharedInfo.batchOrderIdList.join(',')}
        formData.value.resource = await OrderFormApi.getResourceDemandByOrderId(params);
      }
    }
  } finally {
    formLoading.value = false
  }
}

const getSchedulingStrategy = () => {
  return formData.value;
}
sharedInfo.getSchedulingStrategy = getSchedulingStrategy

onMounted(() => {
  getResourceDemand();
})
</script>

<style scoped>

</style>
