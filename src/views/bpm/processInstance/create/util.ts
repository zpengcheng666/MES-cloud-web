import { getAccessToken } from '@/utils/auth'
import { useUserStore } from '@/store/modules/user'
import { getUser } from '@/api/system/user'
import {formatDate,betweenDay} from '@/utils/formatTime'

const message = useMessage() // 消息
// 改变下拉里的远程请求，配合字段username
export const changeUsername =async (detailForm) => {
  detailForm.value.rule.forEach((item,index)=>{
    if(item.field==="name"&&item.type==="select"){
      debugger
      //请求链接
      // detailForm.value.rule[index].effect.fetch.action = "http://192.168.2.178:48080/admin-api/system/dept/simple-list";

      //请求方式
      // detailForm.value.rule[index].effect.fetch.method = "GET";
      //请求头
      // const headobj = {
      //   "Tenant-Id":1,
      //   Authorization:getAccessToken()
      // }
      // detailForm.value.rule[index].effect.fetch.headers = headobj;
      detailForm.value.rule[index].effect.fetch.headers.Authorization = getAccessToken();

      //回调函数
      detailForm.value.rule[index].effect.fetch.parse = (res)=>{
        return res.data.map((row)=>{
          return {
            label:row.name,
            value:row.id
          }
        })
      }

      //数据安放位置
      // detailForm.value.rule[index].effect.fetch.to = "options";


      return
    }
  })
}

/**
 * 页面数据补充
 * @param detailForm
 */
export const fillnameMethod = async ()=>{
  const userId = useUserStore().getUser.id // 当前登录的编号
  const data = await getUser(userId);
  console.log(data);
  console.log(Date.now())
  const fillnames = [];
  fillnames.push(data.id);
  return {
    "fillname":data.id,
    "fillnames":fillnames,
    "signname":data.nickname,
    "signdate":formatDate(Date.now()),
    "fillsex":data.sex,
    "fillDeptId":data.deptId,
    "fillPostIds":data.postIds
  }
}
export const validateTime =async (formData) =>{
  let a = true
  let b = true
  let c = true
  let strDate = 0;
  let strTime = 0;

  let startDate = 'startDate';
  let endDate = 'endDate';
  let total = 'total';
  let startTime = 'startTime';
  let endTime = 'endTime';
  while (formData[startDate]&&formData[endDate]) {
    c = a&&c;
    if(!c){
      break
    }
    a =  await compareTime(formData[startDate],formData[endDate])
    formData[total] = betweenDay(formData[startDate],formData[endDate])
    console.log(formData[total])
    strDate++;
    startDate = startDate + strDate;
    endDate = endDate + strDate;
    total = total + strDate;

  }
  while (formData[startTime]&&formData[endTime]) {
    c = b&&c;
    if(!c){
      break
    }
    b = compareTime(formData[startTime],formData[endTime])
    strTime++;
    startTime = startTime + strTime;
    endTime = endTime + strTime;

  }
  // if(formData.startDate&&formData.endDate){
  //   a =  await compareTime(formData.startDate,formData.endDate)
  // }
  // if(formData.startTime&&formData.endTime){
  //   b = compareTime(formData.startTime,formData.endTime)
  // }
  return a&&b
}
const compareTime = (start,end) =>{
  if (start > end) {
    message.error('请检查选择的时间关系'+start+'-'+end)
    return false
  }
  return true
}
