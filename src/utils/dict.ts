/**
 * 数据字典工具类
 */
import { useDictStoreWithOut } from '@/store/modules/dict'
import { ElementPlusInfoType } from '@/types/elementPlus'

const dictStore = useDictStoreWithOut()

/**
 * 获取 dictType 对应的数据字典数组
 *
 * @param dictType 数据类型
 * @returns {*|Array} 数据字典数组
 */
export interface DictDataType {
  dictType: string
  label: string
  value: string | number | boolean
  colorType: ElementPlusInfoType | ''
  cssClass: string
}

export interface NumberDictDataType extends DictDataType {
  value: number
}

export const getDictOptions = (dictType: string) => {
  return dictStore.getDictByType(dictType) || []
}

export const getIntDictOptions = (dictType: string): NumberDictDataType[] => {
  // 获得通用的 DictDataType 列表
  const dictOptions: DictDataType[] = getDictOptions(dictType)
  // 转换成 number 类型的 NumberDictDataType 类型
  // why 需要特殊转换：避免 IDEA 在 v-for="dict in getIntDictOptions(...)" 时，el-option 的 key 会告警
  const dictOption: NumberDictDataType[] = []
  dictOptions.forEach((dict: DictDataType) => {
    dictOption.push({
      ...dict,
      value: parseInt(dict.value + '')
    })
  })
  return dictOption
}

export const getStrDictOptions = (dictType: string) => {
  const dictOption: DictDataType[] = []
  const dictOptions: DictDataType[] = getDictOptions(dictType)
  dictOptions.forEach((dict: DictDataType) => {
    dictOption.push({
      ...dict,
      value: dict.value + ''
    })
  })
  return dictOption
}

export const getBoolDictOptions = (dictType: string) => {
  const dictOption: DictDataType[] = []
  const dictOptions: DictDataType[] = getDictOptions(dictType)
  dictOptions.forEach((dict: DictDataType) => {
    dictOption.push({
      ...dict,
      value: dict.value + '' === 'true'
    })
  })
  return dictOption
}

/**
 * 获取指定字典类型的指定值对应的字典对象
 * @param dictType 字典类型
 * @param value 字典值
 * @return DictDataType 字典对象
 */
export const getDictObj = (dictType: string, value: any): DictDataType | undefined => {
  const dictOptions: DictDataType[] = getDictOptions(dictType)
  for (const dict of dictOptions) {
    if (dict.value === value + '') {
      return dict
    }
  }
}

/**
 * 获得字典数据的文本展示
 *
 * @param dictType 字典类型
 * @param value 字典数据的值
 * @return 字典名称
 */
export const getDictLabel = (dictType: string, value: any): string => {
  const dictOptions: DictDataType[] = getDictOptions(dictType)
  const dictLabel = ref('')
  dictOptions.forEach((dict: DictDataType) => {
    if (dict.value === value + '') {
      dictLabel.value = dict.label
    }
  })
  return dictLabel.value
}

export enum DICT_TYPE {
  USER_TYPE = 'user_type',
  COMMON_STATUS = 'common_status',
  TERMINAL = 'terminal', // 终端

  // ========== SYSTEM 模块 ==========
  SYSTEM_USER_SEX = 'system_user_sex',
  SYSTEM_MENU_TYPE = 'system_menu_type',
  SYSTEM_ROLE_TYPE = 'system_role_type',
  SYSTEM_DATA_SCOPE = 'system_data_scope',
  SYSTEM_NOTICE_TYPE = 'system_notice_type',
  SYSTEM_LOGIN_TYPE = 'system_login_type',
  SYSTEM_LOGIN_RESULT = 'system_login_result',
  SYSTEM_SMS_CHANNEL_CODE = 'system_sms_channel_code',
  SYSTEM_SMS_TEMPLATE_TYPE = 'system_sms_template_type',
  SYSTEM_SMS_SEND_STATUS = 'system_sms_send_status',
  SYSTEM_SMS_RECEIVE_STATUS = 'system_sms_receive_status',
  SYSTEM_ERROR_CODE_TYPE = 'system_error_code_type',
  SYSTEM_OAUTH2_GRANT_TYPE = 'system_oauth2_grant_type',
  SYSTEM_MAIL_SEND_STATUS = 'system_mail_send_status',
  SYSTEM_NOTIFY_TEMPLATE_TYPE = 'system_notify_template_type',
  SYSTEM_SOCIAL_TYPE = 'system_social_type',
  SYSTEM_JOB_STATUS = 'system_job_status',

