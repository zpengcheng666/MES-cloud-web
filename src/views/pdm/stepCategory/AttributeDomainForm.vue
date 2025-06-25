<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" v-loading="formLoading" width="1200px" max-height="700px">
    <el-button type="primary" @click="openNewForm()">
      <Icon icon="ep:plus" class="mr-5px" />
      新增属性
    </el-button>
    <ContentWrap>
      <el-table :data="attrsDataList" style="height:400px;overflow-y: auto" :ref="formRef" :show-overflow-tooltip="true" v-if="refreshTable">
        <el-table-column align="center" type="index" label="序号" width="100" prop="LAY_TABLE_INDEX" />
        <el-table-column align="center" label="属性中文名称" prop="attrNameCn" />
        <el-table-column align="center" label="属性英文名称" prop="attrNameEn" />
        <el-table-column align="center" label="类型" prop="attrType" >
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.PDM_CATEGORY_TYPE" :value="scope.row.attrType"/>
          </template>
        </el-table-column>
        <el-table-column align="center" label="排序" prop="attrOrder" />
        <el-table-column align="center" label="单位" prop="attrUnit" />
        <el-table-column align="center" label="默认值" prop="attrDefaultValue" />
        <el-table-column align="center" label="是否多值" prop="isMultvalues" >
          <template #default="scope">
            <dict-tag :type="DICT_TYPE.PDM_IS_MULTVALUES" :value="scope.row.isMultvalues"/>
          </template>
        </el-table-column>
        <el-table-column align="center" label="有效值" prop="attrEffectiveValue" truncated />
        <el-table-column label="操作" width="150" align="center">
          <template #default="scope">
            <el-button type="primary" @click="updateAttr(scope.row.id)" size="small">
              编辑
            </el-button>
            <el-button type="danger" @click="deleteAttr(scope.row.id)" size="small">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </ContentWrap>
  </Dialog>
  <!-- 新增自定义属性界面 -->
  <AttributeDomainAddForm ref="editDomainAddForm" @success="getCustomizedAttributeList" />
  <!-- 编辑自定义属性界面 -->
  <UpdateAttrForm ref="updateAttrForm" @success="getCustomizedAttributeList" />
</template>

<script setup lang="ts">
import { CustomizedAttributeAPI, CustomizedAttributeVO } from '@/api/pdm/customizedAttribute';
import AttributeDomainAddForm from './AttributeDomainAddForm.vue';
import UpdateAttrForm from './UpdateAttrForm.vue';
import { DICT_TYPE } from "@/utils/dict";
import { ref } from "vue";


const message = useMessage(); // 消息弹窗
const { t } = useI18n(); // 国际化

/** 产品数据对象 表单 */
defineOptions({ name: 'AttributeDomainForm' });
const dialogTitle = ref(''); // 弹窗的标题
const attrsDataList = ref([]); // 属性信息
const refreshTable = ref(true); // 重新渲染表格状态
const emit = defineEmits(['success']); // 定义 success 事件，用于操作成功后的回调
const formLoading = ref(false); // 表单的加载中
const dialogVisible = ref(false); // 弹窗的是否展示
const formRef = ref(); // 表单 Ref
const queryParams = reactive({
  id: undefined,
  categoryId: undefined,
  attrNameCn: undefined,
  attrNameEn: undefined,
  attrType: undefined,
  attrUnit: undefined,
  attrOrder: undefined,
  attrDefaultValue: undefined,
  isMultValues: undefined,
  attrEffectiveValue: undefined,
});
const editDomainAddForm = ref();
const updateAttrForm = ref();
const idattr = ref('');

const openNewForm = () => {
  editDomainAddForm.value.open(idattr.value);
};

const updateAttr = (id?: number) => {
  updateAttrForm.value.open(id);
};

const deleteAttr = async (id?: number) => {
  try {
    await message.delConfirm();
    await CustomizedAttributeAPI.deleteCustomizedAttribute(id);
    message.success(t('common.delSuccess'));
    await getCustomizedAttributeList();
  } catch {}
};

const open = async (id?: number) => {
  dialogTitle.value = '自定义属性';
  idattr.value = id;
  attrsDataList.value = await CustomizedAttributeAPI.getCustomizedAttribute(id);
  dialogVisible.value = true;
};

const getCustomizedAttributeList = async () => {
  const data = await CustomizedAttributeAPI.getCustomizedAttribute(idattr.value);
  attrsDataList.value = data;
};

defineExpose({ open }); // 提供 open 方法，用于打开弹窗
</script>

<style>
/* 添加自定义CSS样式 */
.custom-divider .el-divider__text {
  font-size: 20px;
  /* 调整文本大小 */
}
</style>
