<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="600px" :data="attrsDataList">
    <ContentWrap>
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px"
               v-loading="formLoading">
        <el-form-item label="属性中文名称" prop="attrNameCn">
          <el-input v-model="formData.attrNameCn"/>
        </el-form-item>
        <el-form-item label="属性英文名称" prop="attrNameEn">
          <el-input v-model="formData.attrNameEn"/>
        </el-form-item>
        <el-form-item label="属性类型" prop="attrType">
          <el-select v-model="formData.attrType" clearable placeholder="请选择属性类型">
            <el-option v-for="dict in getIntDictOptions(DICT_TYPE.PDM_CATEGORY_TYPE) "
                       :key="dict.value"
                       :label="dict.label" :value="dict.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="attrOrder">
          <el-input-number v-model="formData.attrOrder" :min="1" placeholder="请输入排序序号"
                           class="!w-200px"/>
        </el-form-item>
        <el-form-item label="单位" prop="attrUnit">
          <el-input v-model="formData.attrUnit"/>
        </el-form-item>
        <el-form-item label="默认值" prop="attrDefaultValue">
          <el-input v-model="formData.attrDefaultValue"/>
        </el-form-item>
        <el-form-item label="是否多值" prop="isMultvalues">
          <el-radio-group v-model="formData.isMultvalues">
            <el-radio v-for="dict in getIntDictOptions(DICT_TYPE.PDM_IS_MULTVALUES) "
                      :key="dict.value" :label="dict.value">
              {{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="有效值" prop="attrEffectiveValue">
          <el-input type="textarea" :rows="4" v-model="formData.attrEffectiveValue" />
        </el-form-item>
      </el-form>
    </ContentWrap>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { CustomizedAttributeAPI, CustomizedAttributeVO } from "@/api/pdm/customizedAttribute";
import { DICT_TYPE, getIntDictOptions } from "@/utils/dict";
import { ref, reactive, defineEmits, defineExpose } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n(); // 国际化
const dialogVisible = ref(false); // 弹窗的是否展示
const dialogTitle = ref(""); // 弹窗的标题
const formRef = ref(); // 表单 Ref
const formType = ref(""); // 表单的类型：create - 新增；update - 修改
const formLoading = ref(false); // 表单的加载中
const attrsDataList = ref([]); // 属性信息
const formData = ref({
  id: undefined,
  categoryId: undefined,
  attrNameCn: undefined,
  attrNameEn: undefined,
  attrType: undefined,
  attrUnit: undefined,
  attrOrder: undefined,
  attrDefaultValue: undefined,
  isMultvalues: 0,
  attrEffectiveValue: undefined,
});
const rules = reactive({
  attrNameCn: [{ required: true, message: "请填写中文名称", trigger: "change" }],
  attrNameEn: [{ required: true, message: "请填写英文名称", trigger: "change" }],
  attrType: [{ required: true, message: "请选择属性类型", trigger: "change" }],
  attrOrder: [{ required: true, message: "排序", trigger: "blur" }],
});

const emit = defineEmits(["success"]); // 定义 success 事件，用于操作成功后的回调

const idattr = ref("");

const open = async (id?: number) => {
  dialogVisible.value = true;
  formData.value.categoryId = id;
  dialogTitle.value = "新增信息";
};

const submitForm = async () => {

  formLoading.value = true;
  try {
    const valid = await formRef.value.validate();
    if (!valid) {
      formLoading.value = false;
      return;
    }
    const data = formData.value as unknown as CustomizedAttributeAPI.CustomizedAttributeVO;
    await CustomizedAttributeAPI.createCustomizedAttribute(data);
    dialogVisible.value = false;
    emit("success");
  } finally {
    formLoading.value = false;
  }
};

const resetForm = () => {
  formData.value = {
    id: undefined,
    categoryId: undefined,
    attrNameCn: undefined,
    attrNameEn: undefined,
    attrType: undefined,
    attrUnit: undefined,
    attrOrder: undefined,
    attrDefaultValue: undefined,
    isMultvalues: 0,
    attrEffectiveValue: undefined,
  };
};

defineExpose({ open }); // 提供 open 方法，用于打开弹窗
</script>
