<!-- eslint-disable -->
<!-- prettier-ignore -->
<template>
    <div id="inicio">
        <div class="container">
            <h1>Registro de usuario</h1>
            <div class="form-group">
                <input type="text" v-model="Nombre" required placeholder="Ingrese su Nombre">
                <input type="text" v-model="Apellido" required placeholder="Ingrese su Apellido">
            </div>
            <div class="error-message" v-if="error">{{ error }}</div>
            <div>
                <button type="submit" class="btn-registrar" @click="Validacion">Registrar</button>
            </div>
            <div v-if="IdAlf">{{ Nombre }} {{ Apellido }} ha sido registrado con ID: {{ IdAlf }}</div>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
export default {
    name: "InicioView",
    data() {
        return {
            Nombre: '',
            Apellido: '',
            error: '',
            IdAlf: null
        }
    },
    methods: {
        generarId() {
            const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let id = '';
            for (let i = 0; i < 5; i++) {
                id += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
            }
            this.IdAlf = id;
        },
        Validacion() {
            this.error = '';
            this.IdAlf = null;

            // Validar campos vacíos
            if (!this.Nombre.trim()) {
                this.error = 'El nombre es requerido';
                return false;
            }
            if (!this.Apellido.trim()) {
                this.error = 'El apellido es requerido';
                return false;
            }

            const soloLetras = /^[A-Za-zÁáÉéÍíÓóÚúÑñ]+$/;

            // Validar nombre
            if (!soloLetras.test(this.Nombre)) {
                this.error = 'El nombre solo debe contener letras';
                return false;
            }

            // Validar apellido
            if (!soloLetras.test(this.Apellido)) {
                this.error = 'El apellido solo debe contener letras';
                return false;
            }

            this.generarId();
            return true;
        }
    }
}
</script>

<style scoped>
.container {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
}

.form-group {
    margin-bottom: 15px;
}

.form-group input {
    margin: 5px 0;
    padding: 5px;
    width: 100%;
}

.error-message {
    color: red;
    margin: 10px 0;
}

.btn-registrar {
    padding: 5px 10px;
}
</style>