/**
 * 用于生成表单校验，指定正则规则的触发方式。
 * 未在此处声明无触发方式的组件将不生成rule！！
 */
export default {
  "c-input": "blur",
  "c-input-number": "blur",
  "c-select": "change",
  "c-radio-group": "change",
  "c-checkbox-group": "change",
  "c-cascader": "change",
  "c-time-picker": "change",
  "c-date-picker": "change",
  "c-rate": "change",
  "cp-tinymce": "blur"
};
