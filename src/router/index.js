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
                    path: "/category",
                    name: "category",
                    component: () => import("../views/category/ManagementCategory.vue"),
                },
                {
                    id: 4,
                    path: "/news",
                    name: "news",
                    component: () => import("../views/news/list/NewsList.vue")
                },
                {
                    id: 5,
                    path: "/news/editor",
                    name: "editor_news",
                    component: () => import("../views/news/create/EditorNews.vue")
                },
                {
                    id: 6,
                    path: "/news/edit/:newsId",
                    name: "edit_news",
                    component: () => import("../views/news/create/EditorNews.vue"),
                },
                {
                    id: 7,
                    path: "/policy",
                    name: "management_policy",
                    component: () => import("../views/policy/ManagementPolicy.vue")
                },
                {
                    id: 8,
                    path: "/popup",
                    name: "popup",
                    component: () => import("../views/popup/ManagementPopup.vue")
                },
                {
                    id: 9,
                    path: "/comment",
                    name: "comment",
                    component: () => import("../views/comment/ManagementComment.vue")
                },
                {
                    id: 10,
                    path: "/notifications",
                    name: "notification",
                    component: () => import("../views/notification/NotificationList.vue")
                },
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
