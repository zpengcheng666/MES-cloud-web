<template>
    <el-dialog
        v-model="dialogVisible"
        title="选择位置"
        width="600"
    >
    <LocationTree  @ok="success" />

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="success">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import LocationTree from '@/components/warehouse/LocationTree.vue'

const dialogVisible = ref(false)

defineOptions({ name: 'SelectLocationDialog' })

const open = async () => {
    dialogVisible.value = true
}
// 父组件充当中间件，将选中树节点传给子级
const selectPositionNode = reactive<any>({
  name: undefined,
  id: undefined,
  type: undefined,
  childrens: undefined
})
provide('selectPositionNode', selectPositionNode)
const message = useMessage()
const success = () => {
    const { name, id, type, childrens } = selectPositionNode
    if((type !== 2 && type !== 3) || childrens){
        message.error('请选择根节点！！！')
    }else{
        emit('selectPositionNode', selectPositionNode)
        dialogVisible.value = false
    }
}

const emit = defineEmits(['selectPositionNode']) 
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

</script>