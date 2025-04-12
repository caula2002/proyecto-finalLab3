<template>
  <div id="historial-movimientos">
    <h1>Historial de Movimientos</h1>
    <!-- Sección de búsqueda -->
    <form @submit.prevent="BuscarUsuario">
      <div class="id">
        <input type="text" v-model="Id" placeholder="Ingresar ID" required />
        <button type="submit" class="btn-registrar">Buscar</button>
      </div>
      <p v-if="Nombre && Apellido" class="bienvenido">
        Bienvenido {{ Nombre }} {{ Apellido }}
      </p>
      <p v-else-if="error" class="error">{{ error }}</p>
    </form>

    <!-- Tabla de transacciones -->
    <div v-if="transacciones.length > 0" class="table-container">
      <table>
        <thead>
          <tr>
            <th>Operación</th>
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
              <button
                @click="EliminarTransaccion(transaccion._id)"
                class="btn-eliminar"
              >
                Eliminar
              </button>
              <button
                @click="EditarTransaccion(transaccion)"
                class="btn-editar"
              >
                Editar
              </button>
              <button
                @click="SeleccionarTransaccion(transaccion)"
                class="btn-lectura"
              >
                Ampliar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <h2>Tabla vacía, sin movimientos realizados</h2>
    </div>

    <!-- Edición -->
    <div v-if="transaccionEditable" class="modal">
      <div class="modal-content">
        <h2>Editar Transacción</h2>
        <form @submit.prevent="GuardarEdicion">
          <label for="crypto_amount">Cantidad:</label>
          <input
            type="number"
            v-model="transaccionEditable.crypto_amount"
            id="crypto_amount"
            required
          />
          <button type="submit" class="btn-registrar">Guardar</button>
          <button type="button" @click="Cancelar" class="btn-cancelar">
            Cancelar
          </button>
        </form>
      </div>
    </div>

    <!-- Lectura -->
    <div v-if="transaccionLectura" class="modal">
      <div class="modal-content lectura">
        <h2>Detalles de la Transacción</h2>
        <p>
          <strong>Operación:</strong>
          {{ transaccionLectura.action === "sale" ? "Venta" : "Compra" }}
        </p>
        <p>
          <strong>Criptomoneda:</strong> {{ transaccionLectura.crypto_code }}
        </p>
        <p><strong>Cantidad:</strong> {{ transaccionLectura.crypto_amount }}</p>
        <p><strong>Monto:</strong> {{ transaccionLectura.money }} ARS</p>
        <p><strong>Fecha:</strong> {{ transaccionLectura.datetime }}</p>
        <button @click="Cancelar" class="btn-cancelar">Cerrar</button>
      </div>
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
      transaccionEditable: null,
      transaccionLectura: null,
      transaccionOriginal: null,
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
    SeleccionarTransaccion(transaccion) {
      this.transaccionLectura = transaccion;
    },
    EditarTransaccion(transaccion) {
      this.transaccionEditable = { ...transaccion };
      this.transaccionOriginal = transaccion;
    },
    Cancelar() {
      this.transaccionEditable = null;
      this.transaccionLectura = null;
    },
    GuardarEdicion() {
      const Valor =
        this.transaccionOriginal.money / this.transaccionOriginal.crypto_amount;
      this.transaccionEditable.money =
        this.transaccionEditable.crypto_amount * Valor;
      console.log(this.transaccionEditable.money);
      axios
        .patch(
          `https://laboratorio3-f36a.restdb.io/rest/transactions/${this.transaccionEditable._id}`,
          this.transaccionEditable,
          {
            headers: { "x-apikey": "60eb09146661365596af552f" },
          }
        )
        .then(() => {
          console.log("Transaccion editada");
          this.BuscarMovimientos();
          this.Cancelar();
        });
    },
  },
};
</script>
<style scoped>
h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 600;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

form input {
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

form input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
}

form .btn-registrar {
  width: 100%;
  padding: 12px;
  background-color: #4299e1;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

form .btn-registrar:hover {
  background-color: #3182ce;
}

form .btn-cancelar {
  width: 100%;
  padding: 12px;
  background-color: #e53e3e;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

form .btn-cancelar:hover {
  background-color: #c53030;
}

.table-container {
  margin-top: 2rem;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

table th,
table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: center;
}

table th {
  background-color: #4299e1;
  color: white;
  font-weight: bold;
  padding: 12px;
  text-align: center;
}

table tr:nth-child(even) {
  background-color: #f9f9f9;
}

table tr:hover {
  background-color: #f1f1f1;
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #ffffff;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  width: 80%;
  max-width: 500px;
  text-align: center;
}

modal-content h2 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.modal-content p {
  margin: 0.5rem 0;
}

.modal-content button {
  margin-top: 1rem;
}

.btn-eliminar {
  padding: 8px 16px;
  background-color: #e53e3e;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-eliminar:hover {
  background-color: #c53030;
}

.btn-editar {
  padding: 8px 16px;
  background-color: #ecc94b;
  color: black;
  border: none;
  border-radius: 5px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-editar:hover {
  background-color: #d69e2e;
}

.btn-lectura {
  padding: 8px 16px;
  background-color: #48bb78;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-lectura:hover {
  background-color: #38a169;
}

.modal-content.lectura {
  background-color: #e6fffa;
  border: 2px solid #48bb78;
  color: #2f855a;
}

.modal-content.lectura h2 {
  font-size: 1.8rem;
  font-weight: bold;
  color: #2c7a7b;
  margin-bottom: 1rem;
}

.modal-content.lectura p {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2f855a;
  margin: 0.5rem 0;
}

.modal-content.lectura .btn-cancelar {
  padding: 8px 16px;
  background-color: #e53e3e;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.modal-content.lectura .btn-cancelar:hover {
  background-color: #c53030;
}
</style>
