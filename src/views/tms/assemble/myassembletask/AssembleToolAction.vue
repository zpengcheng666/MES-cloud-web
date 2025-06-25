<template>
 <el-Dialog v-model="dialogVisible" fullscreen title="刀具装配" >
    <el-row :gutter="20">
      <el-col :span="12">

        <!-- 左侧上 -->
        <el-descriptions direction="vertical" border :column="4" title="成品刀具参数信息">
          <el-descriptions-item label="刀组编码">{{toolInfoData == undefined ? '无':toolInfoData.materialNumber}}</el-descriptions-item>
          <el-descriptions-item label="刀具名称">{{toolInfoData == undefined ? '无':toolInfoData.toolName}}</el-descriptions-item>
          <el-descriptions-item label="需求加工时长">{{toolInfoData == undefined ? '无':toolInfoData.minimumTime}}</el-descriptions-item>
          <el-descriptions-item label="配送截止时间"  >{{toolInfoData == undefined ? '无':formatDate(toolInfoData.distributionDeadline,'YYYY-MM-DD')}}</el-descriptions-item>
          <el-descriptions-item label="总长上限(mm)">{{toolInfoData == undefined ? '无':toolInfoData.lengthUpper}}</el-descriptions-item>
          <el-descriptions-item label="总长下限(mm)">{{toolInfoData == undefined ? '无':toolInfoData.lengthFloor}}</el-descriptions-item>
          <el-descriptions-item label="玄长上限(mm)">{{toolInfoData == undefined ? '无':toolInfoData.hangingLengthUpper}}</el-descriptions-item>
          <el-descriptions-item label="玄长下限(mm)">{{toolInfoData == undefined ? '无':toolInfoData.hangingLengthFloor}}</el-descriptions-item>
          <el-descriptions-item label="刃径上偏差(mm)">{{toolInfoData == undefined ? '无':toolInfoData.bladeUpperDeviation}}</el-descriptions-item>
          <el-descriptions-item label="刃径下偏差(mm)">{{toolInfoData == undefined ? '无':toolInfoData.bladeFloorDeviation}}</el-descriptions-item>
          <el-descriptions-item label="底R上偏差(mm)">{{toolInfoData == undefined ? '无':toolInfoData.rUpperDeviation}}</el-descriptions-item>
          <el-descriptions-item label="底R下偏差(mm)">{{toolInfoData == undefined ? '无':toolInfoData.rFloorDeviation}}</el-descriptions-item>
        </el-descriptions>

        <!-- 左侧下 -->
        <el-card :bodyStyle="{ padding: 0 }" shadow="never" class="mt-30px">
          <template #header>
            <strong>{{
             '刀具装配指导'
            }}</strong>
            <div style="text-align: right">
              <el-button size="small" @click="openToolVisible(index)">对刀</el-button>
              <el-button  size="small"
                @click="openDynamicVisible(index)">动平衡</el-button>
              <!-- <el-button size="small" @click="openToolVisible(index)">对刀</el-button> -->
              <!-- <el-button size="small" @click="openDynamicVisible(index)">动平衡</el-button> -->
            </div>
          </template>
          <el-table class="mt-10px mb-10px"  row-key="key" border  default-expand-all
                    :data="toolGroupData"
                    v-loading="toolGroupLoading"
                    :stripe="true"
                    :show-overflow-tooltip="true"
                    highlight-current-row
                    @row-click="toolGroupSelection"
                    >
            <el-table-column width="300" label="配刀编号" align="center" prop="materialNumber" />
            <el-table-column label="配刀类码" align="center" prop="materialCode" />
            <el-table-column label="配刀名称" align="center" prop="materialName" />
            <el-table-column label="配刀刀位" align="center" prop="site" />
            <el-table-column label="配刀数量" align="center" prop="count" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-alert title="请先扫描刀柄码后，再进行其他部件的绑定。" type="info" show-icon />
        <el-input class="mt-10px" v-model="scanCode" placeholder="请扫码装配刀具"  >
          <template #prefix>
            <i class="icon-prefix" ></i>
          </template>
        
        </el-input>
        <!-- 右侧上 -->
        <el-card :bodyStyle="{ padding: 0 }" shadow="never" class="mt-10px">
          <template #header>
            <strong>{{
             '已选刀具装配列表'
            }}</strong>
          </template>
          <el-tabs class="mt-5px" type="card" :model-value="tooTab">
            <el-tab-pane label="刀柄" name="toolHandle">
              <el-table :data="toolHandleData"  row-key="key" border  default-expand-all>
                <el-table-column label="配刀条码" align="center" prop="appendageBarCode" />
                <el-table-column label="配刀编号" align="center" prop="appendageMaterialNumber" />
                <el-table-column label="配刀类码" align="center" prop="appendageMaterialCode" />
                <el-table-column label="配刀名称" align="center" prop="appendageMaterialName" />
                <el-table-column fixed="right"   label="操作" width="80" align="center">
                  <template #default="scope">
                    <el-button
                            link
                            type="primary"
                            @click="removeAssemble(scope.row)"
                    >
                      移除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="刀具" name="toolHead">
              <el-table :data="toolHeadData"  row-key="key" border  default-expand-all>
                <el-table-column label="配刀条码" align="center" prop="appendageBarCode" />
                <el-table-column label="配刀编号" align="center" prop="appendageMaterialNumber" />
                <el-table-column label="配刀类码" align="center" prop="appendageMaterialCode" />
                <el-table-column label="配刀名称" align="center" prop="appendageMaterialName" />
                <el-table-column label="配刀刀位" align="center" prop="site" >
                  <template #default="scope">
                    <el-input v-model="scope.row.site" @input="handleInput(scope.row)"/>
                  </template>
                </el-table-column>

                <el-table-column fixed="right"   label="操作" width="80" align="center">
                  <template #default="scope">
                    <el-button
                            link
                            type="primary"
                            @click="removeAssemble(scope.row)"
                    >
                      移除
                    </el-button>
                  </template>
                </el-table-column>

              </el-table>
            </el-tab-pane>
            <el-tab-pane label="配件" name="toolAccessory">
              <el-table :data="toolAccessoryData"  row-key="key" border  default-expand-all>
                <el-table-column label="配刀条码" align="center" prop="appendageBarCode" />
                <el-table-column label="配刀编号" align="center" prop="appendageMaterialNumber" />
                <el-table-column label="配刀类码" align="center" prop="appendageMaterialCode" />
                <el-table-column label="配刀名称" align="center" prop="appendageMaterialName" />
                <el-table-column label="配刀数量" align="center" prop="count" >
                  <template #default="scope">
                    <el-input v-model="scope.row.count" />
                  </template>
                </el-table-column>

                <el-table-column fixed="right"   label="操作" width="80" align="center">
                  <template #default="scope">
                    <el-button
                            link
                            type="primary"
                            @click="removeAssemble(scope.row)"
                    >
                      移除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-card>
        <!-- 右侧下 -->
        <el-card :bodyStyle="{ padding: 0 }" shadow="never" class="mt-30px">
          <template #header>
            <strong>{{
             '刀具库存详情'
            }}</strong>
          </template>
          <el-table class="mt-10px mb-10px"  row-key="key" border  default-expand-all
                    :data="toolStockList"  
                    ref="toolStockTableRef"
                    v-loading="toolStockLoading"
                    :stripe="true"
                    :show-overflow-tooltip="true"
                    highlight-current-row
                    @select="handleSelectionChange"
                    @row-click="handleSelectionChange"
            >
            <el-table-column width="40" label="选择" type="selection" />
            <el-table-column width="200" label="刀具条码" align="center" prop="barCode" />
            <el-table-column width="100" label="库存数量" align="center" prop="totality" />
            <el-table-column width="200" label="所在托盘" align="center" prop="storageCode" />
            <el-table-column width="200" label="所在库位" align="center" prop="rootLocationCode" />
            <el-table-column fixed="right"   label="操作" width="80" align="center">
              <template #default="scope">
                <el-button
                  link
                  type="primary"
                  @click="handleAssemble(scope.row.id)"
                  v-hasPermi="['tms:assemble-task:update']"
                >
                  下架
                </el-button>
              </template>
            </el-table-column>
          </el-table>
           <!-- 分页 -->
          <Pagination
            small 
            :total="toolStockTotal"
            v-model:page="toolStockQueryParams.pageNo"
            v-model:limit="toolStockQueryParams.pageSize"
            layout="total ,prev, pager, next"
            @pagination="getToolStockList"
          />
        </el-card>
      </el-col>
    </el-row>

    <template #footer>
      <el-button @click="openLocationDialog(2)" type="success" :disabled="formLoading">提交</el-button>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">保存</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </el-Dialog>
  <ToolBalanceForm ref="dynamicFormRef" />
  <ToolBaseForm ref="toolFormRef" />
  <SelectLocationDialog ref="selectLocationDialog" @selectPositionNode="selectPositionNode" />
