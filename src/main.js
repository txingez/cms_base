import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import "./assets/css/main.css";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import {Buffer} from 'buffer';

globalThis.Buffer = Buffer;

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Antd);
app.use(Toast);

app.mount("#app");
