import type { CrudSchema } from '@/hooks/web/useCrudSchemas'
import { getRegionList } from '@/api/macs/door'

// 表单校验
export const rules = reactive({
  name: [required],
  code: [required]
})

// CrudSchema https://doc.iocoder.cn/vue3/crud-schema/
const crudSchemas = reactive<CrudSchema[]>([
  {
    label: '名称',
    field: 'name',
    isSearch: true
  },
  {
    label: '编码',
    field: 'code',
    isSearch: true
  },
  {
    label: '关联区域',
    field: 'regionName',
  },
  {
    label: '关联设备',
    field: 'deviceName',
    form: {
      component: 'TreeSelect',
      componentProps: {
        optionsAlias: {
          labelField: 'name',
          valueField: 'id'
        }
      },
      api: getRegionList
    }
  },
  {
    label: '门禁状态',
    field: 'doorStatus',
    dictType: 'doorStatus',
    dictClass: 'number',
    isSearch: true,
    form: {
      component: 'SelectV2',
    }
  },
  {
    label: '描述/备注',
    field: 'description',
  },
  {
    label: '关联设备位置',
    field: 'devicePort',
    form: {
      component: 'InputNumber',
      value: 0
    }
  },
  {
    label: '操作',
    field: 'action',
    isForm: false
  }
])
export const { allSchemas } = useCrudSchemas(crudSchemas)