</template>
<script setup lang="ts">
import { GroupApi } from '@/api/tms/group'
import { ToolInfoApi,ToolInfoVO } from '@/api/tms/toolinfo'
import { MaterialStockApi } from '@/api/wms/materialstock'
import ToolBaseForm from '../toolinfo/components/ToolBaseForm.vue'
import ToolBalanceForm from '../toolinfo/components/ToolBalanceForm.vue'
import { formatDate } from '@/utils/formatTime'
import SelectLocationDialog from "@/views/wms/dialog/SelectLocationDialog.vue";
import { provide } from "vue";
// ============================== 全局  =============================
const dialogVisible = ref(false)
const formLoading = ref(false)
const message = useMessage() // 消息弹窗
const toolId = ref()
const open = (id:string) => {
  dialogVisible.value = true
    toolId.value = id;
    //获取成品刀参数
    getToolInfo(id)
  getToolGroupList()//获取装配指导
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗


const saveAssembleRecordData = reactive({
    id: undefined ,// ID
    materialStockId: undefined, // 物料id
    materialConfigId: undefined, // 物料类型id（冗余）
    status: undefined, // 状态(1，可用，2不可用)
    assembleTaskId: undefined ,// 刀具装配任务id
    toolHandleList:[],
    toolHeadList:[],
    toolAccessoryList:[],
})


provide('treeType',2)

const saveType= ref(1)

// 打开储位选择弹框
const selectLocationDialog = ref()
const openLocationDialog = (type) => {
    saveType.value = type
    selectLocationDialog.value.open()
}



const selectPositionNode = (node: any) => {
    const { id, type } = node
    saveForm(id,saveType.value)
}



const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
// 提交
const submitForm = async () => {

    formLoading.value = true
    try {
        saveAssembleRecordData.saveType =1
        saveAssembleRecordData.type =1
        saveAssembleRecordData.id = toolId.value;
        saveAssembleRecordData.toolAccessoryList = toolAccessoryData.value
        saveAssembleRecordData.toolHeadList = toolHeadData.value
        saveAssembleRecordData.toolHandleList = toolHandleData.value
        await ToolInfoApi.saveAssembleRecord(saveAssembleRecordData)
        message.success('装配成功')

        dialogVisible.value = false
        // 发送操作成功的事件
        emit('success')
    } finally {
        formLoading.value = false
    }


}


const saveForm = async (locationId:string,saveType:integer) => {


    debugger
    if (toolHandleData.value.length == 0){
        message.error('请选择刀柄')
        return;
    }
    formLoading.value = true
    try {
        saveAssembleRecordData.saveType =saveType
        saveAssembleRecordData.type =1
        saveAssembleRecordData.locationId =locationId
        saveAssembleRecordData.id = toolId.value;
        saveAssembleRecordData.toolAccessoryList = toolAccessoryData.value
        saveAssembleRecordData.toolHeadList = toolHeadData.value
        saveAssembleRecordData.toolHandleList = toolHandleData.value
        await ToolInfoApi.saveAssembleRecord(saveAssembleRecordData)
        message.success('保存成功')

        dialogVisible.value = false
        // 发送操作成功的事件
        emit('success')
    } finally {
        formLoading.value = false
    }


}

// ==============================左侧上  =============================

const toolInfoData = ref<ToolInfoVO>()
//刀具参数
const getToolInfo = async(id:string)=>{
    const data  = await ToolInfoApi.getToolInfo(id)
    toolInfoData.value = data
    toolHandleData.value = data.toolHandleList
    toolHeadData.value = data.toolHeadList
    toolAccessoryData.value = data.toolAccessoryList

}


// ==============================左侧下  =============================
const toolGroupData = ref<any>([])
const toolGroupLoading = ref(false)
const tooTab = ref('toolHandle')
// 刀具装配指导
const getToolGroupList = async () => {
  toolGroupLoading.value = true
  try {
    // queryParams.materialNumber = materialNumber
    toolGroupData.value = await GroupApi.getGroupList({});
  } finally {
    toolGroupLoading.value = false
  }
}



// 选中行
const toolGroupSelection = (row: any) => {
  // alert(row.materialNumber + row.materialCode)
  getToolStockList(row.materialNumber)
  if(row.materialCode === 'PJ'){
    tooTab.value = 'toolAccessory'  //配件
  }else if(row.materialCode  === 'DT' || row.materialCode  === 'DP'){
    tooTab.value = 'toolHead'  //刀具
  }else{
    tooTab.value = 'toolHandle'  //刀柄
  }
}


// 对刀

const toolFormRef = ref()
const openToolVisible = (index) => {

    toolFormRef.value.open('create', undefined,undefined)
}

//打开动平衡窗口
const dynamicFormRef = ref()
const openDynamicVisible = (index) => {
    //配刀数据
    dynamicFormRef.value.open('create', undefined,undefined)
}



// ==============================右侧上  =============================
// 已选配刀信息
const toolAssembleData = reactive({
  appendageBarCode: undefined,
  materialStockId: undefined,
  appendageMaterialNumber: undefined,
  appendageMaterialCode: undefined,
  appendageMaterialName: undefined,
  site: undefined,
  count: undefined,
})
const scanCode = ref('')
//刀柄
const toolHandleData = ref<any>([])
//刀具   （刀头-刀片）
const toolHeadData = ref<any>([])
//配件
const toolAccessoryData = ref<any>([])

// ==============================右侧下  =============================
const toolStockList = ref<any>([])
const toolStockLoading = ref(false)
const toolStockTotal = ref(0) // 列表的总页数
const toolStockQueryParams = reactive({
    pageNo: 1,
    pageSize: 10,
    createTime: [],
    materialNumber: undefined,
    materialName: undefined,
    materialTypeId: undefined,
    materialParentTypeId: undefined,
    materialSpecification: undefined,
    materialBrand: undefined,
    materialUnit: undefined,
    materialSourceId: undefined,
    materialTypeCode: undefined,
  })

// 库存数据
const getToolStockList = async (materialNumber: string) => {
  toolStockLoading.value = true
    try {
      toolStockQueryParams.materialNumber = materialNumber
        debugger
      const data = await MaterialStockApi.getMaterialStockByMaterialNumber(toolStockQueryParams);
      toolStockList.value = data.list
      toolStockTotal.value = data.total
    } finally {
      toolStockLoading.value = false
    }
}

 /**
   * 实现单选行
   */
const selectionToolStock = ref('')
const toolStockTableRef = ref() // 表格的 Ref
const handleSelectionChange = (selection) => {
  // 点击复选框
  if(selection instanceof Array){
    // 点击复选框传数组
    if (selection.length > 1) {
      //移除上一次选中行数据
      selection.shift();
    }
    //修改选中图标为未选中状态
    toolStockTableRef.value.clearSelection();
    //将当前选中行改为选中状态
    toolStockTableRef.value.toggleRowSelection(selection[0]);
    selectionToolStock.value = selection[0]
  }
  // 点击行
  else {
    toolStockTableRef.value.clearSelection();
    toolStockTableRef.value.toggleRowSelection(selection);
    selectionToolStock.value = selection
  }
}

//监听配刀刀位变化
const handleInput =async (row) =>{

    const order = toolGroupData.value.find((item) => item.materialNumber === row.appendageMaterialNumber && row.site ===item.site);
    if (order ==undefined){
        message.error('该刀位不存在,请重新输入刀位')
        return;
    }else{
         const  s = toolHeadData.value.filter(item => {return item.materialNumber ===row.appendageMaterialNumber && item. site === row.site})
        if (s.length > 1){
            message.error('刀位重复,请确认')
            return;
        }
    }

}

//点击回车键录入
const keyDown =async (e) => {
    if (e.keyCode == 13 || e.keyCode == 100) {

        const data = await MaterialStockApi.getMaterialStockByMaterialNumber({barCode:scanCode.value})
        const materialStockInfo = data.list
        if (materialStockInfo.length ==0 ){
            message.error('请输入正确条码')
            return;
        }
      const row = materialStockInfo[0];

        const order = toolGroupData.value.find((item) => item.materialNumber === row.materialNumber);
        //判断条码是否归属于装配指导的类型
        if (order == undefined){
            message.error('该物料类型不符合装配指导')
            return;
        }
        //// 已选配刀信息
        const  toolAssembleData1 = reactive({
            appendageBarCode: undefined,
            appendageMaterialNumber: undefined,
            materialStockId: undefined,
            appendageMaterialCode: undefined,
            appendageMaterialName: undefined,
            site: undefined,
            count: undefined,
            id:undefined
        })
        toolAssembleData1.materialStockId=row.id,
        toolAssembleData1.appendageBarCode = row.barCode;
        toolAssembleData1.appendageMaterialNumber = row.materialNumber;
        toolAssembleData1.appendageMaterialCode = row.materialCode;
        toolAssembleData1.appendageMaterialName = row.materialName;
        toolAssembleData1.count = 1
        if(row.materialCode === 'PJ'){
            tooTab.value = 'toolAccessory' //配件
            toolAssembleData1.count = row.totality;
            toolAccessoryData.value.push(toolAssembleData1)
        }else if(row.materialCode  === 'DT' ){
            tooTab.value = 'toolHead' //刀具     刀头只能有一个  刀片可以多个
            toolAssembleData1.site = 1
            toolAssembleData1.count = 1
            if (toolHeadData.value.length > 0){
                message.error('已有一个到头,请确认')
                return;
            }
            toolHeadData.value.push(toolAssembleData1)
        }else if (row.materialCode  === 'DP') {
            tooTab.value = 'toolHead' //刀具    刀片可以多个
            const unUsedData = [];  //未配置的刀位
            for (let i = 0 ; i< toolGroupData.value.length;i++){
                const  s = toolGroupData.value[i];
                const useRow = toolHeadData.value.filter(item=>{
                 return   item.site ===s.site
                })
                if (useRow.length == 0 && toolGroupData.materialNumber ==row.materialNumber ){
                    unUsedData.push(s);
                }
            }
            if (unUsedData.length ==0){
                message.error('该类型刀头数量已达到指定数量,请确认')
                return;
            }
            toolAssembleData1.site = unUsedData[0].site
            toolAssembleData1.count = 1
            toolHeadData.value.push(toolAssembleData1)
        }else{
            tooTab.value = 'toolHandle'  //刀柄      刀柄只能有一个
            toolAssembleData1.site = 1
            toolAssembleData1.count = 1
            if (toolHandleData.value.length > 0){
                message.error('已有一个刀柄,请确认')
                return;
            }
            toolHandleData.value.push(toolAssembleData1)
        }


    }
}



/** 移除按钮操作 */
const removeAssemble = async (row) => {
    if(row.appendageMaterialCode === 'PJ'){//配件
        toolAccessoryData.value= toolAccessoryData.value.filter(item => {return item.appendageBarCode !==row.appendageBarCode && item. count !== row.count})
    }else if(row.appendageMaterialCode  === 'DT' ){//刀头
        toolHeadData.value=[];
    }else if (row.appendageMaterialCode  === 'DP') {//刀片
        toolHeadData.value = toolHeadData.value.filter(item => {return item.appendageBarCode !==row.appendageBarCode && item. site !== row.site})
    }else{//刀柄
        toolHandleData.value=[];
    }
}




onMounted(async () => {
    window.addEventListener('keydown', keyDown)
})

onUnmounted(async() => {
    //销毁事件
    window.removeEventListener('keydown', keyDown, false)
});

</script>
<style lang="scss" scoped>
.icon-prefix {
  width: 1.5em;
  height: 1.5em;
  background-image: url('@/assets/svgs/tool.svg');
  background-size: cover;
}
</style>
