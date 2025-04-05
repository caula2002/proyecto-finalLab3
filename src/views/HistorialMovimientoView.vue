<template>
  <div id="historial">
    <h1>Historial de Movimientos</h1>
    <div class="id">
      <input type="text" v-model="Id" placeholder="Ingresar ID" required />
      <button type="button" class="btn-registrar" @click="BuscarUsuario">
        Buscar
      </button>
      <p v-if="Nombre && Apellido" class="bienvenido">
        Bienvenido {{ Nombre }} {{ Apellido }}
      </p>
      <p v-else-if="error">{{ error }}</p>
    </div>
    <div id="tabla" v-if="transacciones.length > 0">
      <table>
        <thead>
          <tr>
            <th>Operacion</th>
            <th>Criptomoneda</th>
            <th>Cantidad</th>
            <th>Monto</th>
            <th>Fecha</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="transaccion in transacciones" :key="transaccion._id">
            <td>{{ transaccion.action === "sale" ? "Venta" : "Compra" }}</td>
            <td>{{ transaccion.crypto_code }}</td>
            <td>{{ transaccion.crypto_amount }}</td>
            <td>{{ transaccion.money }} ARS</td>
            <td>{{ transaccion.datetime }}</td>
            <td>
              <button @click="EliminarTransaccion(transaccion._id)">
                Eliminar
              </button>
              <button @click="EditarTransaccion(transaccion)">Editar</button>
              <button @click="LecturaTransaccion(transaccion._id)">
                Ampliar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <h2>Tabla vacia, sin movimientos realizados</h2>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "HistorialMovimientoView",
  data() {
    return {
      Id: "",
      Nombre: "",
      Apellido: "",
      transacciones: [],
      error: "",
    };
  },
  methods: {
    BuscarUsuario() {
      let usuariosGuardados =
        JSON.parse(localStorage.getItem("usuarios")) || [];
      let usuario = usuariosGuardados.find((user) => user.id === this.Id);
      if (usuario) {
        this.Nombre = usuario.nombre;
        this.Apellido = usuario.apellido;
        this.error = "";
        this.BuscarMovimientos();
      } else {
        this.Nombre = "";
        this.Apellido = "";
        this.error = "Usuario no encontrado";
      }
    },
    BuscarMovimientos() {
      axios
        .get(
          `https://laboratorio3-f36a.restdb.io/rest/transactions?q={"user_id":"${this.Id}"}`,
          {
            headers: { "x-apikey": "60eb09146661365596af552f" },
          }
        )
        .then((response) => {
          this.transacciones = response.data;
        });
    },
    EliminarTransaccion(IdTransaccion) {
      axios
        .delete(
          `https://laboratorio3-f36a.restdb.io/rest/transactions/${IdTransaccion}`,
          {
            headers: { "x-apikey": "60eb09146661365596af552f" },
          }
        )
        .then(() => {
          console.log("Transaccion eliminada");
          this.BuscarMovimientos();
        });
    },
  },
};
</script>
