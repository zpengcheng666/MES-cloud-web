import { generateUUID } from '@/utils'
import { localeProps, makeRequiredRule } from '@/components/FormCreate/src/utils'
// import { makeOptionsRule } from '@/components/FormCreate/src/utils/index2'
import { selectPopRule } from '@/components/FormCreate/src/config/apiSelectPopRule'
import { SelectRuleOption } from '@/components/FormCreate/src/type'

/**
 * 通用选择器规则 hook
 *
 * @param option 规则配置
 */
export const useApiSelectPopRule = (option: SelectRuleOption) => {
  const label = option.label
  const name = option.name
  return {
    icon: option.icon,
    label,
    name,
    rule({t}) {
      const opt = t('props.option');
      return {
        type: name,
        field: generateUUID(),
        title: label,
        info: '',
        $required: false
      }
    },
    props(_, { t }) {
      if (!option.props) {
        option.props = []
      }
      return localeProps(t, name + '.props', [makeRequiredRule(), ...option.props, ...selectPopRule])
    }
  }
}
