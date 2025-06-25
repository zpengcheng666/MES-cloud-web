<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="100px"
    >
      <el-form-item label="条码" prop="no">
        <el-input
          v-model="queryParams.no"
          placeholder="条码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>


      <el-form-item label="批次码" prop="batchNo">
        <el-input
          v-model="queryParams.batchNo"
          placeholder="批次码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <!--<el-form-item label="类型" prop="name">-->
      <!--<el-input-->
      <!--v-model="queryParams.no"-->
      <!--placeholder="类型"-->
      <!--clearable-->
      <!--@keyup.enter="handleQuery"-->
      <!--class="!w-240px"-->
      <!--/>-->
      <!--</el-form-item>-->
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon icon="ep:search" class="mr-5px"/>
          追溯
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px"/>
          重置
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <ContentWrap>
      <el-form
        ref="formRef"
        :model="formData"
        label-width="100px"
        v-loading="formLoading"
      >
        <el-row :gutter="20">
          <el-col :span="4">
            <el-form-item label="条码" prop="barCode">
              <el-tag type="primary"> {{formData.barCode}}</el-tag>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="名称" prop="materialName">
              <el-tag type="primary"> {{formData.materialName}}</el-tag>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="编号" prop="materialNumber">
              <el-tag type="primary">{{formData.materialNumber}}</el-tag>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="类码" prop="materialCode">
              <el-tag type="primary">{{formData.materialCode}}</el-tag>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="批次号" prop="batchNumber">
              <el-tag type="primary"> {{formData.batchNumber}}</el-tag>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="单位" prop="materialUnit">
              <el-tag type="primary"> {{formData.materialUnit}}</el-tag>
            </el-form-item>

          </el-col>
        </el-row>
      </el-form>

    </ContentWrap>
    <ContentWrap>
      <el-tabs v-model="subTabsName">
        <el-tab-pane label="出入库追溯" name="detail">
          <template v-for="(item,index)  in formData.infos" :key="index">

            <ContentWrap>
              <el-form
                ref="formRef"
                :model="item"
                :rules="formRules"
                status-icon
                v-loading="formLoading"
              >
                <el-row :gutter="20">

                  <template v-for="(key, value) in item" :key="value">
                    <el-col :span="4">
                      <el-form-item :label="getValue(value)" prop="name">
                        <el-tag type="primary" v-if="value != 'retraceType'"> {{getInfo(key,value)}}</el-tag>
                        <el-tag type="danger" v-if="value == 'retraceType'"> {{getInfo(key,value)}}</el-tag>
                      </el-form-item>
                    </el-col>
                  </template>
                </el-row>
              </el-form>
            </ContentWrap>
          </template>
        </el-tab-pane>
        <el-tab-pane label="生产追溯" name="productDetail">
          <template v-for="(item,index)  in formData.productsInfos" :key="index">

            <ContentWrap>
              <el-form
                ref="formRef"
                :model="item"
                :rules="formRules"
                status-icon
                v-loading="formLoading"
              >
                <el-row :gutter="20">

                  <template v-for="(key, value) in item" :key="value">
                    <el-col :span="4">
                      <el-form-item :label="getValue(value)" prop="name">
                        <el-tag type="primary" v-if="value != 'retraceType'"> {{getInfo(key,value)}}</el-tag>
                        <el-tag type="danger" v-if="value == 'retraceType'"> {{getInfo(key,value)}}</el-tag>
                      </el-form-item>
                    </el-col>
                  </template>
                </el-row>
              </el-form>
            </ContentWrap>
          </template>
        </el-tab-pane>
        <el-tab-pane label="质检追溯" name="inspectionDetail">
          <template v-for="(item,index)  in formData.inspectionInfos" :key="index">

            <ContentWrap>
              <el-form
                ref="formRef"
                :model="item"
                :rules="formRules"
                status-icon
                v-loading="formLoading"
              >
                <el-row :gutter="20">

                  <template v-for="(key, value) in item" :key="value">
                    <el-col :span="4">
                      <el-form-item :label="getValue(value)" prop="name">
                        <el-tag type="primary" v-if="value != 'retraceType'"> {{getInfo(key,value)}}</el-tag>
                        <el-tag type="danger" v-if="value == 'retraceType'"> {{getInfo(key,value)}}</el-tag>
                      </el-form-item>
                    </el-col>
                  </template>
                </el-row>
              </el-form>
            </ContentWrap>
          </template>
        </el-tab-pane>
        <el-tab-pane label="销售追溯" name="dmDetail">
          <template v-for="(item,index)  in formData.dmInfos" :key="index">

            <ContentWrap>
              <el-form
                ref="formRef"
                :model="item"
                :rules="formRules"
                status-icon
                v-loading="formLoading"
              >
                <el-row :gutter="20">

                  <template v-for="(key, value) in item" :key="value">
                    <el-col :span="4">

                      <el-form-item :label="getValue(value)" prop="name">
                        <el-tag type="primary" v-if="value != 'retraceType'"> {{getInfo(key,value)}}</el-tag>
                        <el-tag type="danger" v-if="value == 'retraceType'"> {{getInfo(key,value)}}</el-tag>
                      </el-form-item>

                    </el-col>
                  </template>
                </el-row>
              </el-form>
            </ContentWrap>
          </template>
        </el-tab-pane>
      </el-tabs>
    </ContentWrap>

  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <InspectionToolForm ref="formRef" @success="getList"/>
</template>

<script setup lang="ts">
  import {dateFormatter, formatDate} from '@/utils/formatTime'
  import download from '@/utils/download'
  import {RetraceApi, RetraceVO} from '@/api/qms/retrace'
  import {RetraceConfigApi, RetraceConfigVO} from '@/api/qms/retraceconfig'

  /** 检测工具 列表 */
  defineOptions({name: 'RetraceInfo'})

  const message = useMessage() // 消息弹窗
  const {t} = useI18n() // 国际化
  const subTabsName = ref('detail')
  const loading = ref(false) // 列表的加载中
  const formData = ref({})

  const configList = ref < RetraceConfigVO[] > ([]) // 列表的数据
  const total = ref(0) // 列表的总页数
  const queryParams = reactive({
    no: undefined,
    batchNo: ''
  })
  const queryFormRef = ref() // 搜索的表单
  const exportLoading = ref(false) // 导出的加载中

  /** 查询列表 */
  const getList = async () => {
    loading.value = true
    try {
      formData.value = await RetraceApi.getRetrace(queryParams.no, queryParams.batchNo)
    } finally {
      loading.value = false
    }
  }
  //获取配置
  const getConfig = async () => {
    loading.value = true
    configList.value = [];
    try {
      configList.value = await RetraceConfigApi.getRetraceConfigList(queryParams)
    } finally {
      loading.value = false
    }
  }

  const getValue = (no) => {

    const config = configList.value.find((item) => item.no === no);
    if (config) {
      return config.name + ':';
    } else {
      return no + ':';
    }
  }

  const getInfo = (value,no) => {

    if (no !='createTime' &&no != 'updateTime') {
      return value;
    }
    const s = formatDate(value);
    if (s != 'Invalid Date') {
      return s;
    } else {
      return value
    }

  }

  /** 搜索按钮操作 */
  const handleQuery = () => {
    queryParams.pageNo = 1
    if (queryParams.no ==undefined){
      message.error(t('请输入条码'))
    }
    getList()
    getConfig()
  }
  /** 重置按钮操作 */
  const resetQuery = () => {
    queryFormRef.value.resetFields()
    handleQuery()
  }
  //
  /** 初始化 **/
  onMounted(() => {
    getConfig()
  })
</script>
