// TODO puhui999: 借鉴一下 form-create-designer utils 方法 🤣 (导入不了只能先 copy 过来用下)
//原版本不想改动，又复制了一个
export function makeRequiredRule() {
  return {
    type: 'Required',
    field: 'formCreate$required',
    title: '是否必填'
  }
}

export const localeProps = (t, prefix, rules) => {
  return rules.map((rule) => {
    if (rule.field === 'formCreate$required') {
      rule.title = t('props.required') || rule.title
    } else if (rule.field && rule.field !== '_optionType') {
      rule.title = t('components.' + prefix + '.' + rule.field) || rule.title
    }
    return rule
  })
}

export function upper(str) {
  return str.replace(str[0], str[0].toLocaleUpperCase())
}

// export function makeOptionsRule(t, to, userOptions) {
export function makeOptionsRule(t, to) {
  // console.log(userOptions[0])
  const options = [
    { label: '属性配置', value: 0 }
  ]

  const control = [
    {
      value: 0,
      rule: [
        {
          type: 'TableOptions',
          field: 'formCreate' + upper(to).replace('.', '>'),
          props: { defaultValue: [] }
        }
      ]
    },
    {
      value: 1,
      rule: [
        {
          type: 'Struct',
          field: 'formCreate' + upper(to).replace('.', '>'),
          props: { defaultValue: [] }
        }
      ]
    },
    {
      value: 2,
      rule: [
        {
          type: 'TableOptions',
          field: 'formCreate' + upper(to).replace('.', '>'),
          props: { modelValue: [] }
        }
      ]
    }
  ]
  options.splice(0, 0)
  control.push()

  return {
    type: 'radio',
    title: t('props.options'),
    field: '_optionType',
    value: 0,
    options,
    props: {
      type: 'button'
    },
    control
  }
}
