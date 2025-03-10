<template>
    <div id="inicio">
        <div>
            <h1>Registro de usuario</h1>
            <div>
                <input type="text" v-model="Nombre" required>ingrese su Nombre</input>
                <input type="text" v-model="Apellido" required> ingrese una Apellido</input>
            </div>
            <div>
                <button type="submit" class="btn-registrar" @click="Validacion">Registrar</button>
            </div>
            <div v-if="IdAlf">{{ Nombre }}, {{ Apellido }} ha sido registrado con ID: {{ IdAlf }}</div>
        </div>
    </div>
</template>

<script>
export default{
    data() {
        return{
            Nombre: '',
            Apellido: '',
            error: '',
            IdAlf: null,
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