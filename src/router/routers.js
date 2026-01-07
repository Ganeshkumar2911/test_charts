

import Default from "@/layout/default.vue"

export default [
  {
    path: "",
    name: "Default",
    component: Default,
    meta: { requiresAuth: true },
    children: [
      // {
      //   path: "chart/:id",
      //   name: "chart",
      //   component: () => import("@/pages/chat.vue"),
      // },
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/pages/dashboard/index.vue"),
      },
      {
        path: "brokers",
        name: "Brokers",
        component: () => import("@/pages/brokers/index.vue"),
      }
    ],
  },
  {
    path: "/auth",
    name: "Auth",
    component: () => import("@/layout/auth.vue"),
    children: [
      {
        path: "login",
        name: "Login",
        component: () => import("@/pages/auth/login.vue"),
      },
    ],
  }
];
