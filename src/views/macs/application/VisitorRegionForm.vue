<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    v-loading="formLoading"
    label-width="72px"
    :inline-message="true"
  >
    <div style="height: 10px"></div>

    <el-table stripe :show-header="false" :data="formData" class="-mt-10px">
      <el-table-column label="序号" type="index" width="100" />

      <el-table-column label="真实姓名" min-width="230">
        <template #default="{ row, $index }">
          <el-form-item label="真实姓名" :prop="`${$index}.visitor.name`" :rules="formRules.visitor?.name" class="mb-0px!">
            <el-select filterable clearable :filterMethod="(qurey) => visitorSelect(qurey, $index, 'name')" v-model="row.visitor.name" placeholder="请输入真实姓名">
              <el-option
                v-for="item in paramsSelectList[$index]?.name"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <div style="height: 10px"></div>
          <el-form-item label="部门" :prop="`${$index}.visitor.department`" :rules="formRules.visitor?.department" class="mb-0px!">
            <el-select filterable clearable :filterMethod="(qurey) => visitorSelect(qurey, $index, 'department')" v-model="row.visitor.department" placeholder="请输入部门">
              <el-option
                v-for="item in paramsSelectList[$index]?.department"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="身份证号" min-width="230">
        <template #default="{ row, $index }">
          <el-form-item label="身份证号" :prop="`${$index}.visitor.idCard`" :rules="formRules.visitor?.idCard" class="mb-0px!">
            <el-select filterable clearable  @change="(value)=>visitorSelectOne(value,$index)" :filterMethod="(qurey) => visitorSelect(qurey, $index, 'idCard')" v-model="row.visitor.idCard" placeholder="请输入身份证号">
              <el-option
                v-for="item in visitorSelectList[$index]"
                :key="item.id"
                :label="item.idCard"
                :value="item.idCard"
              >{{ item.idCard }}</el-option>
            </el-select>
          </el-form-item>
          <div style="height: 10px"></div>
          <el-form-item label="区域" :prop="`${$index}.regionIds`" :rules="formRules.regionIds" class="mb-0px!">
            <el-tree-select
              v-model="row.regionIds"
              :data="regionList"
              :props="{...defaultProps, label: 'name'}"
              multiple
              check-strictly
              placeholder="请输入区域id" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="电话" min-width="230">
        <template #default="{ row, $index }">
          <el-form-item label="电话" :prop="`${$index}.visitor.phone`" :rules="formRules.visitor?.phone" class="mb-0px!">
            <el-select filterable clearable :filterMethod="(qurey) => visitorSelect(qurey, $index, 'phone')" v-model="row.visitor.phone" placeholder="请输入电话">
              <el-option
                v-for="item in paramsSelectList[$index]?.phone"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <div style="height: 10px"></div>
          <el-form-item label="生效日期" :prop="`${$index}.effectiveDate`" :rules="formRules.effectiveDate" class="mb-0px!">
            <el-date-picker
              v-model="row.effectiveDate"
              type="date"
              value-format="x"
              placeholder="选择生效日期"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="公司/组织" min-width="230">
        <template #default="{ row, $index }">
          <el-form-item label="公司组织" :prop="`${$index}.visitor.organization`" :rules="formRules.visitor?.organization" class="mb-0px!">
            <el-select filterable clearable :filterMethod="(qurey) => visitorSelect(qurey, $index, 'organization')" v-model="row.visitor.organization" placeholder="请输入公司/组织">
              <el-option
                v-for="item in paramsSelectList[$index]?.organization"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <div style="height: 10px"></div>
          <el-form-item label="失效日期" :prop="`${$index}.invalidDate`" :rules="formRules.invalidDate" class="mb-0px!">
            <el-date-picker
              v-model="row.invalidDate"
              type="date"
              value-format="x"
              placeholder="选择失效日期"
            />
          </el-form-item>
        </template>
      </el-table-column>

      <el-table-column align="center" fixed="right" label="操作" width="60">
        <template #default="{ $index }">
          <el-button @click="handleDelete($index)" link>—</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
  <el-row justify="center" class="mt-3">
    <el-button @click="handleAdd" round>+ 添加访客区域权限</el-button>
  </el-row>
