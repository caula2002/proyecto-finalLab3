<template>
  <div id="compra-venta">
    <h1>Compra y Venta</h1>
    <form @submit.prevent="ConsultaApi">
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
      <div>
        <label for="seleccionOperacion">Operacion</label>
        <select
          v-model="seleccionOperacion"
          @change="BuscarValorCripto"
          required
        >
          <option value="purchase">Compra</option>
          <option value="sale">Venta</option>
        </select>
      </div>
      <div>
        <label for="tipoCripto">Criptomoneda</label>
        <select v-model="tipoMoneda" @change="BuscarValorCripto" required>
          <option value="btc">Bitcoin</option>
          <option value="eth">Ethereum</option>
          <option value="usdt">Tether</option>
        </select>
      </div>
      <div v-if="valorCripto" class="valor-cripto">
        <p>Valor de la cripto actualmente: {{ valorCripto }} ARS</p>
      </div>
      <div>
        <label for="cantidadCripto">Cantidad</label>
        <input
          type="number"
          v-model="cantidadCripto"
          @input="validacion"
          required
        />
      </div>
      <div v-if="cantidadCripto && valorCripto" class="monto">
        <p>Monto: {{ cantidadCripto * valorCripto }} ARS</p>
      </div>
      <button type="submit" class="btn-registrar">Confirmar Transaccion</button>
    </form>
    <div v-if="Transaccion" class="modal">
      <div class="modal-content">
        <span class="close" @click="Transaccion = null">&times;</span>
        <h1>Detalles de la Transaccion:</h1>
        <p>ID: {{ detalles.user_id }}</p>
        <p>Operacion: {{ detalles.action === "sale" ? "Venta" : "Compra" }}</p>
        <p>Criptomoneda: {{ detalles.crypto_code }}</p>
        <p>Cantidad: {{ detalles.crypto_amount }}</p>
        <p>Monto: {{ detalles.money }} ARS</p>
        <p>Fecha: {{ detalles.datetime }}</p>
        <p class="transaccion-exitosa">Transaccion Exitosa</p>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "CompraVentaView",
  data() {
    return {
      Id: "",
      Nombre: "",
      Apellido: "",
      seleccionOperacion: "",
      tipoMoneda: "",
      cantidadCripto: null,
      valorCripto: null,
      monto: null,
      error: "",
      Transaccion: null,
      detalles: {},
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
      } else {
        this.Nombre = "";
        this.Apellido = "";
        this.error = "Usuario no encontrado";
      }
    },
    async BuscarValorCripto() {
      const cripto = this.tipoMoneda;
      const api = `https://criptoya.com/api/argenbtc/${cripto}/ars`;
      try {
        const resultado = await axios.get(api);
        if (this.seleccionOperacion === "purchase") {
          this.valorCripto = resultado.data.totalBid;
        } else {
          this.valorCripto = resultado.data.totalAsk;
        }
      } catch (error) {
        console.error("ERROR AL OBTENER EL VALOR", error);
        this.valorCripto = null;
      }
    },
    validacion() {
      if (this.cantidadCripto <= 0) {
        this.error = "La cantidad debe ser mayor a 0";
      } else {
        this.error = "";
      }
    },
    ConsultaApi() {
      const consulta = {
        user_id: this.Id,
        action: this.seleccionOperacion,
        crypto_code: this.tipoMoneda,
        crypto_amount: this.cantidadCripto,
        money: this.cantidadCripto * this.valorCripto,
        datetime: new Date().toISOString(),
      };
      axios
        .post(
          `https://laboratorio3-f36a.restdb.io/rest/transactions`,
          consulta,
          {
            headers: { "x-apikey": "60eb09146661365596af552f" },
          }
        )
        .then((response) => {
          console.log(response);
          this.detalles = {
            user_id: response.data.user_id,
            action: response.data.action,
            crypto_code: response.data.crypto_code,
            crypto_amount: response.data.crypto_amount,
            money: response.data.money,
            datetime: response.data.datetime,
          };

          this.Transaccion = true;
        })
        .catch((error) => {
          console.error("ERROR AL REALIZAR LA TRANSACCION", error);
          this.Transaccion = null;
        });
    },
  },
};
</script>
<style scoped>
#compra-venta {
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

form input,
form select {
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

form input:focus,
form select:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
}

form input::placeholder {
  color: #a0aec0;
}

.bienvenido {
  background-color: #e6fffa;
  color: #2c7a7b;
  padding: 12px;
  border-radius: 8px;
  margin-top: 1rem;
  font-size: 1rem;
  text-align: center;
  border-left: 4px solid #38b2ac;
}

.valor-cripto {
  background-color: #ebf8ff;
  color: #2b6cb0;
  padding: 12px;
  border-radius: 8px;
  margin-top: 1rem;
  font-size: 1rem;
  text-align: center;
  border-left: 4px solid #4299e1;
}

.monto {
  background-color: #f0fff4;
  color: #2f855a;
  padding: 12px;
  border-radius: 8px;
  margin-top: 1rem;
  font-size: 1rem;
  text-align: center;
  border-left: 4px solid #48bb78;
}

.btn-registrar {
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

.btn-registrar:hover {
  background-color: #3182ce;
}

.btn-registrar:active {
  transform: translateY(1px);
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
  background-color: #e6fffa; /* Tono verde claro */
  margin: auto;
  padding: 20px;
  border: 1px solid #48bb78; /* Borde verde */
  width: 80%;
  max-width: 500px;
  border-radius: 10px;
  text-align: center;
}

.modal-content.success {
  background-color: #e6fffa; /* Tono verde claro */
  border-left: 4px solid #48bb78; /* Borde verde */
}

.transaccion-exitosa {
  color: #2f855a;
  font-weight: bold;
  font-size: 1.2rem;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

@media (max-width: 640px) {
  #compra-venta {
    margin: 1rem;
    padding: 1.5rem;
  }

  h1 {
    font-size: 1.5rem;
  }
}
</style>
