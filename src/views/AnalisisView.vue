<template>
  <div id="analisis-estado">
    <div id="cabezera">
      <h1>Análisis de Estado Actual</h1>
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
    </div>

    <!-- Tabla de Estados -->
    <div v-if="transacciones.length > 0" class="table-container">
      <table>
        <thead>
          <tr>
            <th>Criptomoneda</th>
            <th>Cantidad</th>
            <th>Dinero</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>BTC</td>
            <td>{{ cantidadBtc }}</td>
            <td>${{ dineroBtc }}</td>
          </tr>
          <tr>
            <td>ETH</td>
            <td>{{ cantidadEth }}</td>
            <td>${{ dineroEth }}</td>
          </tr>
          <tr>
            <td>USDT</td>
            <td>{{ cantidadUsdt }}</td>
            <td>${{ dineroUsdt }}</td>
          </tr>
          <tr>
            <td>Total</td>
            <td></td>
            <td>${{ dineroTotal }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <h2>No se encontraron transacciones</h2>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "AnalisisView",
  data() {
    return {
      Id: "",
      Nombre: "",
      Apellido: "",
      error: null,
      transacciones: [],
      cantidadBtc: null,
      cantidadEth: null,
      cantidadUsdt: null,
      dineroTotal: null,
      dineroBtc: null,
      dineroEth: null,
      dineroUsdt: null,
      valorBtc: null,
      valorEth: null,
      valorUsdt: null,
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
          this.Calculo();
          this.BuscarValorCripto();
        });
    },
    Calculo() {
      this.cantidadBtc = null;
      this.cantidadEth = null;
      this.cantidadUsdt = null;
      this.dineroTotal = null;
      this.transacciones.forEach((transaccion) => {
        console.log(transaccion);
        if (transaccion.crypto_code === "btc") {
          if (transaccion.action === "purchase") {
            this.cantidadBtc += transaccion.crypto_amount;
          } else {
            this.cantidadBtc -= transaccion.crypto_amount;
          }
        }

        if (transaccion.crypto_code === "eth") {
          if (transaccion.action === "purchase") {
            this.cantidadEth += transaccion.crypto_amount;
          } else {
            this.cantidadEth -= transaccion.crypto_amount;
          }
        }

        if (transaccion.crypto_code === "usdt") {
          if (transaccion.action === "purchase") {
            this.cantidadUsdt += transaccion.crypto_amount;
          } else {
            this.cantidadUsdt -= transaccion.crypto_amount;
          }
        }
      });
    },
    async BuscarValorCripto() {
      try {
        const resultadobtc = await axios.get(
          `https://criptoya.com/api/argenbtc/btc/ars`
        );
        this.valorBtc = resultadobtc.data.totalBid;
        console.log(this.valorBtc);
        const resultadoeth = await axios.get(
          `https://criptoya.com/api/argenbtc/eth/ars`
        );
        this.valorEth = resultadoeth.data.totalBid;
        const resultadousdt = await axios.get(
          `https://criptoya.com/api/argenbtc/usdt/ars`
        );
        this.valorUsdt = resultadousdt.data.totalBid;
        this.dineroBtc = this.cantidadBtc * this.valorBtc;
        this.dineroEth = this.cantidadEth * this.valorEth;
        this.dineroUsdt = this.cantidadUsdt * this.valorUsdt;
        this.dineroTotal = this.dineroBtc + this.dineroEth + this.dineroUsdt;
      } catch (error) {
        console.error("ERROR AL OBTENER EL VALOR", error);
      }
    },
  },
};
</script>
<style scoped>
#cabezera {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

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
</style>
