import {createRouter, createWebHistory} from "vue-router";
import Default from "@/layouts/Default.vue";
import {ACCESS_TOKEN_KEY} from "@/constants/constants";
import {decodeJWT} from "../utils/decodeJWT";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            redirect: "/dashboard",
            component: Default,
            children: [
                {
                    id: 1,
                    path: "/dashboard",
                    name: "dashboard",
                    component: () => import("../views/dashboard/Dashboard.vue"),
                },
                {
                    id: 2,
                    path: "/banner",
                    name: "banner",
                    component: () => import("../views/banner/ManagementBanner.vue"),
                },
                {
                    id: 3,
                    path: "/activities",
                    name: "activities",
                    component: () => import("../views/activity/list/Activities.vue")
                },
                {
                    id: 4,
                    path: "/activity/editor",
                    name: "editor_activity",
                    component: () => import("../views/activity/create/EditorActivity.vue")
                },
                {
                    id: 5,
                    path: "/activity/edit/:activityId",
                    name: "edit_activity",
                    component: () => import("../views/activity/create/EditorActivity.vue"),
                },
                {
                    id: 6,
                    path: "/management_home",
                    name: "management_home",
                    component: () => import("../views/managementHomePage/ManagementHomePage.vue")
                },
                {
                    id: 7,
                    path: "/management_overview",
                    name: "management_overview",
                    component: () => import("../views/managementOverviewPage/ManagementOverviewPage.vue")
                },
                {
                    id: 8,
                    path: "/message",
                    name: "management_message",
                    component: () => import("../views/message/ManagementMessage.vue")
                },
                {
                    id: 9,
                    path: "/evaluated_result",
                    name: "management_result",
                    component: () => import("../views/managementEvaluatedResult/ManagementEvaluatedResultPage.vue")
                },
                {
                    id: 10,
                    path: "/result_detail/:id",
                    name: "evaluated_result_detail",
                    component: () => import("../views/managementEvaluatedResult/EvaluatedResultDetailPage.vue")
                }
            ],
        },
        {
            path: "/login",
            name: "login",
            component: () => import("../views/login/LoginPage.vue")
        },
        {
            path: "/:pathMatch(.*)*",
            name: "NotFound",
            component: () => import("../views/404.vue")
        },
        {
            path: "/403",
            name: "Forbidden",
            component: () => import("../views/403.vue")
        }
    ],
});

router.beforeEach((to, from) => {
    if (!isAuthenticated() && to.name !== "login") {
        return {name: "login"};
    }
    if (isAuthenticated() && to.name === "login") {
        return {name: "home"};
    }

    // if (to.name !== 'login') {
    //     const policies = getPolicies();
    //     const newsPages = ['news', 'editor_news', 'view_news'];
    //     if (((to.name === 'banner' || to.name === 'popup') && (policies === null || !policies.map(p => p.name).some(p => p.includes('MANAGE_BANNER_POPUP')))) ||
    //         ((to.name === 'management_policy') && (policies === null || !policies.map(p => p.name).some(p => p.includes('MANAGE_POLICY')))) ||
    //         ((to.name === 'category') && (policies === null || !policies.map(p => p.name).some(p => p.includes('MANAGE_CATEGORY')))) ||
    //         ((to.name === 'comment') && (policies === null || !policies.map(p => p.name).some(p => p.includes('MANAGE_COMMENT')))) ||
    //         ((newsPages.includes(to.name)) && (policies === null || !policies.map(p => p.name).some(p => p.includes('NEWS'))))) {
    //         return {name: 'Forbidden'};
    //     }
    // }
});

const isAuthenticated = () => {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY) !== null;
};

const getPolicies = () => {
    return JSON.parse(decodeJWT(sessionStorage.getItem(ACCESS_TOKEN_KEY)).policies);
};

export default router;
