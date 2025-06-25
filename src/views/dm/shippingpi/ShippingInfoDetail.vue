<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    label-width="100px"
    v-loading="formLoading"
  >

    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="发货单" prop="no">
          <el-input v-model="formData.no" placeholder="请输入发货单" disabled/>
        </el-form-item>

      </el-col>

      <el-col :span="8">
        <el-form-item label="发货单名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入发货单" disabled/>
        </el-form-item>

      </el-col>

      <el-col :span="8">
        <el-form-item label="项目" prop="projectId">


          <el-select v-model="formData.projectId" placeholder="请选择项目"
                     @change="onChangeProject($event)" disabled
          >
            <el-option
                    v-for="dict in projectInfos"
                    :key="dict.id"
                    :label="dict.projectName"
                    :value="dict.id"

            />
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="合同号" prop="contractId">

          <el-select
            v-model="formData.contractId"
            clearable
            filterable
            placeholder="请选择发货人员"
            class="!w-1/1"
            disabled
          >
            <el-option
              v-for="item in constractList"
              :key="item.id"
              :label="item.name + '('+item.number +')'"
              :value="item.id+''"
            />
          </el-select>

        </el-form-item>
      </el-col>



    </el-row>


    <el-row :gutter="20">

      <el-col :span="8">
        <el-form-item label="发货日期" prop="consignerDate">
          <el-date-picker
            v-model="formData.consignerDate"
            type="date"
            value-format="x"
            placeholder="选择发货日期"
            disabled
          />
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="发货人" prop="consigner">
          <el-select
            v-model="formData.consigner"
            clearable
            filterable
            placeholder="请选择发货人员"
            class="!w-1/1"
            disabled
          >
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.nickname +'('+item.deptName+')'"
              :value="item.id +''"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">

        <el-form-item label="收货人" prop="consignedBy">
          <el-input v-model="formData.consignedBy" placeholder="请输入收货人" disabled/>
        </el-form-item>

      </el-col>

    </el-row>

    <el-row :gutter="20">

      <el-col :span="8">
        <el-form-item label="承运人" prop="deliveryBy">
          <el-input v-model="formData.deliveryBy" placeholder="请输入承运人" disabled/>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="承运单号" prop="deliveryNumber">
          <el-input v-model="formData.deliveryNumber" placeholder="请输入承运单号" disabled/>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="承运人电话" prop="deliveryContact">
          <el-input v-model="formData.deliveryContact" placeholder="请输入承运人电话" disabled/>
        </el-form-item>

      </el-col>

    </el-row>
    <el-row :gutter="20">

      <el-col :span="8">
        <el-form-item label="承运方式" prop="deliveryMethod">
          <el-input v-model="formData.deliveryMethod" placeholder="请输入承运方式" disabled/>
        </el-form-item>

      </el-col>
      <el-col :span="8">
        <el-form-item label="收货人电话" prop="consignedContact">
          <el-input v-model="formData.consignedContact" placeholder="请输入收货人联系方式" disabled/>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="收货日期" prop="consignedDate">
          <el-date-picker
            v-model="formData.consignedDate"
            type="date"
            value-format="x"
            placeholder="选择收货日期"
            disabled
          />
        </el-form-item>

      </el-col>


    </el-row>

  </el-form>

  <!-- 子表的表单 -->
  <el-tabs v-model="subTabsName">
    <el-tab-pane label="销售发货明细" name="shippingDetail">
      <ShippingDetailList :shipping-id=" props.id || queryId"/>
    </el-tab-pane>
  </el-tabs>
</template>
<script lang="ts" setup>
  import {DICT_TYPE, getIntDictOptions} from '@/utils/dict'
  import {useTagsViewStore} from '@/store/modules/tagsView'
  import * as DefinitionApi from '@/api/bpm/definition'
  import ShippingDetailList from '../shipping/components/ShippingDetailList.vue'
  import * as UserApi from '@/api/system/user'
  import {ShippingApi, ShippingVO} from '@/api/dm/shipping'
  import {propTypes} from '@/utils/propTypes'
  import {DMContractApi, DMContractVO} from '@/api/dm/contract'
  /** 合同 */
  import {ContractApi} from '@/api/ppm/contract'
  defineOptions({name: 'ShippingInfoDetail'})


  const {query} = useRoute() // 查询参数
  const userList = ref < UserApi.UserVO[] > ([]) // 用户列表
  const queryId = query.id as unknown as number // 从 URL 传递过来的 id 编号

  const constractList = ref < ContractApi.ContractVO[] > ([]) //合同列表
  const props = defineProps({
    id: propTypes.number.def(undefined)
  })
  const subTabsName = ref('shippingDetail')
  const detailLoading = ref(false) // 表单的加载中
  const formData = ref({
    id: undefined,
    contractId: undefined,
    consigner: undefined,
    fileUrl: '',
    consignerDate: undefined,
    deliveryMethod: undefined,
    deliveryBy: undefined,
    deliveryNumber: undefined,
    deliveryContact: undefined,
    consignedBy: undefined,
    consignedDate: undefined,
    consignedContact: undefined,
    no: undefined,
  })
  /** 获得数据 */
  const getInfo = async () => {
    detailLoading.value = true
    formData.value.id = props.id || queryId;
    try {
      formData.value = await ShippingApi.getShipping(props.id || queryId)


        // projectInfos.value=[];
        // projectInfos.value = await DMContractApi.getProductOrderList(2);


        contractList.value = await
            DMContractApi.getContractInfoByProjectId(formData.value.projectId)


        orderInfo.value =await DMContractApi.getMaterialStockByProjectId(formData.value.projectId)
      // 加载用户列表
      userList.value = await
        UserApi.getSimpleUserList()
// 加载合同列表
      constractList.value = await
        ContractApi.getContractListByType(2)
    } finally {
      detailLoading.value = false
    }
  }
  defineExpose({open: getInfo}) // 提供 open 方法，用于打开弹窗

  /** 初始化 **/
  onMounted(() => {
    getInfo()
  })
</script>
