<template>
    
</template>

<script>
    export default {
        async mounted()
        {
          const user = await this.$store.dispatch('auth/getUser');
          if (!user || !user.id) {
              return this.$router.push("/login/");
          }
          if (user.rol_slug=='monitor'){
            this.$router.push('/rutas/ruteosMonitor/')
          }else{
            this.$router.push('/recoleccion/recolector/')
          }
          
        }
    }
</script>

<style scoped>

</style>