  // ========== INFRA 模块 ==========
  INFRA_BOOLEAN_STRING = 'infra_boolean_string',
  INFRA_JOB_STATUS = 'infra_job_status',
  INFRA_JOB_LOG_STATUS = 'infra_job_log_status',
  INFRA_API_ERROR_LOG_PROCESS_STATUS = 'infra_api_error_log_process_status',
  INFRA_CONFIG_TYPE = 'infra_config_type',
  INFRA_CODEGEN_TEMPLATE_TYPE = 'infra_codegen_template_type',
  INFRA_CODEGEN_FRONT_TYPE = 'infra_codegen_front_type',
  INFRA_CODEGEN_SCENE = 'infra_codegen_scene',
  INFRA_FILE_STORAGE = 'infra_file_storage',
  INFRA_OPERATE_TYPE = 'infra_operate_type',

  // ========== BPM 模块 ==========
  BPM_MODEL_FORM_TYPE = 'bpm_model_form_type',
  BPM_TASK_CANDIDATE_STRATEGY = 'bpm_task_candidate_strategy',
  BPM_PROCESS_INSTANCE_STATUS = 'bpm_process_instance_status',
  BPM_TASK_STATUS = 'bpm_task_status',
  BPM_OA_LEAVE_TYPE = 'bpm_oa_leave_type',
  BPM_PROCESS_LISTENER_TYPE = 'bpm_process_listener_type',
  BPM_PROCESS_LISTENER_VALUE_TYPE = 'bpm_process_listener_value_type',
  BPM_OA_CLOCK_TYPE = 'bpm_oa_clock_type',

  // ========== PAY 模块 ==========
  PAY_CHANNEL_CODE = 'pay_channel_code', // 支付渠道编码类型
  PAY_ORDER_STATUS = 'pay_order_status', // 商户支付订单状态
  PAY_REFUND_STATUS = 'pay_refund_status', // 退款订单状态
  PAY_NOTIFY_STATUS = 'pay_notify_status', // 商户支付回调状态
  PAY_NOTIFY_TYPE = 'pay_notify_type', // 商户支付回调状态
  PAY_TRANSFER_STATUS = 'pay_transfer_status', // 转账订单状态
  PAY_TRANSFER_TYPE = 'pay_transfer_type', // 转账订单状态

  // ========== MP 模块 ==========
  MP_AUTO_REPLY_REQUEST_MATCH = 'mp_auto_reply_request_match', // 自动回复请求匹配类型
  MP_MESSAGE_TYPE = 'mp_message_type', // 消息类型

  // ========== Member 会员模块 ==========
  MEMBER_POINT_BIZ_TYPE = 'member_point_biz_type', // 积分的业务类型
  MEMBER_EXPERIENCE_BIZ_TYPE = 'member_experience_biz_type', // 会员经验业务类型

  // ========== MALL - 商品模块 ==========
  PRODUCT_SPU_STATUS = 'product_spu_status', //商品状态

