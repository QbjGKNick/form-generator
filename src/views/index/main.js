import Vue from "vue";
import App from "./App.vue";
import router from "@/router";
import Cui from "@cci/cui";
import "@cci/cui/lib/theme-default/index.css";
import "@/styles/index.scss";
import "@/icons";
import axios from "axios";
// import Tinymce from "@/components/tinymce/index.vue";
// import CpTinymce from "@cci/cp-tinymce";
import CpTinymce from "@/components/cp-tinymce";

// Vue.component("tinymce", Tinymce);
Vue.component("cp-tinymce", CpTinymce);

Vue.use(Cui);
Vue.config.productionTip = false;
Vue.prototype.$axios = axios;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
