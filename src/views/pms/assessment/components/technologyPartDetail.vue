<template>
  <Dialog title="零件信息" v-model="dialogVisible" width="1000">
    <ContentWrap>
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="单件定额管理" name="1">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="材料牌号">
              {{ singleTimeQuotaData?.materialDesg }}
            </el-descriptions-item>
            <el-descriptions-item label="材料状态">
              {{ singleTimeQuotaData?.materialCondition }}
            </el-descriptions-item>
            <el-descriptions-item label="长度(mm)">
              {{ singleTimeQuotaData?.length }}
            </el-descriptions-item>
            <el-descriptions-item label="宽度(mm)">
              {{ singleTimeQuotaData?.width }}
            </el-descriptions-item>
            <el-descriptions-item label="厚度(mm)">
              {{ singleTimeQuotaData?.height }}
            </el-descriptions-item>
            <el-descriptions-item label="工时定额(min)">
              {{ singleTimeQuotaData?.timeQuota }}
            </el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>
        <el-tab-pane label="零件设计属性" name="2">
          <el-descriptions :column="2" border style="height: 300px;overflow-y: auto">
            <el-descriptions-item v-for="(item, index) in partAttrs" :label="item.attrAlias" :key="index + 1">
              {{ item.attrValue }}
            </el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>
        <el-tab-pane label="文件目录" name="3">
          <el-table :data="tableData" border>
            <el-table-column align="center" label="序号" type="index" width="80px" />
            <el-table-column prop="fileName" label="文件名称" align="center" />
            <el-table-column prop="fileType" label="文件类型" align="center" />
            <el-table-column label="操作" align="center">
            <template #default="scope">
              <el-link
                :underline="false"
                style="font-size: 12px; vertical-align: baseline"
                type="primary"
                @click="downloadFile(scope.row.vaultUrl)
              ">
              下载c
              </el-link>
            </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

    </ContentWrap>
  </Dialog>
</template>
<script setup lang="ts">
  import {FeasibilityDetailApi} from "@/api/pdm/feasibilityDetail";
  import { PartMasterApi } from "@/api/pdm/part/partmaster";
  import { PartAttachmentApi, PartAttachmentVO } from "@/api/pdm/part/partattachment";

  /** 技术评估-零件列表-详情弹窗 */
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const { push } = useRouter() // 路由

const props = defineProps({
  projectCode: {
    type: String ,
    default: () => ''
  },
})
const activeName = ref(['1'])
const dialogVisible = ref(false);
//单件定额管理
const singleTimeQuotaData = ref();
//零件动态属性
const partAttrs = ref([])
// 文件目录列表
const tableData = ref<PartAttachmentVO[]>([])
const productNumber = ref()

const queryParamsResult = reactive({
  projectCode: '',
  partVersionId: '',
  status: '2'
})

const queryParamsAttr = reactive({
  rootProductId: '',
  customizedIndex: '',
  partVersionId: ''
})
  /** 打开弹窗 */
  const open = async (row) => {
    dialogVisible.value = true;
    activeName.value = '1';
    productNumber.value = row.productNumber
    //单件定额管理
    queryParamsResult.projectCode = props.projectCode;
    queryParamsResult.partVersionId = row.partVersionId;
    singleTimeQuotaData.value = await FeasibilityDetailApi.getQuotaPerPartInfo(queryParamsResult)
    //零件动态属性
    queryParamsAttr.rootProductId = row.rootProductId
    queryParamsAttr.customizedIndex = row.customizedIndex
    queryParamsAttr.partVersionId = row.partVersionId
    partAttrs.value = await PartMasterApi.getPartAttrs(queryParamsAttr)
    // 文件目录列表
    tableData.value = await PartAttachmentApi.getdatapackageBomId(row.partVersionId);
    console.log(partAttrs.value)
  }

  /** 下载文件 */
  const downloadFile = async (vaultUrl: string) => {
    window.open(vaultUrl, '_blank');
  }
onMounted(async () => {

})

defineExpose({ open })
</script>
