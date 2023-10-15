import {createRouter, createWebHistory} from "vue-router";
import Default from "@/layouts/Default.vue";

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
                },
                {
                    id: 11,
                    path: "/management_evaluated_page",
                    name: "management_evaluated_page",
                    component: () => import("../views/managementEvaluatedPage/ManagementEvaluatedPage.vue")
                },
                {
                    id: 12,
                    path: "/management_esg",
                    name: "management_esg",
                    component: () => import("../views/managementESGPage/ManagementESGPage.vue")
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
});

const isAuthenticated = () => {
    return localStorage.getItem(import.meta.env.ENV_TOKEN_KEY) !== null;
};

export default router;
