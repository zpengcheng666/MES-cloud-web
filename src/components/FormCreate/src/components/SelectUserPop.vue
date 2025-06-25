<!-- 数据字典 Select 选择器 -->
<template>
  <el-select
    v-if="selectType === 'multiple'"
    class="w-1/1"
    ref="selectref"
    @visible-change="changeUsername"
    filterable
    multiple
    placeholder="请选择用户"
    value-key="id"
    v-bind="attrs"
  >
    <el-option
      v-for="item in userListAll"
      :key="item.id"
      :label="item.nickname"
      :value="item.id">
      <span>{{ item.nickname }}</span>
    </el-option>
  </el-select>
  <Dialog v-if="selectType === 'multiple'" title="选择" v-model="dialogVisible" width="800" @open="openDialog" @close="closeDialog">
    <ContentWrap>
      <el-form
        class="-mb-15px"
        :inline="true"
        label-width="68px"
      >
        <el-form-item>
          <el-input
            v-model="queryParams.username"
            placeholder="请输入用户名"
            clearable
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item>
          <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
          <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        </el-form-item>

      </el-form>


    </ContentWrap>
    <ContentWrap>

      <el-table
        size="default"
        ref="multipleTableRef"
        :data="userList"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :row-key="getRowKeys"
      >
        <el-table-column type="selection" :reserve-selection="true" width="55" />
        <el-table-column label="id" width="50">
          <template #default="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column property="username" label="用户名" min-width="120" />
        <el-table-column property="nickname" label="昵称" min-width="120" />
        <el-table-column property="email" label="邮箱" min-width="200" />
        <el-table-column property="mobile" label="电话" min-width="120" />
      </el-table>
      <!-- 分页 -->
      <Pagination
        v-model:limit="queryParams.pageSize"
        v-model:page="queryParams.pageNo"
        :total="total"
        :page-sizes="[5, 10, 20, 50, 100]"
        @pagination="getUserList"
      />
    </ContentWrap>



  </Dialog>


  <el-select
    v-if="selectType === 'single'"
    class="w-1/1"
    ref="selectref2"
    @visible-change="changeUsername2"
    multiple
    filterable
    placeholder="请选择用户"
    value-key="id"
    v-bind="attrs"
  >

    <el-option
      v-for="item in userListAll"
      :key="item.id"
      :label="item.nickname"
      :value="item.id">
      <span>{{ item.nickname }}</span>
    </el-option>
  </el-select>
  <Dialog v-if="selectType === 'single'" title="选择" v-model="dialogVisible2" width="800" @close="closeDialog2">
    <ContentWrap>
      <el-form
        class="-mb-15px"
        :inline="true"
        label-width="68px"
      >
        <el-form-item>
          <el-input
            v-model="queryParams2.username"
            placeholder="请输入用户名"
            clearable
            @keyup.enter="handleQuery2"
            class="!w-240px"
          />
        </el-form-item>
        <el-form-item>
          <el-button @click="handleQuery2"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
          <el-button @click="resetQuery2"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        </el-form-item>

      </el-form>
    </ContentWrap>
    <ContentWrap >
      <el-table
        size="default"
        ref="singelTableRef"
        :data="userList"
        style="width: 100%"
        highlight-current-row
        @current-change="handleCurrentChange"
      >
        <el-table-column label="id" width="120">
          <template #default="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column property="nickname" label="姓名" min-width="120" />
        <el-table-column property="email" label="邮箱" min-width="200" />
        <el-table-column property="mobile" label="电话" min-width="120" />
      </el-table>
      <!-- 分页 -->
      <Pagination
        v-model:limit="queryParams2.pageSize"
        v-model:page="queryParams2.pageNo"
        :total="total2"
        :page-sizes="[5, 10, 20, 50, 100]"
        @pagination="getUserList2"
      />
    </ContentWrap>



  </Dialog>

</template>

<script lang="ts" setup>

import * as UserApi from '@/api/system/user'
defineOptions({ name: 'SelectUserPop' })

const attrs = useAttrs()
const dialogVisible = ref(false)
const dialogVisible2 = ref(false)
const selectref = ref();
const selectref2 = ref();
const userList = ref([])
const userListAll = ref([])

// 接受父组件参数
interface Props {
  selectType?: 'single' | 'multiple' // 单选和多选

}

const props = withDefaults(defineProps<Props>(), {
  selectType: 'multiple'
})

const multipleTableRef = ref();
const multipleSelection = ref([]);
const singelTableRef = ref();


const total = ref(0) // 列表的总页数
const total2 = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 5,
  username: null,
})
const queryParams2 = reactive({
  pageNo: 1,
  pageSize: 5,
  username: null,
})

/**
 * 这个下拉出现时调用
 */
const changeUsername = ()=>{
  getUserList()
  dialogVisible.value = true
  nextTick(()=>{
    selectref.value.blur();
  })
}
const changeUsername2 = ()=>{
  getUserList2()
  dialogVisible2.value = true
  nextTick(()=>{
    selectref2.value.blur();
  })
}

/**
 * 表格选中时触发,主要是把表格选中的数据显示在下拉中
 * @param val
 */
const handleSelectionChange = (val) => {
  multipleSelection.value = val
  attrs.modelValue.splice(0,attrs.modelValue.length)
  multipleSelection.value.forEach((item)=>{
    attrs.modelValue.push(item.id)
  })
}

const handleCurrentChange = (val)=>{
  try{
    if(val) {
      attrs.modelValue.splice(0,attrs.modelValue.length)
      attrs.modelValue.push(val.id)
    }

  }catch (e) {
    console.error(e)
  }
}

const getUserList = async ()=>{
  // userList.value = await UserApi.getSimpleUserList()
  const data =await UserApi.getUserPage(queryParams);
  userList.value = data.list;
  total.value = data.total
}
const getUserList2 = async ()=>{
  const data =await UserApi.getUserPage(queryParams2);
  userList.value = data.list;
  total2.value = data.total
}

const getRowKeys = (row)=> {
  //  唯一标识
  return row.id;
}

const closeDialog =()=>{
  queryParams.pageNo = 1;
  queryParams.pageSize = 5;
  queryParams.username = null;
}
const closeDialog2 =()=>{
  queryParams2.pageNo = 1;
  queryParams2.pageSize = 5;
  queryParams2.username = null;
}
/**
 * 打开弹窗时调用
 */
const openDialog =()=>{
  console.log('openDialog')
  nextTick(()=>{
    const list = [];
    list.push(...attrs.modelValue)
    multipleSelection.value.forEach((row)=>{
     const id =  list.find((item)=>{
        return item===row.id
      })
      if(id){
        multipleTableRef.value.toggleRowSelection(row,true)
      }
    })

  })



}
const handleQuery = ()=>{
  queryParams.pageNo = 1
  getUserList()
}
const resetQuery = ()=>{
  queryParams.username = null;
  queryParams.pageNo = 1
  getUserList()
}
const handleQuery2 = ()=>{
  queryParams2.pageNo = 1
  getUserList2()
}
const resetQuery2 = ()=>{
  queryParams2.username = null;
  queryParams2.pageNo = 1
  getUserList2()
}

const getAllUserList = async ()=>{
  // const data =await UserApi.getUserPage({pageNo: 1, pageSize: 100});
  const data =await UserApi.getSimpleUserList()
  userListAll.value = data
}

  onMounted(()=>{
    getUserList()
    getAllUserList()
  })
</script>
