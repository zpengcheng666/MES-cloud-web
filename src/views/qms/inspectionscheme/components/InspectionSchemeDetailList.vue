<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :span-method="objectSpanMethod" :border="true">
      <!--<el-table-column label="主键" align="center" prop="id" />-->
      <el-table-column label="检验项目" align="center" prop="itemTypeName">
        <template #default="scope">
          <el-tag type="primary">{{scope.row.itemTypeName}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="检测项" align="center" prop="inspectionItemName"/>

      <el-table-column label="技术要求" align="center" prop="content"/>
      <el-table-column label="上限值" align="center" prop="maxValue"/>
      <el-table-column label="下限值" align="center" prop="minValue"/>

      <el-table-column label="判断方式" align="center" prop="referenceType">

        <template #default="scope">
          <dict-tag :type="DICT_TYPE.QMS_REFERENCE_TYPE" :value="scope.row.referenceType"/>
        </template>
      </el-table-column>
    </el-table>
  </ContentWrap>
</template>
<script setup lang="ts">
  import {dateFormatter} from '@/utils/formatTime'
  import {InspectionSchemeItemApi} from '@/api/qms/inspectionschemeitem'
  import {InspectionSchemeApi} from '@/api/qms/inspectionscheme'
  import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";

  const {t} = useI18n() // 国际化
  const message = useMessage() // 消息弹窗

  const props = defineProps < {
    inspectionSchemeId: undefined // 方案ID（主表的关联字段）
  } > ()
  const loading = ref(false) // 列表的加载中
  const list = ref([]) // 列表的数据
  const total = ref(0) // 列表的总页数
  const queryParams = reactive({
    pageNo: 1,
    pageSize: 10,
    inspectionSchemeItemId: undefined
  })


  /** 查询列表 */
  const getList = async () => {
    loading.value = true
    try {
      list.value = await InspectionSchemeApi.getInspectionSchemeItemListByInspectionSchemeId(props.inspectionSchemeId)
    } finally {
      loading.value = false
    }
  }

  /** 搜索按钮操作 */
  const handleQuery = () => {
    queryParams.pageNo = 1
    getList()
  }


  const objectSpanMethod = ({row, column, rowIndex, columnIndex}) => {
    if (columnIndex === 0) {
      // 当前列为0的时候不进行操作单元格
      const name = row[column.property];
      const preRow = list.value[rowIndex - 1];
      const preValue = preRow ? preRow[column.property] : null;
      // 当前行的数据对象的name 是否和 上一行列的 name 是否相等 相等就不合并单元格
      if (name === preValue) {
        return {rowspan: 0, colspan: 0}; // 不生成单元格
      } else {
        let rowspan = 1;
        for (let i = rowIndex + 1; i < list.value.length; i++) {
          const nextRow = list.value[i];
          const nextValue = nextRow[column.property];
          if (nextValue === name) {
            rowspan++;
          } else {
            break;
          }
        }
        return {rowspan, colspan: 1};
      }
    }
  };


  /** 初始化 **/
  onMounted(() => {
    getList()
  })
</script>
