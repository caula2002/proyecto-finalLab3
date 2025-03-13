<template>
  <div id="inicio">
    <h1>Registro de usuario</h1>
    <div class="ingreso">
      <input
        type="text"
        v-model="Nombre"
        required
        placeholder="Ingrese su Nombre"
      />
      <input
        type="text"
        v-model="Apellido"
        required
        placeholder="Ingrese su Apellido"
      />
    </div>
    <div class="error" v-if="error">{{ error }}</div>
    <div>
      <button type="submit" class="btn-registrar" @click="Validacion">
        Registrar
      </button>
    </div>
    <div v-if="ultimoRegistrado" class="registro">
      <p>
        {{ ultimoRegistrado.nombre }} {{ ultimoRegistrado.apellido }} fue
        guardado con exito
      </p>
      <p class="id">ID: {{ ultimoRegistrado.id }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "InicioView",
  data() {
    return {
      Nombre: "",
      Apellido: "",
      error: "",
      IdAlf: null,
      ultimoRegistrado: null,
    };
  },
  methods: {
    Validacion() {
      this.error = "";
      this.IdAlf = null;
      const soloLetras = /^[A-Za-zÁáÉéÍíÓóÚúÑñ]+$/;

      if (!this.Nombre.trim()) {
        this.error = "El nombre es requerido";
        return false;
      }
      if (!soloLetras.test(this.Nombre)) {
        this.error = "El nombre solo debe contener letras";
        return false;
      }
      if (!this.Apellido.trim()) {
        this.error = "El apellido es requerido";
        return false;
      }
      if (!soloLetras.test(this.Apellido)) {
        this.error = "El apellido solo debe contener letras";
        return false;
      }
      this.generarId();
    },
    generarId() {
      const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let id = "";
      for (let i = 0; i < 5; i++) {
        id += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
      }
      this.IdAlf = id;
      this.guardarUsuario();
    },
    guardarUsuario() {
      const usuario = {
        nombre: this.Nombre,
        apellido: this.Apellido,
        id: this.IdAlf,
      };
      let usuariosGuardados =
        JSON.parse(localStorage.getItem("usuarios")) || [];
      usuariosGuardados.push(usuario);
      localStorage.setItem("usuarios", JSON.stringify(usuariosGuardados));
      this.ultimoRegistrado = usuario;
      this.Nombre = "";
      this.Apellido = "";
      this.IdAlf = null;
    },
  },
};
</script>

<style scoped>
#inicio {
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

.ingreso {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.ingreso input {
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.ingreso input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
}

.ingreso input::placeholder {
  color: #a0aec0;
}

.error {
  background-color: #fff5f5;
  color: #e53e3e;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  border-left: 4px solid #fc8181;
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

.registro {
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #f0fff4;
  border-radius: 8px;
  border-left: 4px solid #48bb78;
}

.registro p {
  color: #2f855a;
  margin: 0;
  font-size: 0.95rem;
  text-align: center;
}

.registro .id {
  margin-top: 0.5rem;
  font-weight: 600;
}

@media (max-width: 640px) {
  #inicio {
    margin: 1rem;
    padding: 1.5rem;
  }

  h1 {
    font-size: 1.5rem;
  }
}
</style>
