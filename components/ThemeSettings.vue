<template>
  <div id="themeSetting">
    <v-toolbar color="blue" dark>
      <v-toolbar-title>Theme Settings</v-toolbar-title>
    </v-toolbar>
    <v-container>
      <v-layout column>
        <v-flex>
          <v-subheader class="px-1 my-2">Opciones de Cache</v-subheader>
          <div class="cache-option">
            <div class="my-3">
              <v-btn
                flat
                value="togleCache"
                @click="$store.commit('auth/toggleCache')"
                v-text="$store.state.auth.cacheActive?'Desactivar Cache':'Activar Cache'" />
                              <v-btn
                flat
                value="togleEncrypt"
                @click="$store.commit('auth/toggleEncrypt')"
                v-text="$store.state.auth.encryptActive?'Desactivar Encriptacion':'Activar Encriptacion'" />

<v-btn
                flat
                value="togleTblPos"
                @click="$store.commit('config/toggle_tbl_opts_p')"
                v-text="$store.state.config.tbl_opts_p?'Posicion de las Opciones de Listados: Al Final':'Posicion de las Opciones de Listados: Al Inicio'" />


              <v-btn flat value="clearCache" @click="clearCache()">Borrar Cache</v-btn>
              
              <v-btn flat value="clearOffiline" @click="clearOffline()">Borrar OFFLINE</v-btn>

              <v-btn flat value="clearParams" @click="clearParams(true)">Borrar Parametros del Modulo {{ modulo }}</v-btn>
                            <v-btn flat value="clearParams" @click="clearParams(false)">Borrar Todos Parametros</v-btn>
            </div>
          </div>
          <v-subheader class="px-1 my-2">Color Option</v-subheader>
          <div class="color-option">
            <v-layout wrap>
              <label
                class="color-option--label flex xs2 pa-1"
                v-for="(option,index) in themeColorOptions"
                :key="index"
              >
                <input type="radio" name="color" v-bind:value="option.key" v-model="themeColor" />
                <span class="color-option--item bg">
                  <span class="overlay">
                    <span class="material-icons">check</span>
                  </span>
                  <span class="color-option--item--header sideNav" :class="option.value.sideNav"></span>
                  <span class="color-option--item--header mainNav" :class="option.value.mainNav"></span>
                  <span class="sideMenu" :class="option.value.sideManu"></span>
                </span>
              </label>
            </v-layout>
          </div>
          <div class="theme-options">
            <v-subheader class="px-1 my-2">Sidebar Option</v-subheader>
            <v-divider></v-divider>
            <div class="my-3">
              <v-btn-toggle v-model="sideBarOption">
                <v-btn flat value="dark">Dark</v-btn>
                <v-btn flat value="light">Light</v-btn>
              </v-btn-toggle>
            </div>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { c } from '@/components/mkComponentes/lib/MkUtils.js'
import colors from 'vuetify/es5/util/colors'
export default {
  data() {
    return {
      themeColor: 'indigo',
      sideBarOption: 'light',
      colors: colors,
      modulo: '',
    }
  },
  methods: {
    clearOffline(mod = false) {
          localStorage.removeItem('colaSave')
          alert('Transacciones OFFLINE Eliminadas....')
    },

    clearCache(mod = false) {
      for (var key in localStorage) {
        if (key.indexOf('cache_') >= 0) {
          localStorage.removeItem(key)
        }
        c('se elimino Cache del Front', 'FrontEnd', 'Cache', 'warning')
      }
    },
    clearParams(mod = false) {
      let modulo = ''
      let c1 = 'FrontEnd'
      if (mod) {
        modulo =(this.$route.name+'').split('-').pop(0)
        modulo =modulo.charAt(0).toUpperCase() + modulo.slice(1)
      }
      for (var key in localStorage) {
        if (key.indexOf(modulo + '.Params.') >= 0) {
          localStorage.removeItem(key)
        }
        c('Se elimino Parametros del Cache del Front '+modulo, c1, 'Params', 'warning')
      }
    }
  },
  mounted() {
    this.modulo = (this.$route.name+'').split('-').pop(0)
  },
  computed: {
    themeColorOptions() {
      return [
        {
          key: 'blue',
          value: {
            sideNav: 'blue',
            mainNav: 'blue',
            sideManu: 'white'
          }
        },
        // {
        //   key: 'lightBlue',
        //   value: {
        //     sideNav: 'blue',
        //     mainNav: 'white',
        //     sideManu: 'blue lighten-1'
        //   }
        // },
        {
          key: 'teal',
          value: {
            sideNav: 'teal',
            mainNav: 'teal',
            sideManu: 'white'
          }
        },
        {
          key: 'red',
          value: {
            sideNav: 'red',
            mainNav: 'red',
            sideManu: 'white'
          }
        },
        {
          key: 'orange',
          value: {
            sideNav: 'orange',
            mainNav: 'orange',
            sideManu: 'white'
          }
        },
        // {
        //   key: 'purple',
        //   value: {
        //     sideNav: 'purple',
        //     mainNav: 'purple',
        //     sideManu: 'white'
        //   }
        // },
        {
          key: 'indigo',
          value: {
            sideNav: 'indigo',
            mainNav: 'indigo',
            sideManu: 'white'
          }
        },
        // {
        //   key: 'cyan',
        //   value: {
        //     sideNav: 'cyan',
        //     mainNav: 'cyan',
        //     sideManu: 'white'
        //   }
        // },
        {
          key: 'pink',
          value: {
            sideNav: 'pink',
            mainNav: 'pink',
            sideManu: 'white'
          }
        },
        // {
        //   key: 'green',
        //   value: {
        //     sideNav: 'green',
        //     mainNav: 'green',
        //     sideManu: 'white'
        //   }
        // }
      ]
    }
  },
  watch: {
    themeColor: {
      handler(val) {
        this.$vuetify.theme.primary = this.colors[val].base
      },
      immediate: true
    },
    sideBarOption: {
      handler(val) {
        this.$vuetify.dark = val === 'dark'
      },
      immediate: true
    }
  }
}
</script>
<style lang="stylus" scoped>
.color-option {
  &--label {
    position: relative;
    display: block;
    cursor: pointer;

    & input[type='radio'] {
      display: none;

      &+span {
        position: relative;

        &>.overlay {
          display: none;
          position: absolute;
          top: 0;
          bottom: 0;
          right: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.3);
          text-align: center;
          line-height: 30px;
          color: #fff;
        }
      }

      &:checked+span>.overlay {
        display: block;
      }
    }

    & .bg {
      background-color: #f1f1f1;
    }
  }

  &--item {
    overflow: hidden;
    display: block;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
    margin-bottom: 15px;

    &--header {
      height: 10px;
    }

    &>span {
      display: block;
      float: left;
      width: 50%;
      height: 20px;
    }
  }
}
</style>