  // ========== MALL - 交易模块 ==========
  EXPRESS_CHARGE_MODE = 'trade_delivery_express_charge_mode', //快递的计费方式
  TRADE_AFTER_SALE_STATUS = 'trade_after_sale_status', // 售后 - 状态
  TRADE_AFTER_SALE_WAY = 'trade_after_sale_way', // 售后 - 方式
  TRADE_AFTER_SALE_TYPE = 'trade_after_sale_type', // 售后 - 类型
  TRADE_ORDER_TYPE = 'trade_order_type', // 订单 - 类型
  TRADE_ORDER_STATUS = 'trade_order_status', // 订单 - 状态
  TRADE_ORDER_ITEM_AFTER_SALE_STATUS = 'trade_order_item_after_sale_status', // 订单项 - 售后状态
  TRADE_DELIVERY_TYPE = 'trade_delivery_type', // 配送方式
  BROKERAGE_ENABLED_CONDITION = 'brokerage_enabled_condition', // 分佣模式
  BROKERAGE_BIND_MODE = 'brokerage_bind_mode', // 分销关系绑定模式
  BROKERAGE_BANK_NAME = 'brokerage_bank_name', // 佣金提现银行
  BROKERAGE_WITHDRAW_TYPE = 'brokerage_withdraw_type', // 佣金提现类型
  BROKERAGE_RECORD_BIZ_TYPE = 'brokerage_record_biz_type', // 佣金业务类型
  BROKERAGE_RECORD_STATUS = 'brokerage_record_status', // 佣金状态
  BROKERAGE_WITHDRAW_STATUS = 'brokerage_withdraw_status', // 佣金提现状态

  // ========== MALL - 营销模块 ==========
  PROMOTION_DISCOUNT_TYPE = 'promotion_discount_type', // 优惠类型
  PROMOTION_PRODUCT_SCOPE = 'promotion_product_scope', // 营销的商品范围
  PROMOTION_COUPON_TEMPLATE_VALIDITY_TYPE = 'promotion_coupon_template_validity_type', // 优惠劵模板的有限期类型
  PROMOTION_COUPON_STATUS = 'promotion_coupon_status', // 优惠劵的状态
  PROMOTION_COUPON_TAKE_TYPE = 'promotion_coupon_take_type', // 优惠劵的领取方式
  PROMOTION_ACTIVITY_STATUS = 'promotion_activity_status', // 优惠活动的状态
  PROMOTION_CONDITION_TYPE = 'promotion_condition_type', // 营销的条件类型枚举
  PROMOTION_BARGAIN_RECORD_STATUS = 'promotion_bargain_record_status', // 砍价记录的状态
  PROMOTION_COMBINATION_RECORD_STATUS = 'promotion_combination_record_status', // 拼团记录的状态
  PROMOTION_BANNER_POSITION = 'promotion_banner_position', // banner 定位

  // ========== CRM - 客户管理模块 ==========
  CRM_AUDIT_STATUS = 'crm_audit_status', // CRM 审批状态
  CRM_BIZ_TYPE = 'crm_biz_type', // CRM 业务类型
  CRM_RECEIVABLE_RETURN_TYPE = 'crm_receivable_return_type', // CRM 回款的还款方式
  CRM_CUSTOMER_INDUSTRY = 'crm_customer_industry',
  CRM_CUSTOMER_LEVEL = 'crm_customer_level',
  CRM_CUSTOMER_SOURCE = 'crm_customer_source',
  CRM_PRODUCT_STATUS = 'crm_product_status',
  CRM_PERMISSION_LEVEL = 'crm_permission_level', // CRM 数据权限的级别
  CRM_PRODUCT_UNIT = 'crm_product_unit', // 产品单位
  CRM_FOLLOW_UP_TYPE = 'crm_follow_up_type', // 跟进方式

  // ========== ERP - 企业资源计划模块  ==========
  ERP_AUDIT_STATUS = 'erp_audit_status', // ERP 审批状态
  ERP_STOCK_RECORD_BIZ_TYPE = 'erp_stock_record_biz_type', // 库存明细的业务类型

  CONSIGNMENT_STATUS = 'consignment_status',//采购状态
  CONSIGNMENT_TYPE = 'consignment_type',//收货类型
  PPM_PROCUREMENT_STATUS = 'ppm_procurement_status',//采购 收货审批状态
  CONSIGNMENT_RETURN_TYPE='consignment_return_type',//采购退货类型
  PPM_AUDIT_STATUS='ppm_audit_status',//采购审批状态
  CONSIGNMENT_RETURN_STATUS='consignment_return_status',//采购系统 退货状态
  PPM_EXCEPTION_HANDLE_STATUS='ppm_exception_handle_status',
  PPM_EXCEPTION_HANDLE_RESULT='ppm_exception_handle_result',
  PPM_EXCEPTION_REASON='ppm_exception_reason',
  // ========== WMS - 仓库管理模块global status  ==========
  WMS_ENABLE_STOP_TYPE = 'wms_enable_stop_type', // 启用停用类型
  INFRA_BOOLEAN_TINYINT = 'infra_boolean_tinyint', // 是否

