<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="用户名称" prop="username">
        <el-input
          v-model="queryParams.username"
          placeholder="请输入用户名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input
          v-model="queryParams.mobile"
          placeholder="请输入手机号码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="用户状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['macs:user:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column label="用户编号" align="center" key="id" prop="id" />
      <el-table-column label="用户名称" align="center" prop="username" :show-overflow-tooltip="true"/>
      <el-table-column label="用户昵称" align="center" prop="nickname" :show-overflow-tooltip="true"/>
      <el-table-column label="部门" align="center" key="deptName" prop="deptName" :show-overflow-tooltip="true"/>
      <el-table-column label="手机号码" align="center" prop="mobile" width="120" />
      <el-table-column label="状态" key="status" prop="mobile" align="center">
        <template #default="{row}">
          <span v-if="row.status" class="el-tag el-tag--warning el-tag--default el-tag--light"><span class="el-tag__content">关闭</span></span>
          <span v-else class="el-tag el-tag--success el-tag--light"><span class="el-tag__content">开启</span></span>
        </template>
      </el-table-column>
      <el-table-column label="卡号" align="center" prop="code" />
      <el-table-column label="人脸" align="center" prop="facePicture" >
        <template #default="{row}">
          <img v-if="row.facePicture" :src="row.facePicture" height="23" width="23" />
          <span v-else v-text="'未录入'"></span>
        </template>
      </el-table-column>
      <el-table-column label="指纹" align="center" prop="fingerprintPicture" >
        <template #default="{row}">
<!--          <img v-if="row.fingerprintPicture" :src="row.fingerprintPicture" height="23" width="23" />-->
          <span v-if="row.fingerprintPicture" style="color: #87bdff">已录入</span>
          <span v-else v-text="'未录入'"></span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160">
        <template #default="scope">
          <div class="flex items-center justify-center">
<!--            <el-button type="primary" link @click="openForm('update', scope.row.id)" v-hasPermi="['system:user:update']">
              门禁信息
            </el-button>-->
            <el-button type="primary" link @click="handleAuthority(scope.row)" v-hasPermi="['system:user:update']">
              <Icon icon="ep:edit" />授权
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <UserForm ref="formRef" @success="getList" />
  <UserAuthorityList ref="authorityRef" @success="getList" />
</template>

<script setup lang="ts">
import download from '@/utils/download'
import { UserApi, UserVO } from '@/api/macs/user'
import UserForm from './UserForm.vue'
import UserAuthorityList from './UserAuthorityList.vue'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import {rowContextKey} from "element-plus";


/** 门禁用户 列表 */
defineOptions({ name: 'User' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<UserVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  username: undefined,
  mobile: undefined,
  status: undefined,
  deptId: undefined,
  createTime: []
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const [res1, res2] = await Promise.all([UserApi.getUserPage(queryParams), UserApi.getMacsUserPage()]);//todo 少量用户可用
    list.value = res1.list;
    total.value = res1.total
    for (let re1 of list.value) {
      for (let re2 of res2) {
        if (re2.userId == re1.id) {
          re1.code = re2.code;
          re1.fingerprintPicture = re2.fingerprintPicture;
          re1.facePicture = re2.facePicture;
          break;
        }
      }
    }
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

const authorityRef = ref()
const handleAuthority = (row) => {
  authorityRef.value.open(row)
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await UserApi.deleteUser(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await UserApi.exportUser(queryParams)
    download.excel(data, '门禁用户.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
