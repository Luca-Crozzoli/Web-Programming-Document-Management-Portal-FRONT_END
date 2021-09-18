<template>
  <b-button @click="logout" variant="primary">Logout</b-button>
</template>

<script>
export default {
  name: "Logout",
  methods: {
    logout() {
      localStorage.removeItem("JWTToken");
      localStorage.removeItem("Username");
      this.$emit('logout'); //evento gestito tramite l'entità messaggi
      this.$router.push("/"); //forzatura alla home page
    },
  },

};
</script>