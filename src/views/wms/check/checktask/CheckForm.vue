<template>
  <Dialog v-model="dialogVisible" width="80%" :title="dialogTitle">
    <ContentWrap>
      <!-- 盘点库位展示 -->
      <el-timeline v-for="(c,ci) in LocationDetailList" :key="ci" >  
        <h5>通道：{{ ci+1 }}</h5>
        <el-timeline-item v-for="(g,gi) in c" :key="gi"  :timestamp="'组:'+(gi+1)" placement='top'>
          <el-card>
            <el-row :gutter="10" v-for="(l,li) in g" :key="li">
              <el-col v-for="(s,si) in l" :key="si" :xs="4" :sm="3" :md="2" :lg="2" :xl="2">
                <div class="l-box" v-if="s!=null">
                  <el-badge v-if="s.checkContainer===null" :is-dot="false" :max="1000" class="item">
                    <el-button class="no-check"> 不盘点 </el-button>
                  </el-badge>
                  <el-badge v-else :value="getBindValue(s).checkCount || 0" @click="checkDetail(s)" :max="1000" class="item">
                    <el-button :class="getBindValue(s).style" >
                      {{ getBindValue(s).data }}</el-button>
                  </el-badge>
                  <div class="statistic-title">  {{ li+1 }} - {{ si+1 }}</div>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </ContentWrap>
    <template #footer>
      <el-button v-if="currentNode.checkStatus == 2 || currentNode.checkStatus === 3"  @click="submitCheck" type="success">提交盘点</el-button>
      <el-button @click="dialogVisible = false">关  闭</el-button>
    </template>
  </Dialog>

  <!-- 盘点库位详情--盘点 -->
  <Dialog v-model="detailVisible" width="80%" :title="detailTitle">
    <ContentWrap>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-button style="width: 360px;font-weight: bold;">当前库位容器: {{ checkDetailNode.checkContainer.barCode }}</el-button>
        </el-col>
        <el-col :span="4">
          <el-input v-if="currentContainer.containerStoragelist.length === 1" v-model="checkBarCode" @keydown="enterCheckCode" placeholder="请扫描物料条码" clearable  />
          <el-input v-else v-model="checkBarCode" placeholder="请扫描物料条码" clearable   />
        </el-col>
        <el-col v-if="currentContainer.containerStoragelist.length>1" :span="4">
          <el-input v-model="checkStorageCode" placeholder="请扫描储位码" clearable />
        </el-col>
        <el-col v-if="currentContainer.containerStoragelist.length>1" :span="4">
          <el-button type="primary" :icon="Search" @click="enterCheckCode()" style="width: 180px">提交验证</el-button>
        </el-col>
        <!-- <el-form-item prop="checkCount">
          <el-input-number v-model="checkCount" placeholder="数量" clearable style="width: 130px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="addCheckCode()" style="width: 180px">提交验证</el-button>
        </el-form-item>
        <el-form-item style="margin-left: 50%">
          <el-button type="primary" :icon="FolderChecked" @click="submitCheckItem()">保存该库位盘点信息</el-button>
        </el-form-item> -->
      </el-row>
      <el-table :data="tableData" style="width: 100%; margin-bottom: 20px" row-key="id" >

        <template v-for="column in columns" :key="column.dataIndex">
          <el-table-column v-if="column.dataIndex === 'realResult'" :prop="column.dataIndex" :label="column.title" align="center">
            <template #default="{ row }">
              {{ row.checkTotality - row.realTotality }}
            </template>
          </el-table-column>
          <el-table-column v-else-if="column.dataIndex === 'checkTotality'" :prop="column.dataIndex" :label="column.title" align="center">
            <template #default="{ row }">
              <el-input-number v-if="row.materialManage===1" :min="0" :max="1" v-model="row.checkTotality" />
              <el-input-number v-else :min="0"  v-model="row.checkTotality" />
            </template>
          </el-table-column>
          <el-table-column v-else :prop="column.dataIndex" :label="column.title" align="center" />
        </template>
      </el-table>
    </ContentWrap>
    <template #footer>
      <el-button @click="submitCheckItem" type="success" :disabled="submitItemLoading">提交盘点</el-button>
      <el-button @click="saveCheckItem" type="primary" :disabled="saveLoading">保 存</el-button>
      <el-button @click="detailVisible = false">取 消</el-button>
    </template>
  </Dialog>

  <!-- 盘点库位详情展示 -->
  <Dialog v-model="lookVisible" width="80%" :title="detailTitle">
    <ContentWrap>

      <el-row :gutter="10">
        <el-col :span="8">
          <el-button style="width: 360px;font-weight: bold;">当前库位容器: {{ checkDetailNode.checkContainer.barCode }}</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableData" style="width: 100%; margin-bottom: 20px" row-key="id" >

        <template v-for="column in columns" :key="column.dataIndex">
          <el-table-column v-if="column.dataIndex === 'realResult'" :prop="column.dataIndex" :label="column.title" align="center">
            <template #default="{ row }">
              {{ row.checkTotality - row.realTotality }}
            </template>
          </el-table-column>
          <el-table-column v-else-if="column.dataIndex === 'checkTotality'" :prop="column.dataIndex" :label="column.title" align="center">
            <template #default="{ row }">
              <span> {{ row.checkTotality }} </span>
            </template>
          </el-table-column>
          <el-table-column v-else :prop="column.dataIndex" :label="column.title" align="center" />
        </template>
      </el-table>
    </ContentWrap>
    <template #footer>
      <el-button @click="lookVisible = false">关  闭</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { CheckTaskApi } from '@/api/wms/checktask'
