<template>
  <v-navigation-drawer
    id="appDrawer"
    :mini-variant.sync="mini"
    fixed
    :dark="$vuetify.dark"
    app
    v-model="drawer"
    width="260"
  >
    <v-toolbar color="primary darken-1" dark>
      <!-- colocar estos titulos en store o config -->
      <v-toolbar-side-icon @click.stop="toggleDrawer()"></v-toolbar-side-icon>
      <img src="../static/logo.png" height="36" alt="Sistema EPSA Cobija" />
      <v-toolbar-title class="ml-0 pl-3">EPSA Cobija</v-toolbar-title>
      <v-spacer></v-spacer>
      <img src="../static/m.png" height="36" alt="Sistema EPSA Cobija" class="ml-1" />
    </v-toolbar>
    <vue-perfect-scrollbar class="drawer-menu--scroll" :settings="scrollSettings">
      <v-list dense>
        <v-subheader>Principal v.{{ version }}</v-subheader>
        <!-- level 1 begin-->
        <template v-for="(item, i) in menus">
          <v-subheader v-if="item.header" :key="i">
            {{
            item.header
            }}
          </v-subheader>
          <v-divider v-else-if="item.divider" :key="i"></v-divider>

          <v-list-tile
            :key="i"
            v-else-if="!item.items"
            :to="item.href ? item.href : null"
            ripple="ripple"
            :disabled="item.disabled"
            :target="item.target"
          >
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile>
          <v-list-group :key="i" v-else :prepend-icon="item.icon">
            <template v-slot:activator>
              <v-list-tile>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile>
            </template>
            <!-- level 2 begin -->
            <template v-for="(item2, i2) in item.items">
              <v-list-tile
                :key="i2"
                v-if="!item2.items"
                :to="item2.href ? item2.href : null"
                ripple="ripple"
                :disabled="item2.disabled"
                :target="item2.target"
              >
                <v-list-tile-action></v-list-tile-action>
                <v-list-tile-title>{{ item2.title }}</v-list-tile-title>
                <v-list-tile-action>
                  <v-icon>{{ item2.icon }}</v-icon>
                </v-list-tile-action>
              </v-list-tile>
              <v-list-group :key="i2" v-else sub-group no-action>
                <template v-slot:activator>
                  <v-list-tile>
                    <v-list-tile-title>{{ item2.title }}</v-list-tile-title>
                  </v-list-tile>
                </template>
                <!-- level 3 bengin -->
                <v-list-tile
                  v-for="(item3, i3) in item2.items"
                  :key="i3"
                  :to="item3.href ? item3.href : null"
                  ripple="ripple"
                  :disabled="item3.disabled"
                  :target="item3.target"
                  class="blue lighten-5"
                >
                  <v-list-tile-title class="pl-2" v-text="item3.title"></v-list-tile-title>
                  <v-list-tile-action>
                    <v-icon v-text="item3.icon"></v-icon>
                  </v-list-tile-action>
                </v-list-tile>
                <!-- level 3 end -->
              </v-list-group>
            </template>
            <!-- level 2 end -->
          </v-list-group>
        </template>
        <!-- level 1 end -->
      </v-list>
      <v-btn small class="error" @click="reload()">Recargar Pagina</v-btn>
      <br />
      <br />
      <v-btn small class="success" @click="clearOffline()">Limpiar OFFLINE</v-btn>
    </vue-perfect-scrollbar>
  </v-navigation-drawer>
</template>
<script>
import menu from '@/api/menu'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
const version = process.env.mkConfig.version
export default {
  name: 'app-drawer',
  components: {
    VuePerfectScrollbar
  },
  props: {
    expanded: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    version: version,
    mini: false,
    menus: menu,
    scrollSettings: {
      maxScrollbarLength: 160
    }
  }),
  computed: {
    drawer: {
      get() {
        return this.$store.state.drawer
      },
      set(val) {
        this.$store.commit('drawer', val)
      }
    },
    // computeGroupActive() {
    //   return true
    // },
    sideToolbarColor() {
      return this.$vuetify.options.extra.sideNav
    }
  },
  methods: {
    reload() {
      window.location.reload()
    },
    toggleDrawer() {
      this.$store.commit('toggleDrawer')
    },
    clearOffline(mod = false) {
      localStorage.removeItem('colaSave')
      alert('Transacciones OFFLINE Eliminadas....')
    }
  }
}
</script>


<style lang="stylus">
#appDrawer {
  overflow: hidden;

  .drawer-menu--scroll {
    height: calc(100vh - 48px);
    overflow: auto;
  }
}
</style>
