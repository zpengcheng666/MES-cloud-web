/************************************引入与导出**********************/

export { setData, startSubmitVerification, endSubmitVerification, getType };

/*************************************数据*********************************/

let processTaskMaterialList;
//工序物料详情列表

let chooseProcessMaterial;
//选择的工序物料任务(物料详情)
/*
McsBatchDetailDTO,批次零件任务
  processTask:McsBatchRecordDTO,批次任务
    processInfo:McsPlanProcessDTO,工序
  batchResource:物料需求
*/

//拣选工作
let pickerAreaTrayInfo; //托盘或工装物料信息
let pickerAreaMateriaInfo; //容器绑定物料列表
//操作区
let oprateAreaTrayInfo; //托盘或工装物料信息
let oprateAreaMateriaInfo; //容器绑定物料列表

let formData = {
  processTaskNumber: null, //生产任务单号
  processName: null, //工艺规程名称
  technologyCode: null, //工艺规程号
  partVersion: null, //版本
  processTaskName: null, //工序名称

  materialBarCode: null, //物料条码
  toolingBarCode: null, //工装条码(托盘/托盘上的工装)

  installUnloadQuantity: null //装卸数量
};
//表单数据

/*********************************数据*****************************/

/*
 * 设置数据
 */
function setData(data) {
  processTaskMaterialList = data.processTaskMaterialList;
  chooseProcessMaterial = data.chooseProcessMaterial;
  pickerAreaTrayInfo = data.pickerAreaTrayInfo;
  pickerAreaMateriaInfo = data.pickerAreaMateriaInfo;
  oprateAreaTrayInfo = data.oprateAreaTrayInfo;
  oprateAreaMateriaInfo = data.oprateAreaMateriaInfo;
  formData = data.formData;
}
// setData({
//   processTaskMaterialList: processTaskMaterialList.value,
//   chooseProcessMaterial: chooseProcessMaterial.value,
//   pickerAreaTrayInfo: pickerAreaTrayInfo.value,
//   pickerAreaMateriaInfo: pickerAreaMateriaInfo.value,
//   oprateAreaTrayInfo: oprateAreaTrayInfo.value,
//   oprateAreaMateriaInfo: oprateAreaMateriaInfo.value,
//   formData: formData.value
// });

/*************************************数据校验***************************/

//开工数据校验
function startSubmitVerification() {
  if (isBlank(chooseProcessMaterial)) return '请先选择工序任务';
  if (isBlank(formData.materialBarCode)) return '请输入物料条码';
  if (getType() == 0) return '不符合要求';
  if (!isBlank(verifyTaskMatching())) return verifyTaskMatching();
  return '';
}

//完工数据校验
function endSubmitVerification() {
  if (isBlank(chooseProcessMaterial)) return '请先选择工序任务';
  if (isBlank(formData.materialBarCode)) return '请输入物料条码';
  //已选择工序任务,存在物料条码
  if (chooseProcessMaterial?.barCode && chooseProcessMaterial?.barCode != formData.materialBarCode) return '物料条码与任务不匹配';
  //选择的物料条码与输入物料条码一致
  if (!isBlank(verifyTaskMatching())) return verifyTaskMatching();
  //校验物料与工装是否存在于资源列表中
  return '';
}

//校验物料与工装是否存在于资源列表中
function verifyTaskMatching() {
  if (!isBlank(formData.materialBarCode)) {
    if (!barcodeOnProcessTaskMaterialList(formData.materialBarCode)) return '物料与任务不匹配';
  }
  if (!isBlank(formData.toolingBarCode)) {
    if (!barcodeOnProcessTaskMaterialList(formData.toolingBarCode)) return '工装不适用于此任务';
  }
  return '';
}

/***********************************特殊情景***************************/

//获得任务类型,0:不符合要求,1:卸,2:常规安装,3:换装(更换工装),4:已完成(物料已绑定到工装上)
function getType() {
  if (isBlank(chooseProcessMaterial)) return 0; //没有选择工序任务
  if (isBlank(formData.materialBarCode)) return 0; //物料条码为空

  if (
    isBlank(formData.toolingBarCode) && //工装条码为空
    !isBlank(pickerAreaTrayInfo) && //拣选区有东西
    !isBlank(oprateAreaTrayInfo) && //操作区有东西
    barcodeOnOprateArea(formData.materialBarCode) && //物料存在于操作区
    pickerAreaTrayInfo.materialType == 'TP' //拣选区是托盘
  ) {
    return 1;
  }

  if (
    !isBlank(formData.toolingBarCode) && //工装条码不为空
    !isBlank(pickerAreaTrayInfo) && //拣选区有东西
    !isBlank(oprateAreaTrayInfo) && //操作区有东西
    barcodeOnPickerArea(formData.materialBarCode) && //物料存在于拣选区
    barcodeOnOprateArea(formData.toolingBarCode) //工装存在于操作区
  ) {
    return 2;
  }

  if (
    !isBlank(formData.toolingBarCode) && //工装条码不为空
    !isBlank(pickerAreaTrayInfo) && //拣选区有东西
    !isBlank(oprateAreaTrayInfo) && //操作区有东西
    barcodeOnOprateArea(formData.materialBarCode) && //物料存在于操作区
    barcodeOnPickerArea(formData.toolingBarCode) //工装存在于拣选区
  ) {
    return 3;
  }

  if (
    (!isBlank(formData.toolingBarCode) && //工装条码不为空
      isBlank(pickerAreaTrayInfo) && //拣选区没有东西
      isBlank(oprateAreaTrayInfo)) || //操作区没有东西
    (!isBlank(formData.toolingBarCode) && //工装条码不为空
      !isBlank(pickerAreaTrayInfo) && //拣选区有东西
      barcodeOnPickerArea(formData.materialBarCode) && //物料存在于拣选区
      barcodeOnPickerArea(formData.toolingBarCode)) || //工装存在于拣选区
    (!isBlank(formData.toolingBarCode) && //工装条码不为空
      !isBlank(oprateAreaTrayInfo) && //操作区有东西
      barcodeOnOprateArea(formData.materialBarCode) && //物料存在于操作区
      barcodeOnOprateArea(formData.toolingBarCode)) //工装存在于操作区
  ) {
    return 4;
  }

  return 0;
}

/**************************************公共函数************************/

//条码存在于拣选区
function barcodeOnPickerArea(barCode) {
  if (pickerAreaTrayInfo?.barCode == barCode) return true;
  let result = false;
  for (const item of pickerAreaMateriaInfo) {
    if (item.barCode == barCode) {
      result = true;
      break;
    }
  }
  return result;
}

//条码存在于操作区
function barcodeOnOprateArea(barCode) {
  if (oprateAreaTrayInfo?.barCode == barCode) return true;
  let result = false;
  for (const item of oprateAreaMateriaInfo) {
    if (item.barCode == barCode) {
      result = true;
      break;
    }
  }
  return result;
}

//条码存在于工序物料详情中
function barcodeOnProcessTaskMaterialList(barCode) {
  let result = false;
  for (const item of processTaskMaterialList) {
    if (item.resourceBarCode == barCode) {
      result = true;
      break;
    }
  }
  return result;
}

/*********************************工具函数************************/

function isBlank(v) {
  if (v == undefined || v == null) {
    return true;
  }
  if (typeof v?.trim == 'function' && v.trim() == '') {
    return true;
  }
  return false;
}
