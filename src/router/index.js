import { createRouter, createWebHistory } from "vue-router";
import InicioView from "@/views/InicioView.vue";
import CompraVentaView from "@/views/CompraVentaView.vue";
import HistorialMovimientoView from "@/views/HistorialMovimientoView.vue";

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
  {
    path: "/HistorialMovimiento",
    name: "HistorialMovimiento",
    component: HistorialMovimientoView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
