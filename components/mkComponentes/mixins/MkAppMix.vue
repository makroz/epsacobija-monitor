<script>
import MkFormFullScreen from '~/components/mkComponentes/MkFormFullScreen.vue'
import MkSimpleCard from '~/components/mkComponentes/mkCards/mkSimpleCard.vue'
import {
  getDataLista,
  getDistancia
} from '@/components/mkComponentes/lib/MkUtils.js'
import Swal from 'sweetalert2'
export default {
  name: 'MkAppMix',
  components: { MkFormFullScreen, MkSimpleCard },
  data() {
    return {
      location: false,
      coordenadas: {},
      lUsuarios: [],
      lBeneficiarios: [],
      lServicios: [],
      callBack: false,
      watchId: false
    }
  },
  methods: {
    async getRutasOptimizada(ruta, ordenar = true) {
      //console.log('ruta', ruta);
      if (!this.location) {
        alert('debe permitir que el sistema Capture su Ubicacion')
        return false
      }
      let camino = ''
      let r = {}
      if (ordenar) {
        r = this.ordDistancia(ruta)
      } else {
        r.beneficiariosD = ruta
      }
      r.beneficiariosD.map((e) => {
        let lat = getDataLista(this.lBeneficiarios, e.id, 'id', 'lat')
        let lng = getDataLista(this.lBeneficiarios, e.id, 'id', 'lng')
        if (lat != null && lng != null) {
          camino = camino + lat + ',' + lng + '/'
        }
      })
      camino =
        'https://www.google.com/maps/dir/' +
        this.coordenadas.latitude +
        ',' +
        this.coordenadas.longitude +
        '/' +
        camino +
        '@' +
        this.coordenadas.latitude +
        ',' +
        this.coordenadas.longitude +
        '/am=t&dir_action=navigate'
      //console.log('camino',camino);
      window.open(camino)
      return true
    },
    distancia(d) {
      if (!d) {
        return -1
      }
      if (!this.coordenadas.latitude || !this.coordenadas.longitude) {
        return 0
      }
      return getDistancia(
        this.coordenadas.latitude,
        this.coordenadas.longitude,
        d.lat,
        d.lng
      )
    },
    verMapaBene(bene, google = false) {
      this.getPosition()
      let benef = getDataLista(this.lBeneficiarios, bene, 'id', '*')
      if (!this.location) {
        alert('debe permitir que el sistema Capture su Ubicacion')
        return false
      }
      if (benef.lat == null || benef.lat == '') {
        alert('No tiene ubicacion Valida')
        return false
      }
      let url =
        'https://www.google.com/maps/dir/?api=1&origion=' +
        this.coordenadas.latitude +
        ',' +
        this.coordenadas.longitude +
        '&destination=' +
        benef.lat +
        ',' +
        benef.lng +
        '&dir_action=navigate'
      window.open(url)
    },
    seguirPosition() {
      this.watchId = navigator.geolocation.watchPosition(
        this.successWatch,
        this.handleError
      )
    },
    successWatch(position) {
      this.coordenadas = position.coords
      this.item.lat = this.coordenadas.latitude
      this.item.lng = this.coordenadas.longitude
      //this.captureGps()
      //console.log(position)
      //alert(position.coords.latitude + ':' + position.coords.longitude)
    },
    handleError(error) {
      // Display error based on the error code.
      const { code } = error
      switch (code) {
        case GeolocationPositionError.TIMEOUT:s
          // Handle timeout.
          alert('error Timeout')
          break
        case GeolocationPositionError.PERMISSION_DENIED:
          // User denied the request.
          alert('error DENIED')
          break
        case GeolocationPositionError.POSITION_UNAVAILABLE:
          alert('error UNAVALIABLE')
          // Position not available.
          break
      }
    },
    getPosition(callBack = false, id = -1) {
      let options = {
        enableHighAccuracy: true,
        timeout: 6000,
        maximumAge: 1000
      }
      this.callBack = callBack
      this.location = id
      navigator.geolocation.getCurrentPosition(
        this.successGps,
        this.errorGps,
        options
      )
    },
    errorGps(error) {
      this.location = false
      console.warn('ERROR(' + error.code + '): ' + error.message)
    },
    Success() {},
    successGps(position) {
      if (
        this.coordenadas.latitude != position.coords.latitude ||
        this.coordenadas.longitude != position.coords.longitude
      ) {
        //this.captureGps()
        this.coordenadas = position.coords
        this.item.lat = this.coordenadas.latitude
        this.item.lng = this.coordenadas.longitude
        this.Success()
      }
      if (this.callBack != false) {
        this.callBack(this.location)
      }
      this.location = true
      this.callBack = false
    }
  }
}
</script>