  // ========== WMS - 仓库管理模块  ==========
  WMS_WAREHOUSE_TYPE = 'wms_warehouse_type', // 仓库类型
  WMS_WAREHOUSE_NATURE = 'wms_warehouse_nature', // 仓库性质
  WMS_WAREHOUSE_AREA_PROPERTY = 'wms_warehouse_area_property', // 库区属性
  WMS_WAREHOUSE_AREA_TYPE = 'wms_warehouse_area_type', // 库区类型
  WMS_MATERIAL_TYPE_PROPERTIES = 'wms_material_type_properties', // 物料属性（成品、毛坯、辅助材料）
  WMS_MATERIAL_TYPE = 'wms_material_type', // 物料类型（零件、托盘、工装、夹具、刀具）
  WMS_CONTAINER_TYPE = 'wms_container_type', // 托盘类型（刀具托盘、大托盘、小托盘）
  WMS_MATERIALTYPE_MATERIALMODE = 'wms_materialType_MaterialMode', // 物料管理模式(单件、批量)
  WMS_MATERIAL_TYPE_OUTBOUNDRULES = 'wms_material_type_outboundRules', //出库规则(先进先出、先进后出)

  // ========== WMS - 库存管理模块  ==========
  WMS_BIND_TYPE = 'wms_bind_type', // 物料绑定位置类型
  WMS_MOVE_TYPE = 'wms_move_type', // 移库单类型
  WMS_MOVE_STATE = 'wms_move_state', // 移库单状态
  WMS_CHECK_STATUS = 'wms_check_status', // 盘点单状态
  WMS_CHECK_DETAIL_STATUS = 'wms_check_detail_status', // 盘点单明细状态
  WMS_ALARM_STATE = 'wms_alarm_state', // 告警状态
  WMS_ALARM_TYPE = 'wms_alarm_type', // 告警类型
  WMS_ALARM_LEVEL = 'wms_alarm_level', // 告警级别
  MATERIAL_MAINTENANCE_TYPE = 'material_maintenance_type', // 物料维护类型

  // ========== DC - 数据采集模块  ==========
  DC_DEVICE_STATUS = 'dc_device_status', // 物料绑定位置类型
  DC_COMM_TYPE = "dc_comm_type",
  DC_ONLINE_STATUS = "dc_online_status",
  DC_NORM_STATUS = "dc_norm_status",
  COLLECT_ATTRIBUTES_TYPE = "collect_attributes_type",
  DC_ATTRIBUTES_DEVICE_STATUS = "attributes_device_status",
  DC_COLLECT_ATTRIBUTES = "dc_collect_attributes_type",
  COLLECT_ATTRIBUTES_ILK = "dc_collect_attributes_ilk",
  DC_COLLECT_STATE = "dc_collect_state",

  // ========== WMS - 出入库管理模块  ==========
  WMS_IN_TYPE = 'wms_in_type', // 入库类型
  WMS_OUT_TYPE = 'wms_out_type', // 出库类型
  WMS_IN_STATE = 'wms_in_state', // 入库单状态
  WMS_OUT_STATE = 'wms_out_state', // 入库单状态

  // ============ WMS - 指令管理模块 ===========
  WMS_INSTRUCTION_TYPE = 'wms_instruction_type', // 指令类型
  WMS_INSTRUCTION_STATUS = 'wms_instruction_status', // 指令状态
  WMS_TASK_INS = 'wms_task_ins', // 指令类型

