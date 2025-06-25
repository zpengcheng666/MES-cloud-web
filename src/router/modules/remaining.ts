import { Layout } from '@/utils/routerHelper'

const { t } = useI18n()
/**
 * redirect: noredirect        当设置 noredirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'          设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
 hidden: true              当设置 true 的时候该路由不会再侧边栏出现 如404，login等页面(默认 false)

 alwaysShow: true          当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式，
 只有一个时，会将那个子路由当做根路由显示在侧边栏，
 若你想不管路由下面的 children 声明的个数都显示你的根路由，
 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，
 一直显示根路由(默认 false)

 title: 'title'            设置该路由在侧边栏和面包屑中展示的名字

 icon: 'svg-name'          设置该路由的图标

 noCache: true             如果设置为true，则不会被 <keep-alive> 缓存(默认 false)

 breadcrumb: false         如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)

 affix: true               如果设置为true，则会一直固定在tag项中(默认 false)

 noTagsView: true          如果设置为true，则不会出现在tag中(默认 false)

 activeMenu: '/dashboard'  显示高亮的路由路径

 followAuth: '/dashboard'  跟随哪个路由进行权限过滤

 canTo: true               设置为true即使hidden为true，也依然可以进行路由跳转(默认 false)
 }
 **/
const remainingRouter: AppRouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layout,
    name: 'Redirect',
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'Redirect',
        component: () => import('@/views/Redirect/Redirect.vue'),
        meta: {}
      }
    ],
    meta: {
      hidden: true,
      noTagsView: true
    }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    name: 'Home',
    meta: {},
    children: [
      {
        path: 'index',
        component: () => import('@/views/Home/Index.vue'),
        name: 'Index',
        meta: {
          title: t('router.home'),
          icon: 'ep:home-filled',
          noCache: false,
          affix: true
        }
      },
        {
            path: '/baseInfoData/create',
            component: () => import('@/views/knifetool/tool/baseInfo/AddAndEdit.vue'),
            name: '刀具基础信息添加',
            meta: {
                title: '刀具基础信息添加',
                noCache: false,
                affix: false,
                hidden: true,
                noTagsView: false
            }
        },
        {
            path: '/baseInfoData/update/:rowId?',
            component: () => import('@/views/knifetool/tool/baseInfo/AddAndEdit.vue'),
            name: '刀具基础信息修改',
            meta: {
                title: '刀具基础信息修改',
                noCache: false,
                affix: false,
                hidden: true,
                noTagsView: false
            }
        },
        {
            path: '/baseInfoData/view/:rowId?',
            component: () => import('@/views/knifetool/tool/baseInfo/AddAndEdit.vue'),
            name: '刀具基础信息查看',
            meta: {
                title: '刀具基础信息查看',
                noCache: false,
                affix: false,
                hidden: true,
                noTagsView: false
            }
        },
        {
            path: '/handleInfoData/create',
            component: () => import('@/views/knifetool/tool/handleInfo/AddAndEdit.vue'),
            name: '刀柄基础信息添加',
            meta: {
                title: '刀柄基础信息添加',
                noCache: false,
                affix: false,
                hidden: true,
                noTagsView: false
            }
        },
        {
            path: '/handleInfoData/update/:rowId?',
            component: () => import('@/views/knifetool/tool/handleInfo/AddAndEdit.vue'),
            name: '刀柄基础信息修改',
            meta: {
                title: '刀柄基础信息修改',
                noCache: false,
                affix: false,
                hidden: true,
                noTagsView: false
            }
        },
        {
            path: '/handleInfoData/view/:rowId?',
            component: () => import('@/views/knifetool/tool/handleInfo/AddAndEdit.vue'),
            name: '刀柄基础信息查看',
            meta: {
                title: '刀柄基础信息查看',
                noCache: false,
                affix: false,
                hidden: true,
                noTagsView: false
            }
        },
        {
            path: '/partsInfoData/create',
            component: () => import('@/views/knifetool/tool/partsInfo/AddAndEdit.vue'),
            name: '配件基础信息添加',
            meta: {
                title: '配件基础信息添加',
                noCache: false,
                affix: false,
                hidden: true,
                noTagsView: false
            }
        },
        {
            path: '/partsInfoData/update/:rowId?',
            component: () => import('@/views/knifetool/tool/partsInfo/AddAndEdit.vue'),
            name: '配件基础信息修改',
            meta: {
                title: '配件基础信息修改',
                noCache: false,
                affix: false,
                hidden: true,
                noTagsView: false
            }
        },
        {
            path: '/partsInfoData/view/:rowId?',
            component: () => import('@/views/knifetool/tool/partsInfo/AddAndEdit.vue'),
            name: '配件基础信息查看',
            meta: {
                title: '配件基础信息查看',
                noCache: false,
                affix: false,
                hidden: true,
                noTagsView: false
            }
        },
        {
            path: '/groupDataAdd/create/:rowId?',
            component: () => import('@/views/knifetool/toolGroup/group/AddAndEdit.vue'),
            name: '刀组添加',
            meta: {
                title: '刀组添加',
                noCache: false,
                affix: false,
                hidden: true,
                noTagsView: false
            }
        },
        {
            path: '/groupDataAdd/update/:rowId?',
            component: () => import('@/views/knifetool/toolGroup/group/AddAndEdit.vue'),
            name: '刀组修改',
            meta: {
                title: '刀组修改',
                noCache: false,
                affix: false,
                hidden: true,
                noTagsView: false
            }
        },
        {
            path: '/groupDataAdd/view/:rowId?',
            component: () => import('@/views/knifetool/toolGroup/group/AddAndEdit.vue'),
            name: '刀组查看',
            meta: {
                title: '刀组查看',
                noCache: false,
                affix: false,
                hidden: true,
                noTagsView: false
            }
        }

    ]
  },
  {
    path: '/user',
    component: Layout,
    name: 'UserInfo',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'profile',
        component: () => import('@/views/Profile/Index.vue'),
        name: 'Profile',
        meta: {
          canTo: true,
          hidden: true,
          noTagsView: false,
          icon: 'ep:user',
          title: t('common.profile')
        }
      },
      {
        path: 'notify-message',
        component: () => import('@/views/system/notify/my/index.vue'),
        name: 'MyNotifyMessage',
        meta: {
          canTo: true,
          hidden: true,
          noTagsView: false,
          icon: 'ep:message',
          title: '我的站内信'
        }
      }
    ]
  },
  {
    path: '/dict',
    component: Layout,
    name: 'dict',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'type/data/:dictType',
        component: () => import('@/views/system/dict/data/index.vue'),
        name: 'SystemDictData',
        meta: {
          title: '字典数据',
          noCache: true,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/system/dict'
        }
      }
    ]
  },

  {
    path: '/codegen',
    component: Layout,
    name: 'CodegenEdit',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'edit',
        component: () => import('@/views/infra/codegen/EditTable.vue'),
        name: 'InfraCodegenEditTable',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          icon: 'ep:edit',
          title: '修改生成配置',
          activeMenu: 'infra/codegen/index'
        }
      }
    ]
  },
  {
    path: '/job',
    component: Layout,
    name: 'JobL',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'job-log',
        component: () => import('@/views/infra/job/logger/index.vue'),
        name: 'InfraJobLog',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          icon: 'ep:edit',
          title: '调度日志',
          activeMenu: 'infra/job/index'
        }
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/Login/Login.vue'),
    name: 'Login',
    meta: {
      hidden: true,
      title: t('router.login'),
      noTagsView: true
    }
  },
  {
    path: '/sso',
    component: () => import('@/views/Login/Login.vue'),
    name: 'SSOLogin',
    meta: {
      hidden: true,
      title: t('router.login'),
      noTagsView: true
    }
  },
  {
    path: '/social-login',
    component: () => import('@/views/Login/SocialLogin.vue'),
    name: 'SocialLogin',
    meta: {
      hidden: true,
      title: t('router.socialLogin'),
      noTagsView: true
    }
  },
  {
    path: '/403',
    component: () => import('@/views/Error/403.vue'),
    name: 'NoAccess',
    meta: {
      hidden: true,
      title: '403',
      noTagsView: true
    }
  },
  {
    path: '/404',
    component: () => import('@/views/Error/404.vue'),
    name: 'NoFound',
    meta: {
      hidden: true,
      title: '404',
      noTagsView: true
    }
  },
  {
    path: '/500',
    component: () => import('@/views/Error/500.vue'),
    name: 'Error',
    meta: {
      hidden: true,
      title: '500',
      noTagsView: true
    }
  },
  {
    path: '/bpm',
    component: Layout,
    name: 'bpm',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'manager/form/edit',
        component: () => import('@/views/bpm/form/editor/index.vue'),
        name: 'BpmFormEditor',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '设计流程表单',
          activeMenu: '/bpm/manager/form'
        }
      },
      {
        path: 'manager/model/edit',
        component: () => import('@/views/bpm/model/editor/index.vue'),
        name: 'BpmModelEditor',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '设计流程',
          activeMenu: '/bpm/manager/model'
        }
      },
      {
        path: 'manager/simple/workflow/model/edit',
        component: () => import('@/views/bpm/simpleWorkflow/index.vue'),
        name: 'SimpleWorkflowDesignEditor',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '仿钉钉设计流程',
          activeMenu: '/bpm/manager/model'
        }
      },
      {
        path: 'manager/definition',
        component: () => import('@/views/bpm/definition/index.vue'),
        name: 'BpmProcessDefinition',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '流程定义',
          activeMenu: '/bpm/manager/model'
        }
      },
      {
        path: 'process-instance/detail',
        component: () => import('@/views/bpm/processInstance/detail/index.vue'),
        name: 'BpmProcessInstanceDetail',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '流程详情',
          activeMenu: '/bpm/task/my'
        }
      },
      {
        path: 'oa/leave/create',
        component: () => import('@/views/bpm/oa/leave/create.vue'),
        name: 'OALeaveCreate',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '发起 OA 请假',
          activeMenu: '/bpm/oa/leave'
        }
      },
      {
        path: 'oa/leave/detail',
        component: () => import('@/views/bpm/oa/leave/detail.vue'),
        name: 'OALeaveDetail',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '查看 OA 请假',
          activeMenu: '/bpm/oa/leave'
        }
      },
      {
        path: 'oapurchase/create',
        component: () => import('@/views/bpm/oapurchase/create.vue'),
        name: 'OAPurchaseCreate',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '发起 采购',
          activeMenu: '/bpm/oapurchase'
        }
      },
      {
        path: 'oapurchase/detail',
        component: () => import('@/views/bpm/oapurchase/detail.vue'),
        name: 'OAPurchaseDetail',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '查看 采购',
          activeMenu: '/bpm/oapurchase'
        }
      },
      {
        path: 'oasupply/create',
        component: () => import('@/views/bpm/oasupply/create.vue'),
        name: 'OASupplyCreate',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '物品 领用',
          activeMenu: '/bpm/oasupply'
        }
      },
      {
        path: 'oasupply/detail',
        component: () => import('@/views/bpm/oasupply/detail.vue'),
        name: 'OASupplyDetail',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '查看 领用记录',
          activeMenu: '/bpm/oasupply'
        }
      },
      {
        path: 'oameeting/create',
        component: () => import('@/views/bpm/oameeting/create.vue'),
        name: 'OAMeetingCreate',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '会议申请',
          activeMenu: '/bpm/oameeting'
        }
      },
      {
        path: 'oameeting/detail',
        component: () => import('@/views/bpm/oameeting/detail.vue'),
        name: 'OAMeetingDetail',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '查看 会议',
          activeMenu: '/bpm/oameeting'
        }
      },
      {
        path: 'oaclock/create',
        component: () => import('@/views/bpm/oaclock/create.vue'),
        name: 'OAClockCreate',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '打卡',
          activeMenu: '/bpm/oaclock'
        }
      },
      {
        path: 'oaclock/detail',
        component: () => import('@/views/bpm/oaclock/detail.vue'),
        name: 'OAClockDetail',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '打卡详情',
          activeMenu: '/bpm/oaclock'
        }
      }
    ]
  },
  {
    path: '/mall/product', // 商品中心
    component: Layout,
    name: 'ProductCenter',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'spu/add',
        component: () => import('@/views/mall/product/spu/form/index.vue'),
        name: 'ProductSpuAdd',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          icon: 'ep:edit',
          title: '商品添加',
          activeMenu: '/mall/product/spu'
        }
      },
      {
        path: 'spu/edit/:id(\\d+)',
        component: () => import('@/views/mall/product/spu/form/index.vue'),
        name: 'ProductSpuEdit',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          icon: 'ep:edit',
          title: '商品编辑',
          activeMenu: '/mall/product/spu'
        }
      },
      {
        path: 'spu/detail/:id(\\d+)',
        component: () => import('@/views/mall/product/spu/form/index.vue'),
        name: 'ProductSpuDetail',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          icon: 'ep:view',
          title: '商品详情',
          activeMenu: '/mall/product/spu'
        }
      },
      {
        path: 'property/value/:propertyId(\\d+)',
        component: () => import('@/views/mall/product/property/value/index.vue'),
        name: 'ProductPropertyValue',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          icon: 'ep:view',
          title: '商品属性值',
          activeMenu: '/product/property'
        }
      }
    ]
  },
  {
    path: '/mall/trade', // 交易中心
    component: Layout,
    name: 'TradeCenter',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'order/detail/:id(\\d+)',
        component: () => import('@/views/mall/trade/order/detail/index.vue'),
        name: 'TradeOrderDetail',
        meta: { title: '订单详情', icon: 'ep:view', activeMenu: '/mall/trade/order' }
      },
      {
        path: 'after-sale/detail/:id(\\d+)',
        component: () => import('@/views/mall/trade/afterSale/detail/index.vue'),
        name: 'TradeAfterSaleDetail',
        meta: { title: '退款详情', icon: 'ep:view', activeMenu: '/mall/trade/after-sale' }
      }
    ]
  },
  {
    path: '/member',
    component: Layout,
    name: 'MemberCenter',
    meta: { hidden: true },
    children: [
      {
        path: 'user/detail/:id',
        name: 'MemberUserDetail',
        meta: {
          title: '会员详情',
          noCache: true,
          hidden: true
        },
        component: () => import('@/views/member/user/detail/index.vue')
      }
    ]
  },
  {
    path: '/pay',
    component: Layout,
    name: 'pay',
    meta: { hidden: true },
    children: [
      {
        path: 'cashier',
        name: 'PayCashier',
        meta: {
          title: '收银台',
          noCache: true,
          hidden: true
        },
        component: () => import('@/views/pay/cashier/index.vue')
      }
    ]
  },
  {
    path: '/diy',
    name: 'DiyCenter',
    meta: { hidden: true },
    component: Layout,
    children: [
      {
        path: 'template/decorate/:id',
        name: 'DiyTemplateDecorate',
        meta: {
          title: '模板装修',
          noCache: true,
          hidden: true,
          activeMenu: '/mall/promotion/diy/template'
        },
        component: () => import('@/views/mall/promotion/diy/template/decorate.vue')
      },
      {
        path: 'page/decorate/:id',
        name: 'DiyPageDecorate',
        meta: {
          title: '页面装修',
          noCache: true,
          hidden: true,
          activeMenu: '/mall/promotion/diy/page'
        },
        component: () => import('@/views/mall/promotion/diy/page/decorate.vue')
      }
    ]
  },
  {
    path: '/crm',
    component: Layout,
    name: 'CrmCenter',
    meta: { hidden: true },
    children: [
      {
        path: 'clue/detail/:id',
        name: 'CrmClueDetail',
        meta: {
          title: '线索详情',
          noCache: true,
          hidden: true,
          activeMenu: '/crm/clue'
        },
        component: () => import('@/views/crm/clue/detail/index.vue')
      },
      {
        path: 'customer/detail/:id',
        name: 'CrmCustomerDetail',
        meta: {
          title: '客户详情',
          noCache: true,
          hidden: true,
          activeMenu: '/crm/customer'
        },
        component: () => import('@/views/crm/customer/detail/index.vue')
      },
      {
        path: 'business/detail/:id',
        name: 'CrmBusinessDetail',
        meta: {
          title: '商机详情',
          noCache: true,
          hidden: true,
          activeMenu: '/crm/business'
        },
        component: () => import('@/views/crm/business/detail/index.vue')
      },
      {
        path: 'contract/detail/:id',
        name: 'CrmContractDetail',
        meta: {
          title: '合同详情',
          noCache: true,
          hidden: true,
          activeMenu: '/crm/contract'
        },
        component: () => import('@/views/crm/contract/detail/index.vue')
      },
      {
        path: 'receivable-plan/detail/:id',
        name: 'CrmReceivablePlanDetail',
        meta: {
          title: '回款计划详情',
          noCache: true,
          hidden: true,
          activeMenu: '/crm/receivable-plan'
        },
        component: () => import('@/views/crm/receivable/plan/detail/index.vue')
      },
      {
        path: 'receivable/detail/:id',
        name: 'CrmReceivableDetail',
        meta: {
          title: '回款详情',
          noCache: true,
          hidden: true,
          activeMenu: '/crm/receivable'
        },
        component: () => import('@/views/crm/receivable/detail/index.vue')
      },
      {
        path: 'contact/detail/:id',
        name: 'CrmContactDetail',
        meta: {
          title: '联系人详情',
          noCache: true,
          hidden: true,
          activeMenu: '/crm/contact'
        },
        component: () => import('@/views/crm/contact/detail/index.vue')
      },
      {
        path: 'product/detail/:id',
        name: 'CrmProductDetail',
        meta: {
          title: '产品详情',
          noCache: true,
          hidden: true,
          activeMenu: '/crm/product'
        },
        component: () => import('@/views/crm/product/detail/index.vue')
      }
    ]
  },
  {
    path: '/ppm',
    component: Layout,
    name: 'ppm',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'purchaseconsignment/create',
        name: 'purchaseconsignmentCreate',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '采购收货',
          activeMenu: 'ppm/purchaseconsignment'
        },
        component: () => import('@/views/ppm/purchaseconsignment/create.vue')
      },

      {
        path: 'purchaseconsignment/detail',
        name: 'purchaseconsignmentDetail',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '采购收货详情',
          activeMenu: 'ppm/purchaseconsignment'
        },
        component: () => import('@/views/ppm/purchaseconsignment/detail.vue')
      },

      {
        path: 'consignmentreturn/create',
        name: 'consignmentreturnCreate',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '采购退货',
          activeMenu: 'ppm/consignmentreturn'
        },
        component: () => import('@/views/ppm/consignmentreturn/create.vue')
      },

      {
        path: 'consignmentreturn/detail',
        name: 'consignmentreturnDetail',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '采购退货详情',
          activeMenu: 'ppm/consignmentreturn'
        },
        component: () => import('@/views/ppm/consignmentreturn/detail.vue')
      },

      {
        path: 'consignmentrefund/create',
        name: 'consignmentrefundCreate',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '采购退货',
          activeMenu: 'ppm/consignmentrefund'
        },
        component: () => import('@/views/ppm/consignmentrefund/create.vue')
      },

      {
        path: 'consignmentrefund/detail',
        name: 'consignmentrefundDetail',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '采购退货详情',
          activeMenu: 'ppm/consignmentrefund'
        },
        component: () => import('@/views/ppm/consignmentrefund/detail.vue')
      },

      {
        path: 'company/companycontact/:companyId',
        component: () => import('@/views/ppm/companycontact/index.vue'),
        name: 'CompanyContact',
        meta: {
          title: '联系人信息',
          noCache: true,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/ppm/company'
        }
      },
      {
        path: 'company/companyfinance/:companyId',
        component: () => import('@/views/ppm/companyfinance/index.vue'),
        name: 'CompanyFinance',
        meta: {
          title: '税务信息',
          noCache: true,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/ppm/company'
        }
      },
      {
        path: 'company/companyproduct/:companyId',
        component: () => import('@/views/ppm/companyproduct/index.vue'),
        name: 'CompanyProduct',
        meta: {
          title: '产品信息',
          noCache: true,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/ppm/company'
        }
      },
      {
        path: 'company/companyqualitycontrol/:companyId',
        component: () => import('@/views/ppm/companyqualitycontrol/index.vue'),
        name: 'CompanyQualityControl',
        meta: {
          title: '质量控制信息',
          noCache: true,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/ppm/company'
        }
      },
      {
        path: 'company/create',
        component: () => import('@/views/ppm/company/create.vue'),
        name: 'BpmCompanyCreate',
        meta: {
          title: '发起供应商流程',
          noCache: true,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/ppm/company'
        }
      },
      {
        path: 'company/detail',
        component: () => import('@/views/ppm/company/detail.vue'),
        name: 'BpmCompanyDetail',
        meta: {
          title: '审批详情',
          noCache: true,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/ppm/company'
        }
      },
      {
        path: 'contract/create',
        component: () => import('@/views/ppm/contract/create.vue'),
        name: 'BpmContractCreate',
        meta: {
          title: '发起合同流程',
          noCache: true,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/ppm/contract'
        }
      },
      {
        path: 'contract/detail',
        component: () => import('@/views/ppm/contract/detail.vue'),
        name: 'BpmContractDetail',
        meta: {
          title: '审批详情',
          noCache: true,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/ppm/contract'
        }
      },
      {
        path: 'contractpayment/create',
        component: () => import('@/views/ppm/contractpayment/create.vue'),
        name: 'BpmContractPaymentCreate',
        meta: {
          title: '发起合同流程',
          noCache: true,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/ppm/contractpayment'
        }
      },
      {
        path: 'contractpayment/detail',
        component: () => import('@/views/ppm/contractpayment/detail.vue'),
        name: 'BpmContractPaymentDetail',
        meta: {
          title: '审批详情',
          noCache: true,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/ppm/contractpayment'
        }
      },
      {
        path: 'contractinvoice/create',
        component: () => import('@/views/ppm/contractinvoice/create.vue'),
        name: 'BpmContractInvoiceCreate',
        meta: {
          title: '发起发票流程',
          noCache: true,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/ppm/contractinvoice'
        }
      },
      {
        path: 'contractinvoice/detail',
        component: () => import('@/views/ppm/contractinvoice/detail.vue'),
        name: 'BpmContractInvoiceDetail',
        meta: {
          title: '审批详情',
          noCache: true,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/ppm/contractinvoice'
        }
      },
      {
        path: 'purchaserequirement/create',
        component: () => import('@/views/ppm/purchaserequirement/create.vue'),
        name: 'BpmRequirementCreate',
        meta: {
          title: '发起供应商流程',
          noCache: true,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/ppm/purchaserequirement'
        }
      },
      {
        path: 'purchaserequirement/detail',
        component: () => import('@/views/ppm/purchaserequirement/detail.vue'),
        name: 'BpmRequirementDetail',
        meta: {
          title: '审批详情',
          noCache: true,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/ppm/purchaserequirement'
        }
      },
      {
        path: 'contractconsignment/create',
        component: () => import('@/views/ppm/contractconsignment/create.vue'),
        name: 'ContractConsignmentFormCreate',
        meta: {
          title: '发起外协出库流程',
          noCache: true,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/ppm/contractconsignment'
        }
      },
      {
        path: 'contractconsignment/detail',
        component: () => import('@/views/ppm/contractconsignment/detail.vue'),
        name: 'ContractConsignmentFormDetail',
        meta: {
          title: '审批详情',
          noCache: true,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/ppm/contractconsignment'
        }
      },

        {
            path: 'contractconsignmentreturn/create',
            component: () => import('@/views/ppm/contractconsignmentreturn/create.vue'),
            name: 'ContractConsignmentFormReturnCreate',
            meta: {
                title: '发起外协退货流程',
                noCache: true,
                hidden: true,
                canTo: true,
                icon: '',
                activeMenu: '/ppm/contractconsignmentreturn'
            }
        },
        {
            path: 'contractconsignmentreturn/detail',
            component: () => import('@/views/ppm/contractconsignmentreturn/detail.vue'),
            name: 'ContractConsignmentFormReturnDetail',
            meta: {
                title: '审批详情',
                noCache: true,
                hidden: true,
                canTo: true,
                icon: '',
                activeMenu: '/ppm/contractconsignmentreturn'
            }
        }
    ]
  },
  {
    path: '/dm',
    component: Layout,
    name: 'dm',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'company/companycontact/:companyId',
        component: () => import('@/views/ppm/companycontact/index.vue'),
        name: 'DMCompanyContact',
        meta: {
          title: '联系人信息',
          noCache: true,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/dm/dmCompany'
        }
      },
      {
        path: 'company/companyfinance/:companyId',
        component: () => import('@/views/ppm/companyfinance/index.vue'),
        name: 'DMCompanyFinance',
        meta: {
          title: '税务信息',
          noCache: true,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/dm/dmCompany'
        }
      },
      {
        path: 'company/companyproduct/:companyId',
        component: () => import('@/views/ppm/companyproduct/index.vue'),
        name: 'DMCompanyProduct',
        meta: {
          title: '产品信息',
          noCache: true,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/dm/dmCompany'
        }
      },
      {
        path: 'company/companyqualitycontrol/:companyId',
        component: () => import('@/views/ppm/companyqualitycontrol/index.vue'),
        name: 'DMCompanyQualityControl',
        meta: {
          title: '质量控制信息',
          noCache: true,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/dm/dmCompany'
        }
      },
      {
        path: 'contractrefund/create',
        component: () => import('@/views/dm/contractrefund/create.vue'),
        name: 'ContractRefundCreate',
        meta: {
          title: '销售退款流程发起',
          noCache: true,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/dm/contractrefund'
        }
      },
      {
        path: 'contractrefund/detail',
        component: () => import('@/views/dm/contractrefund/detail.vue'),
        name: 'ContractRefundDetail',
        meta: {
          title: '销售退款流程详情',
          noCache: true,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/dm/contractrefund'
        }
      },
      {
        path: 'contract/create',
        component: () => import('@/views/dm/contract/create.vue'),
        name: 'DMContractCreate',
        meta: {
          title: '销售合同审批流程发起',
          noCache: true,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/dm/dmContract'
        }
      },
      {
        path: 'contract/detail',
        component: () => import('@/views/dm/contract/detail.vue'),
        name: 'DMContractDetail',
        meta: {
          title: '销售合同审批流程详情',
          noCache: true,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/dm/dmContract'
        }
      },
      {
        path: 'contractpayment/create',
        component: () => import('@/views/dm/contractpayment/create.vue'),
        name: 'DMContractPaymentCreate',
        meta: {
          title: '合同付款流程发起',
          noCache: true,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/dm/contractpayment'
        }
      },
      {
        path: 'contractpayment/detail',
        component: () => import('@/views/dm/contractpayment/detail.vue'),
        name: 'DMContractPaymentDetail',
        meta: {
          title: '合同付款审批详情',
          noCache: true,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/dm/contractpayment'
        }
      },

      {
        path: 'company/create',
        component: () => import('@/views/dm/company/create.vue'),
        name: 'DMBpmCompanyCreate',
        meta: {
          title: '发起客户流程',
          noCache: true,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/dm/company'
        }
      },
      {
        path: 'company/detail',
        component: () => import('@/views/dm/company/detail.vue'),
        name: 'DMBpmCompanyDetail',
        meta: {
          title: '审批详情',
          noCache: true,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/dm/company'
        }
      },

      {
        path: 'contractinvoice/create',
        component: () => import('@/views/dm/contractinvoice/create.vue'),
        name: 'DMBpmContractInvoiceCreate',
        meta: {
          title: '发起发票流程',
          noCache: true,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/dm/contractinvoice'
        }
      },
      {
        path: 'contractinvoice/detail',
        component: () => import('@/views/dm/contractinvoice/detail.vue'),
        name: 'DMBpmContractInvoiceDetail',
        meta: {
          title: '审批详情',
          noCache: true,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/dm/contractinvoice'
        }
      },

      {
        path: 'shippinginstorage/create',
        component: () => import('@/views/dm/shippinginstorage/create.vue'),
        name: 'ShippingInstorageFormCreate',
        meta: {
          title: '发起委托加工入库流程',
          noCache: true,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/dm/shippinginstorage'
        }
      },
      {
        path: 'shippinginstorage/detail',
        component: () => import('@/views/dm/shippinginstorage/detail.vue'),
        name: 'DMShippingInstorageDetail',
        meta: {
          title: '审批详情',
          noCache: true,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/dm/shippinginstorage'
        }
      },
        {
            path: 'shippinginstoragereturn/create',
            component: () => import('@/views/dm/shippinginstoragereturn/create.vue'),
            name: 'ShippingInstorageReturnFormCreate',
            meta: {
                title: '发起委托加工退货流程',
                noCache: true,
                hidden: true,
                canTo: true,
                icon: '',
                activeMenu: '/dm/shippinginstoragereturn'
            }
        },
        {
            path: 'shippinginstoragereturn/detail',
            component: () => import('@/views/dm/shippinginstoragereturn/detail.vue'),
            name: 'DMShippingInstorageReturnDetail',
            meta: {
                title: '审批详情',
                noCache: true,
                hidden: true,
                canTo: true,
                icon: '',
                activeMenu: '/dm/shippinginstoragereturn'
            }
        }


    ]
  },
  {
    path: '/dms',
    component: Layout,
    name: 'DMS',
    meta: { hidden: true },
    children: [
      {
        path: 'maintainapplication/create',
        name: 'MaintainApplicationCreate',
        meta: {
          title: '添加维修申请',
          noCache: true,
          hidden: true,
          canTo: true,
          activeMenu: '/dms/maintainapplication'
        },
        component: () => import('@/views/dms/maintainapplication/create.vue')
      },
      {
        path: 'maintainapplication/detail',
        name: 'MaintainApplicationDetail',
        meta: {
          title: '维修申请详情',
          noCache: true,
          hidden: true,
          canTo: true,
          activeMenu: '/dms/maintainapplication'
        },
        component: () => import('@/views/dms/maintainapplication/detail.vue')
      }
    ]
  },
  {
    path: '/pdm',
    component: Layout,
    name: 'PdmCenter',
    meta: { hidden: true },
    children: [
      {
        path: 'feasibilityDetailNew/detail',
        component: () => import('@/views/pdm/feasibilityDetailNew/detail.vue'),
        name: 'PDMFeasibilityDetailNew',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '技术评估detail',
          activeMenu: '/pdm/feasibilityDetailNew'
        }
      },
      {
        path: 'feasibilityDetailNew/index',
        component: () => import('@/views/pdm/feasibilityDetailNew/index.vue'),
        name: 'PDMFeasibilityDetailList',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '技术评估',
          activeMenu: '/pdm/feasibilityDetailNew'
        }
      },
      {
        path: 'feasibilityTaskNew/index',
        component: () => import('@/views/pdm/feasibilityTaskNew/index.vue'),
        name: 'PDMFeasibilityTaskNew',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '技术评估任务',
          activeMenu: 'pdm/feasibilityTaskNew'
        }
      },
      {
        path: 'processTaskNew/index',
        component: () => import('@/views/pdm/processTaskNew/index.vue'),
        name: 'PDMProcessTaskNew',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '工艺任务',
          activeMenu: 'pdm/processTaskNew'
        }
      },
      {
        path: 'processPlanNew/detail',
        component: () => import('@/views/pdm/processPlanNew/detail.vue'),
        name: 'PDMProcessPlanNew',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '工艺方案详情',
          activeMenu: '/pdm/processPlanNew'
        }
      },
      {
        path: 'processPlanDetail/detail',
        component: () => import('@/views/pdm/processPlanDetail/detail.vue'),
        name: 'PDMProcessPlanDetail',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '工艺详细设计详情',
          activeMenu: '/pdm/processPlanDetail'
        }
      },
      {
        path: 'processPlanNew/processDetail',
        component: () => import('@/views/pdm/processPlanNew/processDetail.vue'),
        name: 'PDMProcessDetail',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '工艺规程详情',
          activeMenu: '/pdm/processDetail'
        }
      },
      {
        path: 'processPlanNew/index',
        component: () => import('@/views/pdm/processPlanNew/index.vue'),
        name: 'PDMProcessPlanNew1',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '工艺方案编制',
          activeMenu: '/pdm/processPlanNew'
        }
      },
      {
        path: 'toolingApply/detail',
        component: () => import('@/views/pdm/toolingApply/detail.vue'),
        name: 'PDMToolingApply',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '工装申请评估详情',
          activeMenu: '/pdm/toolingApply'
        }
      },
      {
        path: 'toolingDetail/detail',
        component: () => import('@/views/pdm/toolingDetail/detail.vue'),
        name: 'PDMToolingDetail',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '工装详细设计详情',
          activeMenu: '/pdm/toolingDetail'
        }
      },
      {
        path: 'processChange/detail',
        component: () => import('@/views/pdm/processChange/detail.vue'),
        name: 'PDMProcessChanageDetail',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '工艺更改单详情',
          activeMenu: '/pdm/processChangeDetail'
        }
      },
      {
        path: 'processSupplement/detail',
        component: () => import('@/views/pdm/processSupplement/detail.vue'),
        name: 'PDMProcessSupplementDetail',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '补加工工艺编制详情',
          activeMenu: '/pdm/processChangeDetail'
        }
      }
    ]
  },
  {
    path: '/operatingterminal',
    name: 'operatingterminal',
    meta: {
      hidden: true,
      title: '操作终端',
      icon: 'ep:platform'
    },
    children: [
      {
        path: 'wms',
        name: 'wms',
        meta: {
          title: 'wms系统'
        },
        children: [
          {
            path: 'operatingterminal4',
            name: 'OperatingTerminal4',
            meta: {
              title: '4工位缓存站',
              noCache: true
            },
            component: () => import('@/views/wms/operatingterminal/operatingterminal4.vue')
          },
          {
            path: 'operatingterminal6',
            name: 'OperatingTerminal6',
            meta: {
              title: '6工位缓存站',
              noCache: true
            },
            component: () => import('@/views/wms/operatingterminal/operatingterminal6.vue')
          },
          {
            path: 'pickerterminal',
            name: 'PickerTerminal',
            meta: {
              title: '拣选工位操作终端',
              noCache: true
            },
            component: () => import('@/views/wms/operatingterminal/pickerterminal.vue')
          },
          {
            path: 'cutterpickerterminal',
            name: 'cutterPickerTerminal',
            meta: {
              title: '刀具拣选工位操作终端',
              noCache: true
            },
            component: () => import('@/views/wms/operatingterminal/cutterpickerterminal.vue')
          },
          {
            path: 'cutterdistributionterminal',
            name: 'cutterdistributionterminal',
            meta: {
              title: '刀具配送工位操作终端',
              noCache: true
            },
            component: () => import('@/views/wms/operatingterminal/cutterdistributionterminal.vue')
          },
          {
            path: 'loadandunloadterminal',
            name: 'LoadAndUnloadTerminal',
            meta: {
              title: '装卸工位操作终端',
              noCache: true
            },
            component: () => import('@/views/wms/operatingterminal/loadandunloadterminal.vue')
          },
          {
            path: 'consignmentandshippingterminal',
            name: 'Consignmentandshippingterminal',
            meta: {
              title: '出入库操作终端',
              noCache: true
            },
            component: () => import('@/views/wms/operatingterminal/consignmentandshippingterminal.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/pms',
    component: Layout,
    name: 'PmsCenter',
    meta: { hidden: true },
    children: [
      {
        path: 'pmsapproval/create',
        component: () => import('@/views/pms/pmsapproval/create.vue'),
        name: 'PMSApprovalCreate',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '立项',
          activeMenu: '/pms/pmsapproval'
        }
      },
      {
        path: 'pmsapproval/detail',
        component: () => import('@/views/pms/pmsapproval/detail.vue'),
        name: 'PMSApprovalDetail',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '立项详情',
          activeMenu: '/pms/pmsapproval'
        }
      },
      {
        path: 'assessment/create',
        component: () => import('@/views/pms/assessment/create.vue'),
        name: 'PMSAssessmentCreate',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '评审',
          activeMenu: '/pms/assessment'
        }
      },
      {
        path: 'assessment/detail',
        component: () => import('@/views/pms/assessment/detail.vue'),
        name: 'PMSAssessmentDetail',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '评审详情',
          activeMenu: '/pms/assessment'
        }
      },
      {
        path: 'plan/create',
        component: () => import('@/views/pms/plan/create.vue'),
        name: 'PMSPlanCreate',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '项目计划审批',
          activeMenu: '/pms/plan'
        }
      },
      {
        path: 'plan/detail',
        component: () => import('@/views/pms/plan/detail.vue'),
        name: 'PMSPlanDetail',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '项目计划详情',
          activeMenu: '/pms/plan'
        }
      }
    ]
  },
  {
    path: '/produceterminal',
    name: 'produceterminal',
    meta: {
      hidden: true,
      title: '操作终端',
      icon: 'ep:platform'
    },
    children: [
      {
        path: 'mcs',
        name: 'mcs',
        meta: {
          title: '生产任务系统'
        },
        children: [
          {
            path: 'taskterminal',
            name: 'taskterminal',
            meta: {
              title: '生产任务系统',
              noCache: true
            },
            component: () => import('@/views/mcs/produceterminal/taskterminal.vue')
          },
          {
            path: 'taskterminalLogin',
            name: 'taskterminalLogin',
            meta: {
              title: '生产任务系统登录',
              noCache: true,
              hidden: true
            },
            component: () => import('@/views/mcs/produceterminal/taskterminalLogin.vue')
          }
        ]
      }
    ]
  },

  {
    path: '/qms',
    component: Layout,
    name: 'qms',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'inspectionsheet/detail',
        component: () => import('@/views/qms/inspectionsheet/detail.vue'),
        name: 'BpmUnqualifiedRegistrationDetail',
        meta: {
          title: '不合格品登记详情',
          noCache: true,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/qms/inspectionsheet'
        }
      },
      // {
      //   path: 'managementsyetem/detail',
      //   component: () => import('@/views/qms/manage/managementsystem/detail.vue'),
      //   name: 'BpmManagementSystemDetail',
      //   meta: {
      //     title: '质量管理体系详情',
      //     noCache: true,
      //     hidden: true,
      //     canTo: true,
      //     icon: '',
      //     activeMenu: '/qms/manage/managementsystem'
      //   }
      // }
    ]
  },

  {
    path: '/inspectionterminal',
    name: 'inspectionterminal',
    meta: {
      hidden: true,
      title: '操作终端',
      icon: 'ep:platform'
    },
    children: [
      {
        path: 'qms',
        name: 'qms',
        meta: {
          title: 'qms系统'
        },
        children: [
          {
            path: 'inspectionterminal',
            name: 'inspectionterminal',
            meta: {
              title: '检验操作终端',
              noCache: true
            },
            component: () => import('@/views/qms/terminal/inspectionterminal.vue')
          },
        ]
      }
    ]
  },


    {
        path: '/mcc',
        component: Layout,
        name: 'mcc',
        meta: {
            hidden: true
        },
        children: [
            {
                path: 'materialconfig/create',
                component: () => import('@/views/mcc/materialconfig/create.vue'),
                name: 'BpmMaterialConfigCreate',
                meta: {
                    title: '物料类型新增',
                    noCache: true,
                    hidden: true,
                    canTo: true,
                    icon: '',
                    activeMenu: '/mcc/materialconfig'
                }
            },
            {
                path: 'materialconfig/detail',
                component: () => import('@/views/mcc/materialconfig/detail.vue'),
                name: 'BpmMaterialConfigDetail',
                meta: {
                    title: '物料类型详情',
                    noCache: true,
                    hidden: true,
                    canTo: true,
                    icon: '',
                    activeMenu: '/mcc/materialconfig'
                }
            }
        ]
    },

]

export default remainingRouter
