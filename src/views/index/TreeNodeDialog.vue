<template>
  <div>
    <c-dialog
      v-bind="$attrs"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      v-on="$listeners"
      @open="onOpen"
      @close="onClose"
    >
      <c-row :gutter="0">
        <c-form
          ref="cForm"
          :model="formData"
          :rules="rules"
          size="small"
          label-width="100px"
        >
          <c-col :span="24">
            <c-form-item label="选项名" prop="label">
              <c-input
                v-model="formData.label"
                placeholder="请输入选项名"
                clearable
              />
            </c-form-item>
          </c-col>
          <c-col :span="24">
            <c-form-item label="选项值" prop="value">
              <c-input
                v-model="formData.value"
                placeholder="请输入选项值"
                clearable
              >
                <c-select
                  slot="append"
                  v-model="dataType"
                  :style="{ width: '100px' }"
                >
                  <c-option
                    v-for="(item, index) in dataTypeOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                  />
                </c-select>
              </c-input>
            </c-form-item>
          </c-col>
        </c-form>
      </c-row>
      <div slot="footer">
        <c-button type="primary" @click="handelConfirm">
          确定
        </c-button>
        <c-button @click="close">
          取消
        </c-button>
      </div>
    </c-dialog>
  </div>
</template>
<script>
import { isNumberStr } from "@/utils/index";
import { getTreeNodeId, saveTreeNodeId } from "@/utils/db";

const id = getTreeNodeId();

export default {
  components: {},
  inheritAttrs: false,
  props: [],
  data() {
    return {
      id,
      formData: {
        label: undefined,
        value: undefined
      },
      rules: {
        label: [
          {
            required: true,
            message: "请输入选项名",
            trigger: "blur"
          }
        ],
        value: [
          {
            required: true,
            message: "请输入选项值",
            trigger: "blur"
          }
        ]
      },
      dataType: "string",
      dataTypeOptions: [
        {
          label: "字符串",
          value: "string"
        },
        {
          label: "数字",
          value: "number"
        }
      ]
    };
  },
  computed: {},
  watch: {
    // eslint-disable-next-line func-names
    "formData.value": function(val) {
      this.dataType = isNumberStr(val) ? "number" : "string";
    },
    id(val) {
      saveTreeNodeId(val);
    }
  },
  created() {},
  mounted() {},
  methods: {
    onOpen() {
      this.formData = {
        label: undefined,
        value: undefined
      };
    },
    onClose() {},
    close() {
      this.$emit("update:visible", false);
    },
    handelConfirm() {
      this.$refs.cForm.validate(valid => {
        if (!valid) return;
        if (this.dataType === "number") {
          this.formData.value = parseFloat(this.formData.value);
        }
        this.formData.id = this.id++;
        this.$emit("commit", this.formData);
        this.close();
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