  // ============ WMS - 搬运任务模块 ============
  WMS_CARRY_TASK_STATUS = 'wms_carry_task_status', // 任务状态(挂起0、未开始1、进行中2、已完成3、已取消4)
  WMS_CARRY_SUB_TASK_STATUS = 'wms_carry_sub_task_status', // 任务状态(挂起0、未开始1、已下发2、进行中3、已完成4、已取消5)
  WMS_CARRY_TASK_TYPE = 'wms_carry_task_type', // 任务类型(入库搬运0、出库搬运1、库存调整2、呼叫AGV3)
  WMS_MODE = 'wms_mode', // 任务模式 手动 自动
  WMS_AGV_STATUS = 'wms_agv_status', // AGV 状态

  // ========== PDM - 设计数据接收模块  ==========
  PDM_FILE_TYPE = 'pdm_file_type', // 数据包结构定义-文件类型
  PDM_CONTENT_TYPE = 'pdm_content_type', // 数据包结构定义-excel内容类型

  // ========== DM - 销售系统模块  ==========
  DM_AUDIT_STATUS = 'dm_audit_status', // 销售系统 审批状态
  SHIPPING_STATUS = 'shipping_status', // 销售系统 发货状态
  SHIPPING_RETURN_STATUS = 'shipping_return_status', // 销售系统 退货状态
  RETURN_TYPE='return_type',//销售退货类型
  DM_REFUND_STATUS='dm_refund_status',//退款状态
  SHIPPING_TYPE = 'shipping_type',// 发货类型

  // ========== PPM - 采购管理模块  ==========
  PD_COMPANY_INDUSTRY_CLASSIFICATION = 'pd_company_industry_classification', // 公司行业分类
  PD_COMPANY_TYPE = 'pd_company_type', // 公司类型
  PD_COMPANY_STATUS = 'pd_company_status', // 公司状态
  PD_COMPANY_FIRM_SIZE = 'pd_company_firm_size', // 公司规模
  PD_COMPANY_TAXPAYER = 'pd_company_taxpayer', // 纳税人资质
  PD_COMPANY_SUPPLY_TYPE = 'pd_company_supply_type', // 供求类型
  PD_COMPANY_QUALITY_CONTROL_QMSC = 'pd_company_quality_control_qmsc',  // 质量管理体系认证
  PD_COMPANY_QUALITY_CONTROL_INSPECTION = 'pd_company_quality_control_inspection', // 是否专职检验
  PD_COMPANY_QUALITY_CONTROL_NONCONFORMING_CONTROL = 'pd_company_quality_control_nonconforming_control', // 是否不合格品控制
  PD_COMPANY_QUALITY_CONTROL_PRODUCTION_TRACEABILITY = 'pd_company_quality_control_production_traceability', // 生产可追溯
  PD_COMPANY_QUALITY_CONTROL_PURCHASING_CONTROL = 'pd_company_quality_control_purchasing_control', // 是否采购质量控制
  PD_COMPANY_QUALITY_CONTROL_OQC = 'pd_company_quality_control_oqc', // 出厂质量控制
  PD_FINANCE_PAY_METHOD = 'pd_finance_pay_method', // 付款方式
  PD_CONTRACT_TYPE = 'pd_contract_type', // 合同类型
  PD_CONTRACT_DELIVERY = 'pd_contract_delivery', // 交货方式
  CURRENCY_TYPE = 'currency_type', // 币种
  VAT_TYPE = 'vat_type', // 币种
  CONTRACT_AUDIT_STATUS = 'contract_audit_status', // 币种
  PD_CONTRACT_STATUS = 'pd_contract_status',
  PD_CONTRACT_PROGRESS_STATUS = 'contract_progress_status',
  PD_HEADER = 'pd_header', //是否是部门负责人
  PD_PRODUCT_DEFAULT_TAX_RATE = 'pd_product_default_tax_rate', // 产品默认税率
  PD_PAYMENT_CONTROL = 'pd_payment_control', // 结算方式
  PD_PRODUCT_QUALITY_CHECK = 'pd_product_quality_check', // 是否免检
  TRANSPORT_WAY = 'transport_way',//运输方式
  PD_CONTRACT_INVOICE_TYPE = 'pd_contract_invoice_type', // 发票类型
  CONTRACT_PAYMENT_AUDIT_STATUS = 'contract_payment_audit_status', // 支付审批状态
  CONTRACT_INVOICE_AUDIT_STATUS = 'contract_invoice_audit_status', // 发票审批状态
  COMPANY_AUDIT_STATUS = 'company_audit_status', // 发票审批状态
  PPM_REFUND_STATUS= 'ppm_refund_status',//采购退款状态
  PPM_REQUIREMENT_TYPE= 'ppm_requirement_type',// 采购类型
  PPM_REQUIREMENT_SOURCE_TYPE= 'ppm_requirement_source_type',// 源单类型
  PM_REQUIREMENT_AUDIT_STATUS = 'pm_requirement_audit_status', // 发票审批状态
  PM_MATERIAL_STATUS = 'material_status', // 物料状态
  PD_CONTRACT_TYPE_FOR = 'contract_type', // 合同分类
  PPM_LEAD_STATUS = 'lead_status', // 采购交付状态
  // ==========QMS 质量分析模块  ==========
  QMS_INSPECTION_TYPE="qms_inspection_type",//检测方式
  QMS_INSPECTION_TOOL="qms_inspection_tool",//检测工具
  QMS_REFERENCE_TYPE="qms_reference_type",//参考值判断条件
  QMS_SCHEME_TYPE="qms_scheme_type",//方案类型
  QMS_IS_EFFECTIVE="qms_is_effective",//是否生效
  QMS_SAMPLING_RULE_TYPE="sampling_rule_type",//抽样类型
  QMS_SAMPLE_SIZE_CODE="sample_size_code",//抽样数字码
  QMS_INSPECTION_LEVEL_TYPE="inspection_level_type",//检验水平类型
  QMS_SAMPLING_LIMIT_TYPE="sampling_limit_type",//抽样准则