</template>
<script setup lang="ts">
import { ApplicationApi } from '@/api/macs/application'
import {defaultProps, handleTree} from '@/utils/tree'

const formLoading = ref(false)
const formData = ref([])
const visitorSelectList = ref<any>([])
const paramsSelectList = ref<any>([])
const visitorList:any = ref([]);
const formRules = reactive({
  visitor: {
    name:[{ required: true, message: '姓名不能为空', trigger: 'blur' }],
    idCard:[{ required: true, message: '身份证号码不能为空', trigger: 'blur' }],
    phone:[{ required: true, message: '电话不能为空', trigger: 'blur' }],
    organization:[{ required: true, message: '公司不能为空', trigger: 'blur' }],
    department:[{ required: true, message: '部门不能为空', trigger: 'blur' }],
  },
  regionIds:[{ required: true, message: '区域权限不能为空', trigger: 'blur' }],
  effectiveDate:[{ required: true, message: '生效日期不能为空', trigger: 'blur' }],
  invalidDate:[{ required: true, message: '失效日期不能为空', trigger: 'blur' }],
})
const formRef = ref() // 表单 Ref


/** 新增按钮操作 */
const handleAdd = () => {
  const row = {
    visitor: {
      name: undefined,
      idCard: undefined,
      avatar: undefined,
      sex: undefined,
      phone: undefined,
      organization: undefined,
      department: undefined,
    },
    regionIds: [],
    regionName: undefined,
    applicationId: undefined,
    effectiveDate: undefined,
    invalidDate: undefined
  }
  formData.value.push(row);
  visitorSelectList.value.push(visitorList.value)
}

const regionList = ref([visitorList])
const getRegionTree = async () => {
  const data = await ApplicationApi.getRegionList({});
  regionList.value = handleTree(data, 'id', 'parentId')
}
getRegionTree();

const getVisitorList = async () => {
  visitorList.value = await ApplicationApi.getVisitorList();
}
getVisitorList();

const visitorSelectOne = (value, index) => {
  if (value) {
    let visitor = visitorList.value.find(item => item.idCard.includes(value));
    formData.value[index].visitor.id = visitor.id
  }
}

const visitorSelect = (query,index,label) => {
  if (query) {
    query = query.toLowerCase()
    visitorSelectList.value[index] = visitorList.value.filter(item => item[label]&&item[label].toLowerCase().includes(query));
  } else {
    visitorSelectList.value[index] = visitorList.value;
  }
  visitorSelectList.value[index] = paramsFilter(visitorSelectList.value[index],label,formData.value[index].visitor);
  if (label != 'idCard') {
    paramsSelectList.value[index] = {};
    paramsSelectList.value[index][label] = deduplication(visitorSelectList.value[index],label);
  }
  if (visitorSelectList.value[index].length == 0 && query)
    formData.value[index].visitor[label] = query;
}

const paramsFilter = (array:[], label:string, param:{}) => {
  let res = [];
  for (let visitor of array) {
    let flag = true;
    for (let paramKey in param) {
      if (paramKey == label) continue;
      if (!param[paramKey] || param[paramKey] == visitor[paramKey]) continue;
      flag = false;
    }
    if (flag) res.push(visitor);
  }
  return res;
}

const deduplication = (array:[], label:string) => {
  let res = [];
  for (let visitor of array) {
    if (!visitor[label]) continue;
    if (!res.includes(visitor[label]))
      res.push(visitor[label]);
  }
  return res;
}

/** 删除按钮操作 */
const handleDelete = (index) => {
  formData.value.splice(index, 1)
}

/** 表单校验 */
const validate = () => {
  return formRef.value.validate()
}

/** 表单值 */
const getData = () => {
  return formData.value
}

defineExpose({ validate, getData })
</script>
