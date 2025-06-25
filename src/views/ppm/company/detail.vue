<template>
  <el-tabs>
    <el-tab-pane label="申请信息">
      <el-form
        ref="formRef"
        :model="formData"
        label-width="100px"
        v-loading="formLoading"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="formData.name" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="信用代码" prop="usci">
              <el-input v-model="formData.usci" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="组织结构代码" prop="organizationCode">
              <el-input v-model="formData.organizationCode" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司状态" prop="status">
              <el-select v-model="formData.companyStatus" disabled >
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.PD_COMPANY_STATUS)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="公司类型" prop="type">
              <el-select v-model="formData.type" disabled >
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.PD_COMPANY_TYPE)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="行业分类" prop="industryClassification">
              <el-select v-model="formData.industryClassification" disabled >
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.PD_COMPANY_INDUSTRY_CLASSIFICATION)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="成立时间" prop="formed">
              <el-date-picker
                v-model="formData.formed"
                type="date"
                value-format="x"
                class="!w-1/1"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="注册资金" prop="registrationFund">
              <el-input-number
                v-model="formData.registrationFund"
                :precision="0"
                :min="0"
                left
                controls-position="right"
                style="width:100%;"
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="供求类型" prop="supplyType">
              <el-select v-model="formData.supplyType" disabled >
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.PD_COMPANY_SUPPLY_TYPE).filter((item) => item.value != 2)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="纳税人资质" prop="taxpayer">
              <el-select v-model="formData.taxpayer" disabled >
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.PD_COMPANY_TAXPAYER)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="区域" prop="area">
              <el-cascader
                v-model="formData.area"
                :options="areaList"
                :props="defaultProps"
                class="w-1/1"
                clearable
                filterable
                disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="注册地址" prop="registrationAddress">
              <el-input v-model="formData.registrationAddress" type="textarea" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="企业规模" prop="firmSize">
              <el-select v-model="formData.firmSize" disabled >
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.PD_COMPANY_FIRM_SIZE)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话" prop="telephone">
              <el-input v-model="formData.telephone" maxlength="11" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="formData.email" maxlength="50" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司官网" prop="website">
              <el-input v-model="formData.website" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="简介" prop="introduction">
              <el-input v-model="formData.introduction" type="textarea" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts" setup>
import {DICT_TYPE, getIntDictOptions} from "@/utils/dict";
import {useTagsViewStore} from "@/store/modules/tagsView";
import {defaultProps} from "@/utils/tree";
import {CompanyApi} from "@/api/ppm/company";
import * as AreaApi from "@/api/system/area";

defineOptions({ name: 'BpmCompanyDetail' })
const route = useRoute()
const props = defineProps<{ id?: number }>()
const message = useMessage() // 消息弹窗
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const areaList = ref([]) // 地区列表

const formData = ref({
  id: undefined,
  name: undefined,
  usci: undefined,
  organizationCode: undefined,
  companyStatus: undefined,
  type: undefined,
  industryClassification: undefined,
  formed: undefined,
  registrationFund: undefined,
  taxpayer: undefined,
  area: undefined,
  registrationAddress: undefined,
  firmSize: undefined,
  telephone: undefined,
  email: undefined,
  website: undefined,
  introduction: undefined,
  creationIp: undefined,
  updatedIp: undefined,
  status: undefined,
  supplyType: undefined,
})

const formRef = ref() // 表单 Ref

/** 关闭 */
const { delView } = useTagsViewStore() // 视图操作
const { currentRoute } = useRouter() // 路由
const close = () => {
  delView(unref(currentRoute))
}

/** 初始化 */
onMounted(async () => {
  const id = props.id || route.params.id
  if (!id) {
    message.warning('参数错误，合同不能为空！')
    close()
    return
  }
  formData.value = await CompanyApi.getCompany(id)
  // 获得地区列表
  areaList.value = await AreaApi.getAreaTree()
})
</script>

<style lang="scss" scoped>
::v-deep .el-input-number .el-input__inner {
  text-align: left;
}
</style>