  QMS_INSPECTION_SHEET_STATUS = 'qms_inspection_sheet_status', // 检验单状态
  QMS_INSPECTION_SHEET_SCHEME_STATUS = 'qms_inspection_sheet_scheme_status', // 检验任务状态
  QMS_NEED_FIRST_INSPECTION = 'qms_need_first_inspection', // 是否首检
  QMS_INSPECTION_SHEET_TYPE = 'qms_inspection_sheet_type', // 检验类型
  QMS_ASSIGNMENT_TYPE = 'qms_assignment_type', // 分配类型
  QMS_INSPECTION_RESULT = 'qms_inspection_result', // 检验结果
  QMS_SELF_INSPECTION = 'qms_self_inspection', // 是否自检
  QMS_HANDLE_METHOD = 'qms_handle_method', // 处理方式
  QMS_MANAGEMENT_DATABASE_TYPE = 'qms_management_database_type', // 质量管理资料库
  QMS_MANAGEMENT_DATABASE_STATUS = 'qms_management_database_status', // 启用状态
  QMS_INSPECTION_TOOL_STATUS = 'qms_inspection_tool_status', // 启用状态
  QMS_DEFECTIVE_LEVEL = 'qms_defective_level', // 启用状态
  QMS_INSPECTION_TOOL_VERIFICATION_STATUS = 'qms_inspection_tool_verification_status', // 检测工具送检状态
  QMS_INSPECTION_SHEET_SOURCE_TYPE = 'qms_inspection_sheet_source_type', // 检测单来源类型
  QMS_INSPECTION_SHEET_GENERATE_TASK_STATUS = 'qms_inspection_sheet_generate_task_status', // 检测工具送检状态


  // ========== PDM - 技术评估模块  ==========
  PDM_FEASIBILITY_TASK_STATUS = 'pdm_feasibility_task_status', // 技术评估任务-状态
  PDM_FEASIBILITY_STAUS = 'pdm_feasibility_status', // 技术评估-状态
  PDM_FEASIBILITY_RESULT = 'pdm_feasibility_result', // 技术评估-评估结果