import { Search } from '@element-plus/icons-vue'
import { ElButton, ElNotification } from 'element-plus'

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题

const LocationDetailList = ref<any>([])
const tableData = ref<any[]>([])
const checkDetailNode = ref<any>(null)
const detailVisible = ref(false)
const lookVisible = ref(false)
const detailTitle = ref('')
// const currentSubmitState = ref(1)
const submitItemLoading = ref(false)
const saveLoading = ref(false)
const checkPlanId = ref('')
const currentNode = ref('')
const currentContainer = ref('')

// 0 - 初始状态， 1 待盘点 2 已盘点 3 提交
const checkBarCode = ref('')
const checkStorageCode = ref('')

/** 打开弹窗 */
const open = async (row?: any) => {
  dialogVisible.value = true
  dialogTitle.value = '盘点库位信息'
  // currentSubmitState.value = 0
  currentNode.value = row
  getWarehouseLocationDetail(row.id);
}

// 这在处理子组件时特别有用，允许父组件访问子组件的特定属性或方法
defineExpose({ open }) // 提供 open 方法，用于打开弹窗



// 查询库位信息
const getWarehouseLocationDetail = async (id : string) => {
  checkPlanId.value = id
  const data = await CheckTaskApi.getWarehouseLocationDetail(id)
  LocationDetailList.value = data
}

// 没有盘点容器就不做盘点 不管是因为 空位还是 因为没有盘点计划
const getBindValue = (s: any) => {
  if(s===null || s===undefined) return ''
  if(s.checkContainer===null)  {
    // return {
    //     data: '空位',
    //     style: 'default',
    //   }
    return {
        data: '不盘点',
        style: 'no-check'
      }
  }
  switch (s.checkContainer.checkStatus) {
    case 1:
      return {
        data: '待盘点',
        style: 'wait',
        checkCount: s.checkContainer.totalCount > 0?s.checkContainer.totalCount:0
     }
    case 2:
      return {
        data: '已盘点',
        style: 'checking',
        checkCount: s.checkContainer.totalCount
      }
    case 3:
      return {
        data: '已提交',
        style: 'finish',
        checkCount: s.checkContainer.totalCount
      }
    default:
      return {
        data: '不盘点',
        style: 'no-check'
      }

  }
}

const checkDetail = async (s: any) => {
  if(s===null || s===undefined || s.checkContainer===null) {
    ElNotification({
          title: '警告',
          message: `该库位 ${s.locationName} 为空位，无需盘点`,
          type: 'warning'
        })
        return
  }
  checkDetailNode.value = s
  const data = await CheckTaskApi.startCheckTask(s.checkContainer)
  currentContainer.value = data
  // 待盘点 || 已盘点
  if(s.checkContainer.checkStatus === 1 || s.checkContainer.checkStatus === 2){
    detailVisible.value = true
    detailTitle.value = '盘点库位:'+ s.locationCode
    tableData.value = data.checkDetailList

  }else if(s.checkContainer.checkStatus === 3){
    // 已提交
    lookVisible.value = true
    detailTitle.value = '盘点库位:'+ s.locationCode
    tableData.value = data.checkDetailList
  }
  
}

const columns = [
  { title: '物料编码', dataIndex: 'materialNumber', align: 'center' },
  { title: '物料条码', dataIndex: 'barCode', align: 'center' },
  { title: '批次号', dataIndex: 'batchNumber', align: 'center' },
  { title: '账面数量', dataIndex: 'realTotality',align: 'center'},
  { title: '实际数量', dataIndex: 'checkTotality', align: 'center' },
  { title: '盈亏数量', align: 'center', dataIndex: 'realResult' }
]


