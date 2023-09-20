import {createApp} from "vue";
import {createPinia} from "pinia";

import App from "./App.vue";
import router from "./router";
import Antd from "ant-design-vue";
import 'ant-design-vue/dist/reset.css'
import "./assets/css/main.css";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import {library} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import {faEye, faChevronLeft, faChevronRight, faMountainSun, faStar, faHouse} from "@fortawesome/free-solid-svg-icons";
import {faBuilding} from "@fortawesome/free-solid-svg-icons";

window.Buffer;

library.add(faEye, faChevronLeft, faChevronRight, faBuilding, faMountainSun, faStar, faHouse)
const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Antd);
app.use(Toast);
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount("#app");