  // ========== PDM - 工艺路线模块  ==========
  PDM_PROCESS_TASK_STATUS = 'pdm_process_task_status', // 工艺路线-状态
  PDM_PROCESS_ROUTE = 'pdm_process_route', // 典型工艺路线

  // ========== PDM - 产品数据对象模块  ==========
  PDM_DATAOBJECT_TYPE = 'pdm_dataobject_type', // 产品数据对象模块-类型
  PDM_DATAOBJECT_IS_VALUE = 'pdm_dataobject_is_value',//产品数据对象模块-是否多值
  PDM_FEASIBILITY_TAPER_TYPE = 'pdm_feasibility_taper_type',//刀柄型式

  // ========== PDM - 工艺线路管理模块  ==========
  PDM_PROCESSPLAN_STATUS = 'pdm_processplan_status', // 工艺线路管理模块-状态
  PDM_PROCESSPLAN_PROPERTY = 'pdm_processplan_property', // 工艺线路管理模块-关重属性
  // ========== PDM - 工艺规程模块  ==========
  PDM_PROCESS_VERSION_STATUS = 'pdm_process_version_status', //工艺规程模块-状态
  PDM_PROCEDURE_ISINSPECT = 'pdm_procedure_isInspect', // 工艺规程模块-工序-是否检验
  PDM_PROCEDURE_INSPECT_TYPE = 'pdm_procedure_inspect_type', // 工序-检验类型
  PDM_PROCEDURE_ISOUT = 'pdm_procedure_isOut',//工艺规程模块-是否外委
  PDM_PROCESS_TYPE = 'pdm_process_type', // 工艺规程模块-工序类型
  PDM_STEP_SLOT_NUMBER = 'pdm_step_slot_number', //工艺规程模块-工序槽位
  PDM_PROCESS_CHANGE_ORDER_STATUS = 'pdm_process_change_order_status', //工艺更改单状态
  PDM_CATEGORY_TYPE = 'pdm_category_type', // 工艺规程模块-工步自定义属性类型
  PDM_IS_MULTVALUES = 'pdm_is_multvalues', // 工序-是否多值 = // 是否生效
  PDM_PROCESS_CHANGE_REASION = 'pdm_process_change_reason', //工艺更改原因
  PDM_PROCESS_SUPPLEMENT_STATUS = 'pdm_process_supplement_status', //补加工工艺规程状态

  // ========== PDM - 工装设计模块  ==========
  PDM_STATUS = 'pdm_status',
  PDM_TOOLING_APPLY_REASON = 'pdm_tooling_apply_reason', // 工装申请原因
  PDM_TOOLING_APPLY_PROCESS_TYPE = 'pdm_tooling_apply_process_type', // 工装加工类型
  PDM_TOOLING_STYLE = 'pdm_tooling_style', // 工装形式

  // ========== MCS模块  ==========
  DMS_DEVICE_STATUS = 'dms_device_status', // 设备状态
  DMS_MAINTENANCE_TYPE = 'dms_maintenance_type', // 设备保养维护类型
  DMS_MAINTENANCE_STATUS = 'dms_maintenance_status', // 设备保养维护完成状态
  DMS_DEVICE_TYPE_ENABLE = 'dms_device_type_enable', // 设备类型是否启用
  DMS_INSPECTION_TYPE = 'dms_inspection_type', // 设备检查类型
  DMS_INSPECTION_PLAN_NOTICE = 'dms_inspection_plan_notice', // 设备检查计划提醒状态
  INSPECTION_RECORD_STATUS = 'inspection_record_status', // 设备检查记录状态
  DMS_EXPIRATION_SHUTDOWN = 'dms_expiration_shutdown', //设备计划、记录：是否超期停机
  DMS_LINE_STATION_GROUP = 'dms_line_station_group', // 产线/工位组

