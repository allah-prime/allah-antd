function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
export var FileUpload2BusiScene = /*#__PURE__*/function (FileUpload2BusiScene) {
  FileUpload2BusiScene["CYCM_BUSINESS_ACTIVITIES"] = "c_1";
  FileUpload2BusiScene["CYCM_SUPPLIER_EVAL_REC_REPORT_IMG"] = "c_2";
  FileUpload2BusiScene["CYCM_SUPPLIER_EVAL_REC_ON_SITE_MEDIA"] = "c_3";
  FileUpload2BusiScene["CYCM_ESULT_REC_DETECT_BUSINESS_LICENSE"] = "c_4";
  FileUpload2BusiScene["CYCM_RESULT_REC_DETECT_QUALIFICATION"] = "c_5";
  FileUpload2BusiScene["CYCM_RESULT_REC_TEST_RESULT"] = "c_6";
  FileUpload2BusiScene["CYCM_LEFT_SAMPLE_REC_FOOD_IMG"] = "c_7";
  FileUpload2BusiScene["CYCM_PEST_CONTROL_PROCESS_IMG"] = "c_8";
  FileUpload2BusiScene["CYCM_PRODUCTION_FEED_IMG"] = "c_9";
  FileUpload2BusiScene["CYCM_FOOD_DISH_DISINFECT_IMG"] = "c_10";
  FileUpload2BusiScene["CYCM_WATER_TEST_RESULT_ATTACH"] = "c_11";
  FileUpload2BusiScene["CYCM_OUT_PRODUCTION_TEST_RESULT_ATTACH"] = "c_12";
  FileUpload2BusiScene["CYCM_AIR_QUALITY_MONITOR_OTHER_ATTACH"] = "c_13";
  FileUpload2BusiScene["CYCM_PRINCIPAL_DUTY_RECORD"] = "c_14";
  FileUpload2BusiScene["CYCM_PRINCIPAL_DUTY_RECORD_OTHER_ATTACH"] = "c_15";
  FileUpload2BusiScene["CYCM_FEATURE_DISH_IMG"] = "c_16";
  FileUpload2BusiScene["CYCM_LEARNING_SPACE_TRAINING"] = "c_17";
  FileUpload2BusiScene["CYCM_LEARNING_SPACE_SALES_RECORD"] = "c_18";
  FileUpload2BusiScene["CYCM_TRANSPORT_CARRIER_QUALIFICATION"] = "c_19";
  FileUpload2BusiScene["CYCM_SAMPLE_TEST_RESULT_ATTACH"] = "c_20";
  FileUpload2BusiScene["CYCM_STOCK_CONVERT_ATTACH"] = "c_21";
  FileUpload2BusiScene["CYCM_SAFETY_RISK_SCENE_RECORD"] = "c_22";
  FileUpload2BusiScene["CYCM_GARBAGE_HANDLING_SIGN"] = "c_23";
  FileUpload2BusiScene["CYCM_GARBAGE_HANDLING_RECEIVE_SIGN"] = "c_24";
  FileUpload2BusiScene["CYCM_GARBAGE_HANDLING_TRANSFER_SIGN"] = "c_25";
  FileUpload2BusiScene["CYCM_DELEGATE_PRODUCTION_CONTRACT"] = "c_26";
  FileUpload2BusiScene["CYCM_DELEGATE_PRODUCTION_BUSINESS_LICENSE"] = "c_27";
  FileUpload2BusiScene["CYCM_DELEGATE_PRODUCTION_TRUSTEE_BUSINESS_LICENSE"] = "c_28";
  FileUpload2BusiScene["CYCM_PUBLICITY_BAR_IMG"] = "c_29";
  FileUpload2BusiScene["CYCM_PRODUCTION_SUPERVISION_SIGN"] = "c_30";
  FileUpload2BusiScene["CYCM_PRODUCTION_SUPERVISION_TRUSTEE_SIGN"] = "c_31";
  FileUpload2BusiScene["CYCM_PRODUCTION_SUPERVISION_RELATED_PROOF"] = "c_32";
  FileUpload2BusiScene["CYCM_ADDITIVE_USE_SIGN"] = "c_33";
  FileUpload2BusiScene["CYCM_ADDITIVE_USE_REVIEW_SIGN"] = "c_34";
  FileUpload2BusiScene["CYCM_UNQUALIFIED_DISPOSAL_RECORD_RELATED_PROOF"] = "c_35";
  FileUpload2BusiScene["CYCM_RECALL_DISPOSAL_RECORD_NOTICE_ATTACH"] = "c_36";
  FileUpload2BusiScene["CYCM_RECALL_DISPOSAL_RECORD_PROOF"] = "c_37";
  FileUpload2BusiScene["CYCM_FOOD_TRACE_RECORD"] = "c_38";
  FileUpload2BusiScene["CYCM_STOCK_CONVERT_RECORD_BUSINESS_LICENSE"] = "c_39";
  FileUpload2BusiScene["CYCM_EQUIPMENT_MAINTENANCE_RECORD_IMG"] = "c_40";
  FileUpload2BusiScene["CYCM_MENU_IMG"] = "c_41";
  FileUpload2BusiScene["CYCM_HAND_IMG"] = "c_42";
  FileUpload2BusiScene["CYCM_VIDEO_INSPECTION_RECORD_VIDEO"] = "c_43";
  FileUpload2BusiScene["CYCM_ACCOMPANY_MEALS_IMG"] = "23_0";
  FileUpload2BusiScene["CYCM_EVIDENTIARY_IMG"] = "c_47";
  FileUpload2BusiScene["CYCM_MATERIALS_VIDEO"] = "c_48";
  FileUpload2BusiScene["CYCM_MATERIALS_OUT_STOCK_BILL"] = "c_49";
  FileUpload2BusiScene["YXSC_PHARMACIST_IMG"] = "y_1";
  FileUpload2BusiScene["YXSC_DEVICE_IMG"] = "q_2";
  FileUpload2BusiScene["YXSC_PURCHASE_VOUCHER"] = "q_3";
  return FileUpload2BusiScene;
}({});
export var JyfwFileUpload2Usage = /*#__PURE__*/function (JyfwFileUpload2Usage) {
  JyfwFileUpload2Usage["NORMAL"] = "f0";
  JyfwFileUpload2Usage["QYFW_ASSIST"] = "f1";
  JyfwFileUpload2Usage["QYFW_STANDARD"] = "f1_1";
  JyfwFileUpload2Usage["THEME"] = "f2";
  JyfwFileUpload2Usage["PUBLIC"] = "f3";
  JyfwFileUpload2Usage["APP_RESOURCE"] = "f4";
  JyfwFileUpload2Usage["DATA_IMPORT"] = "f5";
  JyfwFileUpload2Usage["AUTH_INFO"] = "f6";
  JyfwFileUpload2Usage["STOCK"] = "f7";
  JyfwFileUpload2Usage["RICH_TEXT"] = "f8";
  JyfwFileUpload2Usage["RICH_TEXT_APP"] = "f8_1";
  JyfwFileUpload2Usage["RICH_TEXT_OCR"] = "f8_2";
  JyfwFileUpload2Usage["LEARNING_SPACE"] = "f9_1";
  JyfwFileUpload2Usage["LEARNING_SPACE2"] = "f9_2";
  JyfwFileUpload2Usage["LEARNING_SPACE3"] = "f9_3";
  JyfwFileUpload2Usage["OPEN_IM"] = "f0_1";
  JyfwFileUpload2Usage["BUILDING_IMAGE"] = "f11_1";
  JyfwFileUpload2Usage["BUILDING_BUSINESS_LICENSE"] = "f11_2";
  JyfwFileUpload2Usage["SERVICE_VISIT"] = "f11_3";
  JyfwFileUpload2Usage["PUBLISH_RENT"] = "f11_4";
  JyfwFileUpload2Usage["TEXT_ATTACHMENT"] = "c1";
  JyfwFileUpload2Usage["MODEL_SERVICE_BACKGROUND"] = "bot";
  JyfwFileUpload2Usage["JYFW_WORK_ATTACHMENT"] = "f12";
  JyfwFileUpload2Usage["SCZY_DYWS_FJ"] = "f13_1";
  return JyfwFileUpload2Usage;
}({});
export var JyfwEnumBusiType = /*#__PURE__*/function (JyfwEnumBusiType) {
  return JyfwEnumBusiType;
}({});

