<script>
/* eslint-disable */
import { load, loadCss } from "./load.js";

const tinymceCDN =
  "//cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.3/tinymce.min.js";
const tinymceCssCND =
  "//cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.3/skins/lightgray/skin.min.css";
const tinymceLangCND =
  "//cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.3/langs/zh_CN.js";

const plugins = [
  "advlist anchor autolink autosave code codesample colorpicker colorpicker contextmenu directionality emoticons fullscreen hr image imagetools insertdatetime link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus table template textcolor textpattern visualblocks visualchars wordcount"
];
const toolbar = [
  "searchreplace bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript code codesample",
  "hr bullist numlist link image charmap preview anchor pagebreak insertdatetime media table emoticons forecolor backcolor fullscreen"
];

export default {
  name: "CpTinymce",
  props: {
    id: String,
    lang: {
      type: String,
      default: "zh_CN" // 中英文切换，默认中文，英文 为 en_US
    },
    value: {
      type: String,
      default: ""
    },
    toolbar: {
      type: Array,
      default: () => []
    },
    plugins: {
      type: Array,
      default: () => []
    },
    menubar: {
      type: String,
      default: "file edit insert view format table"
    },
    height: {
      type: [Number, String],
      required: false,
      default: 360
    },
    // 是否上传图片
    isUploadImage: {
      type: Boolean,
      default: true
    },
    // 默认配置
    config: {
      type: Object,
      default() {
        return {};
      }
    },
    // 自动初始化
    autoInit: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: "abc"
    }
  },
  data() {
    return {
      hasChange: false,
      hasInit: false,
      tinymceId: this.id || "vue-tinymce-" + +new Date(),
      fullscreen: false
    };
  },
  watch: {
    value(val) {
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() =>
          window.tinymce.get(this.tinymceId).setContent(val || "")
        );
      }
    }
  },
  mounted() {
    this.loadLib().then(() => {
      this.autoInit && this.initTinymce();
    });
  },
  activated() {
    this.loadLib().then(() => {
      this.initTinymce();
    });
  },
  deactivated() {
    this.destroyTinymce();
  },
  destroyed() {
    this.destroyTinymce();
  },
  methods: {
    loadLib(
      jsLib = tinymceCDN,
      cssLib = tinymceCssCND,
      langLib = tinymceLangCND
    ) {
      // 加载 cdn， 可在 created 中调用
      return new Promise((resolve, reject) => {
        load(jsLib)
          .then(() => {
            return Promise.all([loadCss(cssLib), load(langLib)]);
          })
          .then(() => {
            resolve();
          })
          .catch(err => {
            console.log(err);
            reject();
          });
      });
    },
    initTinymce() {
      const _this = this;
      let dom = document.getElementById(this.tinymceId);
      let domObj = dom ? { target: dom } : { selector: `#${this.tinymceId}` };
      dom.style.display = "block";
      window.tinymce &&
        window.tinymce.init &&
        window.tinymce.init(
          Object.assign(
            {},
            domObj,
            {
              selector: `#${this.tinymceId}`,
              height: this.height,
              body_class: "panel-body ",
              object_resizing: false,
              branding: false,
              toolbar: this.toolbar.length ? this.toolbar : toolbar,
              plugins: this.plugins.lenght ? this.plugins : plugins,
              menubar: this.menubar,
              end_container_on_empty_block: true,
              powerpaste_word_import: "clean",
              code_dialog_height: 450,
              code_dialog_width: 1000,
              advlist_bullet_styles: "square",
              advlist_number_styles: "default",
              imagetools_cors_hosts: ["www.tinymce.com", "codepen.io"],
              default_link_target: "_blank",
              link_title: false,
              language: this.lang,
              nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
              init_instance_callback: editor => {
                if (_this.value) {
                  editor.setContent(_this.value);
                }
                _this.hasInit = true;
                editor.on("NodeChange Change KeyUp SetContent", () => {
                  this.hasChange = true;
                  this.$emit("input", editor.getContent());
                  this.$emit("getTinymceContent", editor.getContent());
                });
              },
              setup(editor) {
                editor.on("FullscreenStateChanged", e => {
                  _this.fullscreen = e.state;
                });
              }
            },
            this.config
          )
        );
    },
    destroyTinymce() {
      const tinymce = window.tinymce && window.tinymce.get(this.tinymceId);
      if (this.fullscreen) {
        tinymce.execCommand("mceFullScreen");
      }

      if (tinymce) {
        tinymce.destroy();
      }
    },
    setContent(value) {
      window.tinymce && window.tinymce.get(this.tinymceId).setContent(value);
    },
    getContent() {
      window.tinymce && window.tinymce.get(this.tinymceId).getContent();
    },
    renderEditorImage() {
      return this._e();
    }
  },
  render() {
    return (
      <div
        class={[
          "tinymce-container editor-container",
          this.fullscreen ? "fullscreen" : ""
        ]}
      >
        <textarea
          id={this.tinymceId}
          placeholder={this.placeholder}
          class="tinymce-textarea"
        />
        <div class="editor-custom-btn-container">
          {this.isUploadImage
            ? this.$slots.editorImage || this.renderEditorImage()
            : ""}
        </div>
      </div>
    );
  }
};
</script>