  ENABLE_STATUS = 'enableStatus', // 启用状态
  // ========== pms - 项目管理模块  ==========
  PMS_ASSESSMENT_TYPE = 'pms_assessment_type',//是否评估
  PMS_PROJECT_TYPE = 'pms_project_type',//项目类型
  PMS_PROCESS_TYPE = 'pms_process_type',//带料加工
  PMS_ASSESSMENT_REASON = 'pms_assessment_reason',//评估发起原因
  PMS_ASSESSMENT_CATEGORY = 'pms_assessment_category',//评估类型
  PMS_ASSESSMENT_STATUS = 'pms_assessment_status',//评估状态
  PMS_ASSESSMENT_CONCLUSION = 'pms_assessment_conclusion',//评估结论
  PMS_PROJECT_STATUS = 'pms_project_status', //项目状态
  PMS_ASSESSMENT_PURCHASE_TYPE = 'pms_assessment_purchase_type',//采购类型，已有和需采购,
  PMS_PLAN_MATERIAL_PURCHASE_CLASSIFICATION ='pms_plan_material_purchase_classification',//物料采购计划采购分类
  PMS_ORDER_STATUS = 'pms_order_status',//订单状态
  PMS_ORDER_TYPE = 'pms_order_type',//订单类型
  PMS_PLAN_ITEM_TYPE = 'pms_plan_item_type',//子计划类型
  PMS_MATERIAL_STATUS = 'pms_material_status',//项目物料状态
  PMS_ORDER_OUTSOURCE = 'pms_order_outsource',//整单外协

  // ========== PDM - 工装设计模块  ==========
  PDM_TOOLING_TASK_STATUS = 'pdm_tooling_task_status', // 工装设计-状态


  // ========== MCC编码模块  ==========
  MCC_SERVICE_CODE='service_code',//服务编码
  MCC_RULE_TYPE='rule_type',//编码规则
  MCC_ENCODING_TYPE='encoding_type',//编码位类型
  MCC_ENABLE_STATUS='mcc_enable_status',//启用状态
  MCC_ENCODING_ATTRIBUTE='encoding_attribute',//编码属性
  MCC_ENCODING_PROPERTY='encoding_property',//编码归类
  MCC_ENCODING_RULE_TYPE='encoding_rule_type',//编码归类
  MCC_AUTO_RELEASE='auto_release',//编码归类
  MCC_RECORD_STATUS='mcc_record_status',//编码归类

  // ========== ES编码模块  ==========
  ES_STATUS = "es_status",
  ES_AUTOMATIC = "es_automatic",
  ES_SYNC = "es_sync",




  TOOL_CONFIG_STATUS = 'tool_config_status', // 刀具类型状态
  TOOL_PARAM_TEMPLATE_STATUS= 'tool_param_template_status', // 刀具类型状态

  // ========== 刀具管控中心 模块 ==========
  KNIFETOOL_CATEGORY_TYPE = 'knifetool_category_type',
  KNIFETOOL_STATUS_TYPE = 'knifetool_status_type',
  KNIFETOOL_BRAND = 'tool_brand',
  KNIFETOOL_CUTTER_TYPE = 'cutter_type',
  KNIFETOOL_HILT_AXIS = 'cutter_hilt_axis',
  KNIFETOOL_CUTTER_MATERIAL = 'cutter_material',
  KNIFETOOL_CUTTER_PROCESS_MATERIAL = 'cutter_process_material',
  KNIFETOOL_PRODUCTION_LINE = 'production_line',
  KNIFETOOL_WORK_STATION = 'work_station',
  KNIFETOOL_WAREHOUSE_TYPE = 'warehouse_type',

  // 报废
  TOOL_SCRAP_TYPE='tool_scrap_type',
  APPROVE_STATUS = 'approve_status',


  // 刀具装备
  PARTS_ADAPTATION_PRODUCTION_LINE='equipment_list',
  //日历状态
  CALENDAR_STATUS ='calendar_status',


  //========== tms 刀具管理 模块 ==========
  TOOL_RECORD_TYPE = 'tool_record_type',
  ASSEMBLE_STATUS = 'assemble_status',
  ASSEMBLE_TASK_STATUS = 'assemble_task_status',
  ASSEMBLE_RECORD_TYPE = 'assemble_record_type',
}
