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
import {
    faBicycle,
    faBolt,
    faBuilding,
    faChartLine,
    faChartSimple,
    faChevronLeft,
    faChevronRight,
    faCity,
    faCloud,
    faDroplet,
    faEarthAsia,
    faEye,
    faFaceSmile,
    faFeather,
    faFire,
    faFish,
    faFlask,
    faGauge,
    faGear,
    faGift,
    faGlobe,
    faHammer,
    faHandHoldingHeart,
    faHandshake,
    faHouse,
    faLeaf,
    faLocationPin,
    faMoon,
    faMountainSun,
    faNetworkWired,
    faPerson,
    faRecycle,
    faRocket,
    faSeedling,
    faShieldHalved,
    faShop,
    faSitemap,
    faStar,
    faSun,
    faThumbsDown,
    faThumbsUp,
    faTrash,
    faTrophy,
    faTruck,
    faUmbrella,
    faUsers,
    faVirus,
    faWater,
    faWind
} from "@fortawesome/free-solid-svg-icons";

window.Buffer;

library.add(
    faEye, faChevronLeft, faChevronRight, faBuilding, faMountainSun, faStar, faHouse, faCloud, faFaceSmile, faShieldHalved,
    faBolt, faUmbrella, faGift, faGear, faTrash, faDroplet, faFire, faThumbsUp, faThumbsDown, faGlobe, faTruck, faCity,
    faBicycle, faFlask, faPerson, faHandshake, faEarthAsia, faUsers, faFeather, faSun, faFish, faShop, faChartSimple, faGauge,
    faHandHoldingHeart, faLocationPin, faNetworkWired, faRocket, faWater, faSitemap, faMoon, faLeaf, faSeedling, faTrophy,
    faHammer, faRecycle, faWind, faVirus, faChartLine
)
const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Antd);
app.use(Toast);
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount("#app");
