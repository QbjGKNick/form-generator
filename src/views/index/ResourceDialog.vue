<template>
  <div>
    <c-dialog
      v-bind="$attrs"
      title="外部资源引用"
      width="600px"
      :close-on-click-modal="false"
      v-on="$listeners"
      @open="onOpen"
      @close="onClose"
    >
      <c-input
        v-for="(item, index) in resources"
        :key="index"
        v-model="resources[index]"
        class="url-item"
        placeholder="请输入 css 或 js 资源路径"
        prefix-icon="el-icon-link"
        clearable
      >
        <c-button
          slot="append"
          icon="el-icon-delete"
          @click="deleteOne(index)"
        />
      </c-input>
      <c-button-group class="add-item">
        <c-button
          plain
          @click="addOne('https://lib.baomitu.com/jquery/1.8.3/jquery.min.js')"
        >
          jQuery1.8.3
        </c-button>
        <c-button plain @click="addOne('https://unpkg.com/http-vue-loader')">
          http-vue-loader
        </c-button>
        <c-button icon="el-icon-circle-plus-outline" plain @click="addOne('')">
          添加其他
        </c-button>
      </c-button-group>
      <div slot="footer">
        <c-button @click="close">
          取消
        </c-button>
        <c-button type="primary" @click="handelConfirm">
          确定
        </c-button>
      </div>
    </c-dialog>
  </div>
</template>
<script>
import { deepClone } from "@/utils/index";

export default {
  components: {},
  inheritAttrs: false,
  props: ["originResource"],
  data() {
    return {
      resources: null
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onOpen() {
      /* eslint operator-linebreak: ["error", "before"] */
      this.resources = this.originResource.length
        ? deepClone(this.originResource)
        : [""];
    },
    onClose() {},
    close() {
      this.$emit("update:visible", false);
    },
    handelConfirm() {
      const results = this.resources.filter(item => !!item) || [];
      this.$emit("save", results);
      this.close();
      if (results.length) {
        this.resources = results;
      }
    },
    deleteOne(index) {
      this.resources.splice(index, 1);
    },
    addOne(url) {
      if (this.resources.indexOf(url) > -1) {
        this.$message("资源已存在");
      } else {
        this.resources.push(url);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.add-item {
  margin-top: 8px;
}
.url-item {
  margin-bottom: 12px;
}
</style>
