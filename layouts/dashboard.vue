<template>
  <div id="appRoot" style="overscroll-behavior-y: none;">
    <template>
      <v-app id="inspire" class="app" data-app="" style="overscroll-behavior-y: none;">
        <app-drawer class="app--drawer hidden-print-only"></app-drawer>
        <app-toolbar class="app--toolbar hidden-print-only"></app-toolbar>
        <v-content>
          <!-- Page Header -->
          <!-- <page-header></page-header> -->
          <div class="page-wrapper">
            <nuxt />
          </div>
          <!-- App Footer -->
          <v-footer
            height="auto"
            class="white pa-3 app--footer hidden-print-only"
          >
            <span class="caption">&copy; {{ new Date().getFullYear() }}</span>
            <v-spacer></v-spacer>
            <span class="caption mr-1"> Made with love </span>
            <v-icon @click="showSetting()" color="pink" small>favorite</v-icon>
          </v-footer>
        </v-content>
        <!-- Go to top -->
        <app-fab></app-fab>
        <!-- theme setting -->
        <v-btn
          v-if="setting == 2"
          small
          fab
          dark
          falt
          fixed
          top="top"
          right="right"
          class="setting-fab"
          color="red"
          @click="openThemeSettings"
        >
          <v-icon>settings</v-icon>
        </v-btn>
        <v-navigation-drawer
          class="setting-drawer"
          temporary
          right
          v-model="rightDrawer"
          hide-overlay
          fixed
        >
          <theme-settings v-if="setting == 2"></theme-settings>
        </v-navigation-drawer>
      </v-app>
    </template>

    <v-snackbar
      :timeout="3000"
      bottom
      right
      :color="snackbar.color"
      v-model="snackbar.show"
    >
      {{ snackbar.text }}
      <v-btn dark flat @click.native="snackbar.show = false" icon>
        <v-icon>close</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import AppDrawer from '@/components/AppDrawer'
import AppToolbar from '@/components/AppToolbar'
import AppFab from '@/components/AppFab'
import PageHeader from '@/components/PageHeader'
import ThemeSettings from '@/components/ThemeSettings'
//import {goOnline,goOffline} from '@/components/mkComponentes/lib/MkUtils.js'

export default {
  name: 'dashboard',
  components: {
    AppDrawer,
    AppToolbar,
    AppFab,
    PageHeader,
    ThemeSettings
  },
  data: () => ({
    expanded: true,
    rightDrawer: false,
    snackbar: {
      show: false,
      text: '',
      color: ''
    },
    setting: 0
  }),

  methods: {
    openThemeSettings() {
      this.$vuetify.goTo(0)
      this.rightDrawer = !this.rightDrawer
    },
    showSetting() {
      this.setting++
      if (this.setting > 2) {
        this.setting = 0
        this.rightDrawer = false
      }
    },
    showInstallPromotion() {
      //console.log('showInstallPromotion()')
      this.$store.commit('auth/setPwa', true)
    },
    hideInstallPromotion() {
      //console.log('hideInstallPromotion()')
      this.$store.commit('auth/setPwa', false)
    },
   
  },
  mounted() {
    console.log('mpontado')
    let deferredPrompt
    let t = this
    const buttonInstall = document.getElementById('buttonInstall')

    //if (location.protocol === 'https:') {
    try {
      window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault()
        // Stash the event so it can be triggered later.
        deferredPrompt = e
        // Update UI notify the user they can install the PWA
        t.showInstallPromotion()
        // Optionally, send analytics event that PWA install promo was shown.
        //console.log(`'beforeinstallprompt' event was fired.`)
      })
      buttonInstall.addEventListener('click', async () => {
        // Hide the app provided install promotion
        t.hideInstallPromotion()
        // Show the install prompt
        deferredPrompt.prompt()
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice
        // if (outcome !== 'accepted') {
        //   t.showInstallPromotion()
        // }
        // Optionally, send analytics event with outcome of user choice
        //console.log(`User response to the install prompt: ${outcome}`)
        // We've used the prompt, and can't use it again, throw it away
        deferredPrompt = null
      })

      window.addEventListener('appinstalled', () => {
        // Hide the app-provided install promotion
        t.hideInstallPromotion()
        // Clear the deferredPrompt so it can be garbage collected
        deferredPrompt = null
        // Optionally, send analytics event to indicate successful install
        console.log('PWA was installed')
      })
    } catch (error) {
      console.log('error de iniciar instalacion de la APP PWA')
    }
    //}
  }
}
</script>

<style lang="stylus" scoped>
.setting-fab {
  top: 50% !important;
  right: 0;
  border-radius: 0;
}

.page-wrapper {
  min-height: calc(100vh - 64px - 50px - 81px);
  margin-bottom: 50px;
}

.app--footer {
  position: absolute;
  bottom: 0;
  width: 100%;
}

@media print {
  .v-content {
    padding: 0 !important;
  }
}
</style>
        