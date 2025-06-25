<template>
  <el-dialog :title="dialogTitle" v-model="dialogVisible">

    <el-collapse v-model="activeName" accordion>
      <el-collapse-item title="用户授权" name="user">
        <el-table
          ref="userTableRef"
          v-loading="userLoading"
          :data="userData"
          style="width: 100%"
          @selection-change="handleUserSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column property="username" label="账号" align="center" />
          <el-table-column property="nickname" label="昵称" align="center" />
          <el-table-column property="deptName" label="部门" align="center" />
          <el-table-column property="mobile" label="手机号码" align="center" />
        </el-table>
        <Pagination
          :total="userPage.total"
          v-model:page="userPage.pageNo"
          v-model:limit="userPage.pageSize"
          @pagination="getUserList"
        />
      </el-collapse-item>
      <el-collapse-item title="角色授权" name="role">
        <el-table
          ref="roleTableRef"
          v-loading="roleLoading"
          :data="roleData"
          style="width: 100%"
          @selection-change="handleRoleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column property="name" label="角色名称" align="center" />
          <el-table-column property="code" label="角色标识" align="center" />
          <el-table-column property="remark" label="备注" align="center" />
        </el-table>
        <Pagination
          :total="rolePage.total"
          v-model:page="rolePage.pageNo"
          v-model:limit="rolePage.pageSize"
          @pagination="getRoleList"
        />
      </el-collapse-item>

    </el-collapse>

    <template #footer>
      <el-button @click="submitEdit" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">

import {RegionApi} from "@/api/macs/region";
import {getDeviceList} from "@/api/macs/door";

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const activeName = ref('user');
const emit = defineEmits(['success'])
let isEditPage = false;
let editRegionList = [];

const userTableRef = ref();
const userData = ref([]);
const userSelection = ref([]);
const userLoading = ref(false);
const userPage = reactive({total: 1, pageNo: 1, pageSize: 10,})

const roleTableRef = ref();
const roleData = ref([]);
const roleSelection = ref([]);
const roleLoading = ref(false);
const rolePage = reactive({total: 0, pageNo: 1, pageSize: 10,})

/** 查询列表 */
const getUserList = async () => {
  userLoading.value = true
  try {
    const data = await RegionApi.getUserList(userPage)
    userData.value = data.list;
    userPage.total = data.total
  } finally {
    userLoading.value = false
  }
}
const getRoleList = async () => {
  roleLoading.value = true
  try {
    const data = await RegionApi.getRoleList(rolePage)
    roleData.value = data.list;
    rolePage.total = data.total
  } finally {
    roleLoading.value = false
  }
}
const getExistingList = async (regionId: string) => {
  const Permissions: any = await RegionApi.getExistingPermissions({id: regionId})
  userSelection.value = Permissions?.userSelection || [];
  roleSelection.value = Permissions?.roleSelection || [];
  for (let user of userSelection.value) {
    let findU = userData.value.find(item => item.id == user);
    userTableRef.value!.toggleRowSelection(findU, true);
  }
  for (let role of roleSelection.value) {
    let findR = roleData.value.find(item => item.id == role);
    roleTableRef.value!.toggleRowSelection(findR, true);
  }
}

/** 打开弹窗 */
const open = async (regionList: [], isEdit?: boolean) => {
  dialogVisible.value = true
  isEditPage = isEdit??false;
  editRegionList = regionList;
  const [] = await Promise.all([getUserList(), getRoleList(),]);
  // 修改时，设置数据
  if (isEditPage) {
    formLoading.value = true
    try {
      await getExistingList(editRegionList[0].id)
    } finally {
      formLoading.value = false
    }
  }
}
const handleUserSelectionChange = (users) => {
  userSelection.value = users
}
const handleRoleSelectionChange = (roles) => {
  roleSelection.value = roles
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const submitEdit = async () => {
  roleLoading.value = true;
  userLoading.value = true;
  const params = {
    regionKeys: editRegionList.map(item => item.id + ''),
    roleKeys: roleSelection.value.map(item => item.id + ''),
    userKeys: userSelection.value.map(item => item.id + ''),
  }
  console.log(params)
  try {
    if (isEditPage) {
      await RegionApi.updateUserRoleForAuthority(params);
    } else {
      await RegionApi.addUserRoleForAuthority(params);
    }
    dialogVisible.value = false
    message.success(t('common.createSuccess'))
    emit('success')
  } finally {
    roleLoading.value = false;
    userLoading.value = false;
    formLoading.value = false
  }
}

</script>

<style lang="scss">
.el-overlay-dialog::-webkit-scrollbar {
  display: none;
}
</style>