/**
 * 定义业务类型枚举
 */
export var CycmEnumBusiType = /*#__PURE__*/function (CycmEnumBusiType) {
  CycmEnumBusiType[CycmEnumBusiType["Enterprise"] = 1] = "Enterprise";
  CycmEnumBusiType[CycmEnumBusiType["Store"] = 2] = "Store";
  CycmEnumBusiType[CycmEnumBusiType["Task"] = 3] = "Task";
  CycmEnumBusiType[CycmEnumBusiType["License"] = 4] = "License";
  CycmEnumBusiType[CycmEnumBusiType["StaffCertification"] = 5] = "StaffCertification";
  CycmEnumBusiType[CycmEnumBusiType["Regulation"] = 6] = "Regulation";
  CycmEnumBusiType[CycmEnumBusiType["Personnel"] = 7] = "Personnel";
  CycmEnumBusiType[CycmEnumBusiType["PurchaseRecord"] = 8] = "PurchaseRecord";
  CycmEnumBusiType[CycmEnumBusiType["Inspection"] = 9] = "Inspection";
  CycmEnumBusiType[CycmEnumBusiType["Service"] = 10] = "Service";
  CycmEnumBusiType[CycmEnumBusiType["Activity"] = 11] = "Activity";
  CycmEnumBusiType[CycmEnumBusiType["NoticeAnnouncement"] = 12] = "NoticeAnnouncement";
  CycmEnumBusiType[CycmEnumBusiType["LawRegulation"] = 13] = "LawRegulation";
  CycmEnumBusiType[CycmEnumBusiType["KnowledgeBase"] = 14] = "KnowledgeBase";
  CycmEnumBusiType[CycmEnumBusiType["QuestionConsultation"] = 15] = "QuestionConsultation";
  CycmEnumBusiType[CycmEnumBusiType["Application"] = 16] = "Application";
  CycmEnumBusiType[CycmEnumBusiType["PublicOpinion"] = 17] = "PublicOpinion";
  CycmEnumBusiType[CycmEnumBusiType["PreparationReview"] = 18] = "PreparationReview";
  CycmEnumBusiType[CycmEnumBusiType["SmartWorkOrder"] = 19] = "SmartWorkOrder";
  CycmEnumBusiType[CycmEnumBusiType["FoodSampleSign"] = 21] = "FoodSampleSign";
  return CycmEnumBusiType;
}({});

