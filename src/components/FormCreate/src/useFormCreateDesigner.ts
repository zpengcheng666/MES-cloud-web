import {
  useDictSelectRule,
  useEditorRule,
  useSelectRule,
  useUploadFileRule,
  useUploadImgRule,
  useUploadImgsRule,
  useSelectUserPopRule,
  useApiSelectPopRule
} from './config'
import { Ref } from 'vue'
import { Menu } from '@/components/FormCreate/src/type'
import { apiSelectRule } from '@/components/FormCreate/src/config/selectRule'
import { selectUserPopRule } from '@/components/FormCreate/src/config/selectUserPopRule'
import { apiSelectPopRule } from '@/components/FormCreate/src/config/apiSelectPopRule'

/**
 * 表单设计器增强 hook
 * 新增
 * - 文件上传
 * - 单图上传
 * - 多图上传
 * - 字典选择器
 * - 用户选择器
 * - 部门选择器
 * - 富文本
 */
/**
 * 用户pop      useSelectUserPopRule
 * 自定义接口pop useApiSelectPopRule
 */
export const useFormCreateDesigner = async (designer: Ref) => {
  const editorRule = useEditorRule()
  const uploadFileRule = useUploadFileRule()
  const uploadImgRule = useUploadImgRule()
  const uploadImgsRule = useUploadImgsRule()

  /**
   * 构建表单组件
   */
  const buildFormComponents = () => {
    // 移除自带的上传组件规则，使用 uploadFileRule、uploadImgRule、uploadImgsRule 替代
    designer.value?.removeMenuItem('upload')
    // 移除自带的富文本组件规则，使用 editorRule 替代
    designer.value?.removeMenuItem('fc-editor')
    const components = [editorRule, uploadFileRule, uploadImgRule, uploadImgsRule]
    components.forEach((component) => {
      // 插入组件规则
      designer.value?.addComponent(component)
      // 插入拖拽按钮到 `main` 分类下
      designer.value?.appendMenuItem('main', {
        icon: component.icon,
        name: component.name,
        label: component.label
      })
    })
  }

  const userSelectRule = useSelectRule({
    name: 'UserSelect',
    label: '用户选择器',
    icon: 'icon-user-o'
  })
  const deptSelectRule = useSelectRule({
    name: 'DeptSelect',
    label: '部门选择器',
    icon: 'icon-address-card-o'
  })
  const dictSelectRule = useDictSelectRule()
  const apiSelectRule0 = useSelectRule({
    name: 'ApiSelect',
    label: '接口选择器',
    icon: 'icon-server',
    props: [...apiSelectRule]
  })

  const selectUserRulePop0 = useSelectUserPopRule({
    name: 'SelectUserPop',
    label: '用户选择器',
    icon: 'icon-server',
    props: [...selectUserPopRule]
  })

  const apiSelectRulePop0 = useApiSelectPopRule({
    name: 'apiSelectPop',
    label: '接口选择器',
    icon: 'icon-server',
    props: [...apiSelectPopRule]
  })

  /**
   * 构建系统字段菜单
   */
  const buildSystemMenu = () => {
    // 移除自带的下拉选择器组件，使用 currencySelectRule 替代
    designer.value?.removeMenuItem('select')
    // designer.value?.removeMenuItem('radio')
    // designer.value?.removeMenuItem('checkbox')
    const components = [userSelectRule, deptSelectRule, dictSelectRule, apiSelectRule0,selectUserRulePop0,apiSelectRulePop0]
    const menu: Menu = {
      name: 'system',
      title: '系统字段',
      list: components.map((component) => {
        // 插入组件规则
        designer.value?.addComponent(component)
        // 插入拖拽按钮到 `system` 分类下
        return {
          icon: component.icon,
          name: component.name,
          label: component.label
        }
      })
    }
    designer.value?.addMenu(menu)
  }

  onMounted(async () => {
    await nextTick()
    buildFormComponents()
    buildSystemMenu()
  })
}
