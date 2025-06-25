<template>
<div class="simple-dialog-component" >
    <el-dialog  width="25vw" :title="props.title"  v-model="dialogVisible" center @close="closeDialog"> 
        <el-container>
            <el-main>
                <el-row :gutter="5">
                    <el-col :span="7"><div class="label-container">{{ props.label }}</div></el-col>
                    <el-col :span="17">
                        <!-- <div  class="input-container"> -->
                            <input class="input-container" :max="50" type="text" @keydown.enter="handleEnter" v-model="inputValue" />   
                        <!-- </div> -->
                    </el-col>
                    <!-- <el-col :span="5"><Button class="ok-container"  @click="ok" /></el-col> -->
                </el-row>
            </el-main>
        </el-container>
        <el-container v-if="props.label2">
            <el-main>
                <el-row :gutter="5">
                    <el-col :span="7"><div class="label-container">{{ props.label2 }}</div></el-col>
                    <el-col :span="17">
                        <!-- <div  class="input-container"> -->
                            <input class="input-container" :max="50" type="text" @keydown.enter="handleEnter" v-model="inputValue2" />   
                        <!-- </div> -->
                    </el-col>
                </el-row>
            </el-main>
        </el-container>
    </el-dialog>
</div>
</template>

<script setup lang="ts">

    
defineOptions({ name: 'SimpleDialogComponent' });
  const props = defineProps({
    title: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      required: true
    },
    label2: {
      type: String,
       default: ''
    }
  })

  const dialogVisible = ref(false);
  const inputValue = ref('');
  const inputValue2 = ref('');

  //打开弹窗
  const openDialog = ()=>{
    dialogVisible.value = true;
  }

  defineExpose({ openDialog }) // 提供 open 方法，用于打开弹窗


    //关闭弹窗
  const closeDialog = ()=>{
    dialogVisible.value = false;
    inputValue.value = '';
    inputValue2.value = '';
  }
  // 监听回车
  const handleEnter = (event: KeyboardEvent) => {
    ok();
  }
  const emit = defineEmits(['simple-ok'])
  const ok = ()=>{
    if(inputValue.value.trim().length === 0){
        return;
    }
    if(props.label2 && inputValue2.value.trim().length === 0){
        return;
    }
    emit('simple-ok', inputValue.value.trim(), inputValue2.value.trim());
    closeDialog();
  }

</script>
<style lang="scss">
    .simple-dialog-component {
        margin: 0 auto;
        //弹窗样式
        .el-dialog{
            background-color: transparent;
            background-image: url("@/assets/operatingterminal/images/simpleDialog.png");
            background-size: 100% 100%;
            background-position: center;
            background-repeat: no-repeat;
        }
        .el-dialog__title{
            color: #69c8ee;
        }

        .el-dialog__header{
            padding: 0;
        }
        .el-dialog__body,el-dialog__header{
            padding: 0;
        }

        .label-container{
            position: relative;
            top: 0.8vw;
            width: 100%;
            font-size: 1.2vw;
            color: #8dcbe4;
        }
        .input-container{
            width: 90%;
            height: 3.5vw;
            background-color: transparent;
            background-image: url("@/assets/operatingterminal/images/inputPNG.png");
            background-size:  100% 100%;
            background-position: center;
            background-repeat: no-repeat;
            color: #fff;
            padding: 0 1vw;
            font-size: 1vw;
            border: none; /* 去掉边框 */
        }
        .input-container:focus {
            outline: none; /* 去掉默认焦点样式 */
        }

        .ok-container{
            position: relative;
            top: 0.7vw;
            width: 90%;
            height: 2.1vw;
            border: none;
            background-color: transparent;
            background-image: url("@/assets/operatingterminal/images/okButton.png");
            background-size: 100% 100%;
            background-position: center;
            background-repeat: no-repeat;
            cursor: pointer;
        }
     
    }
</style>