const saveCheckItem = async () => {
  saveLoading.value = true
  try {
    const res = await CheckTaskApi.saveCheckPlanItem(tableData.value)
    if (res) {
      ElNotification({
        title: '信息',
        message: `该: ${checkDetailNode.value.locationCode} ,货位盘点信息保存成功`,
        type: 'success'
      })
    }else{
      ElNotification({
        title: '错误',
        message: `该: ${checkDetailNode.value.locationCode} ,货位盘点信息保存失败`,
        type: 'error'
      })
    }
  } catch (error) {
    console.log(error)
  }finally {
    getWarehouseLocationDetail(checkPlanId.value)
    detailVisible.value = false
    saveLoading.value = false
  }
}


const enterCheckCode = (e: any) => {
  if(e === undefined || (e.key === 'Enter' && e.target.value.trim() !== '')){
    const barCode = checkBarCode.value.trim();
    const storageCode = checkStorageCode.value.trim();
    if(e === undefined && storageCode === ''){
      ElNotification({
        title: '警告',
        message: `多储位容器需要输入储位码`,
        type: 'warning'
      })
      return;
    }
    if(storageCode !== ''){
      const storage = currentContainer.value.containerStoragelist.find((item) => item.storageCode === storageCode);
      if(storage === undefined){
        ElNotification({
          title: '错误',
          message: `此储位码不存在，请扫描正确的储位码！`,
          type: 'error'
        })
        return;
      }
    }
    const item = tableData.value.find((item) => item.barCode === barCode);
    if(item === undefined){
      CheckTaskApi.getMaterialStock(barCode)
      .then(res => {
         if(res !== null){
          ElMessageBox.confirm('此物料盘点位置与记录不符合，是否继续？', '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
              let storageCode  = checkStorageCode.value.trim()
              if(currentContainer.value.containerStoragelist.length === 1){
                storageCode = currentContainer.value.containerStoragelist[0].storageCode
              }
              console.log("222",res.materialManage)
              tableData.value.push({
                materialStockId: res.id,
                realTotality: res.totality,
                checkTotality: res.totality,
                checkContainerId:checkDetailNode.value.checkContainer.id,
                materialManage: res.materialManage,
                materialNumber: res.materialNumber,
                barCode: res.barCode,
                batchNumber: res.batchNumber,
                checkType: 2,
                storageCode: storageCode,
              })
              ElNotification({
                title: '信息',
                message: `物料： ${item.barCode} 盘点成功，盘点数量为：${item.realTotality}`,
                type: 'success'
              })
            })
         }else{
            ElNotification({
              title: '错误',
              message: `未找到该物料条码: ${barCode}`,
              type: 'error'
            })
         }
        })
        .catch(err => {
           console.log(err)
         })
    }else{
      item.checkTotality = item.realTotality
      ElNotification({
        title: '信息',
        message: `物料： ${item.barCode} 盘点成功，盘点数量为：${item.realTotality}`,
        type: 'success'
      })
    }
    
  }
}

const submitCheckItem = async () => {
  submitItemLoading.value = true
  try {
    const res = await CheckTaskApi.submitCheckPlanItem(tableData.value)
    if (res) {
      ElNotification({
        title: '信息',
        message: `该库位盘点任务提交成功`,
        type:'success'
      })
    }else{
      ElNotification({
        title: '错误',
        message: `该库位盘点任务提交失败`,
        type: 'error'
      })
    }
  } catch (error) {
    console.log(error)
  }finally {
    getWarehouseLocationDetail(checkPlanId.value)
    detailVisible.value = false
    submitItemLoading.value = false
  }
}

// 注入无感刷新页面函数
const reload = inject<() => void>('reload')
const submitCheck = async () => {
  try {
    const res = await CheckTaskApi.submitCheckPlan(checkPlanId.value)
    if (res) {
      ElNotification({
        title: '信息',
        message: `该库位盘点任务提交成功`,
        type:'success'
      })
    }else{
      ElNotification({
        title: '错误',
        message: `该库位盘点任务提交失败`,
        type: 'error'
      })
    }
  } catch (error) {
    console.log(error)
  }finally {
    if (reload) reload()
  }
}


</script>
<style scoped lang="scss">
.l-box {
  background: #e6e8eb;
  margin: 10px 0;
  padding: 10px 0;
  text-align: center;
  cursor: pointer;

  .item {

    .default {
      font-size: 16px;
      font-weight: bold;
      margin-top: 10px;
    }
    .wait {
      font-size: 16px;
      font-weight: bold;
      margin-top: 10px;
      background-color: rgb(223, 180, 106);
    }
    .checking {
      font-size: 16px;
      font-weight: bold;
      margin-top: 10px;
      background-color: rgb(184, 204, 164)
    }
    .finish {
      font-size: 16px;
      font-weight: bold;
      margin-top: 10px;
      background-color: rgb(120, 207, 120);
    }
    .no-check {
      font-size: 16px;
      font-weight: bold;
      margin-top: 10px;
      background-color: #8d8f92;
    }
  }
  .statistic-title {
    font-size: 16px;
    font-weight: bold;
    margin-top: 10px;
  }
}
</style>
