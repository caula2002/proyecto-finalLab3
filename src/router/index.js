import { createRouter, createWebHistory } from "vue-router";
import InicioView from "@/views/InicioView.vue";
import CompraVentaView from "@/views/CompraVentaView.vue";

const routes = [
  {
    path: "/",
    name: "inicio",
    component: InicioView,
  },
  {
    path: "/CompraVenta",
    name: "CompraVenta",
    component: CompraVentaView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
