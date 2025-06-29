import { generateUUID } from '@/utils'
import { localeProps, makeRequiredRule } from '@/components/FormCreate/src/utils'
import { selectUserPopRule } from '@/components/FormCreate/src/config/selectUserPopRule'
import { SelectRuleOption } from '@/components/FormCreate/src/type'

/**
 * 通用选择器规则 hook
 *
 * @param option 规则配置
 */
export const useSelectUserPopRule = (option: SelectRuleOption) => {
  const label = option.label
  const name = option.name
  return {
    icon: option.icon,
    label,
    name,
    rule() {
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
      return localeProps(t, name + '.props', [makeRequiredRule(), ...option.props, ...selectUserPopRule])
    }
  }
}