/**
 * 文件类型
 */
export var CycmEnumFileType = /*#__PURE__*/function (CycmEnumFileType) {
  CycmEnumFileType[CycmEnumFileType["Shop"] = 0] = "Shop";
  CycmEnumFileType[CycmEnumFileType["License"] = 1] = "License";
  CycmEnumFileType[CycmEnumFileType["ShopImage"] = 2] = "ShopImage";
  CycmEnumFileType[CycmEnumFileType["SupplierLicense"] = 3] = "SupplierLicense";
  CycmEnumFileType[CycmEnumFileType["AuditResult"] = 4] = "AuditResult";
  CycmEnumFileType[CycmEnumFileType["MerchantSubmissionDocumentation"] = 5] = "MerchantSubmissionDocumentation";
  CycmEnumFileType[CycmEnumFileType["Facilities"] = 6] = "Facilities";
  CycmEnumFileType[CycmEnumFileType["BusinessCategory"] = 7] = "BusinessCategory";
  CycmEnumFileType[CycmEnumFileType["SupplierLicenseDocumentation"] = 8] = "SupplierLicenseDocumentation";
  CycmEnumFileType[CycmEnumFileType["ProductCertificationDocumentation"] = 9] = "ProductCertificationDocumentation";
  CycmEnumFileType[CycmEnumFileType["IdentityDocumentation"] = 10] = "IdentityDocumentation";
  CycmEnumFileType[CycmEnumFileType["RoughSource"] = 11] = "RoughSource";
  CycmEnumFileType[CycmEnumFileType["WashZoneSource"] = 12] = "WashZoneSource";
  CycmEnumFileType[CycmEnumFileType["SpecialZone"] = 13] = "SpecialZone";
  CycmEnumFileType[CycmEnumFileType["PurchaseInspectionRecord"] = 14] = "PurchaseInspectionRecord";
  CycmEnumFileType[CycmEnumFileType["Menu"] = 15] = "Menu";
  CycmEnumFileType[CycmEnumFileType["GuidanceVideo"] = 16] = "GuidanceVideo";
  CycmEnumFileType[CycmEnumFileType["IdentityDocumentationReverse"] = 17] = "IdentityDocumentationReverse";
  CycmEnumFileType[CycmEnumFileType["PowerOfAttorney"] = 18] = "PowerOfAttorney";
  CycmEnumFileType[CycmEnumFileType["NotLimitedPersonnel"] = 19] = "NotLimitedPersonnel";
  CycmEnumFileType[CycmEnumFileType["LegalUse"] = 20] = "LegalUse";
  CycmEnumFileType[CycmEnumFileType["PlaneLayout"] = 21] = "PlaneLayout";
  CycmEnumFileType[CycmEnumFileType["OrientationMap"] = 22] = "OrientationMap";
  CycmEnumFileType[CycmEnumFileType["NucleicAcidTesting"] = 23] = "NucleicAcidTesting";
  CycmEnumFileType[CycmEnumFileType["Attachment"] = 24] = "Attachment";
  CycmEnumFileType[CycmEnumFileType["Signature"] = 25] = "Signature";
  CycmEnumFileType[CycmEnumFileType["SupervisionCheckPdf"] = 26] = "SupervisionCheckPdf";
  CycmEnumFileType[CycmEnumFileType["PersonnelPhoto"] = 27] = "PersonnelPhoto";
  CycmEnumFileType[CycmEnumFileType["UnderageSaleOfAlcohol"] = 28] = "UnderageSaleOfAlcohol";
  CycmEnumFileType[CycmEnumFileType["ContractFile1"] = 29] = "ContractFile1";
  CycmEnumFileType[CycmEnumFileType["ContractFile2"] = 30] = "ContractFile2";
  CycmEnumFileType[CycmEnumFileType["SmartEvidence"] = 31] = "SmartEvidence";
  CycmEnumFileType[CycmEnumFileType["SmartResult"] = 32] = "SmartResult";
  CycmEnumFileType[CycmEnumFileType["VideoInspection"] = 33] = "VideoInspection";
  CycmEnumFileType[CycmEnumFileType["Others"] = 99] = "Others";
  return CycmEnumFileType;
}({});
export var FOLDER_TYPE = {
  /**
   * 经营执照文件夹
   */
  BUSILIC: 'busiLic',
  /**
   * 门店文件夹
   */
  SHOP_IMGS: 'shopImgs',
  /**
   * 企业信息文件夹
   */
  ENT_IMGS: 'entImgs',
  /**
   * 合同签约证明文件夹
   */
  CON_EVIS: 'conEvis',
  /**
   * 凭证消费记录文件夹
   */
  EXP_IMGS: 'expImgs'
};
export var BUSINESS_TYPE = /*#__PURE__*/function (BUSINESS_TYPE) {
  BUSINESS_TYPE[BUSINESS_TYPE["PROJECT"] = 1] = "PROJECT";
  BUSINESS_TYPE[BUSINESS_TYPE["INSURANCE"] = 2] = "INSURANCE";
  BUSINESS_TYPE[BUSINESS_TYPE["SHOP"] = 3] = "SHOP";
  BUSINESS_TYPE[BUSINESS_TYPE["EVIDENCE"] = 4] = "EVIDENCE";
  BUSINESS_TYPE[BUSINESS_TYPE["ENT"] = 5] = "ENT";
  BUSINESS_TYPE[BUSINESS_TYPE["CONCARD"] = 6] = "CONCARD";
  return BUSINESS_TYPE;
}({});

// 合并 CycmEnumFileType 和 JyfwFileUpload2Usage
var fileUpload2Usage = _objectSpread(_objectSpread({}, JyfwFileUpload2Usage), CycmEnumFileType);
export default fileUpload2Usage;

/**
 * 使用的文件类型
 */

/**
 * cycm的业务类型
 */