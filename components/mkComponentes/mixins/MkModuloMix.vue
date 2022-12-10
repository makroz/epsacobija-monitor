<script>
import MkForm from '@/components/mkComponentes/MkFormulario'
import MkRulesMix from '@/components/mkComponentes/mixins/MkRulesMix'
import MkOncesMix from '@/components/mkComponentes/mixins/MkOncesMix'
import Swal from 'sweetalert2'
import {
  c,
  getDataLista,
  getTitFromName,
  formatDT
} from '@/components/mkComponentes/lib/MkUtils.js'
import { getCache, setCache } from '@/components/mkComponentes/lib/MkCache.js'

const _storage = process.env.mkConfig.storageUrl
const _lap = process.env.mkConfig.authKey
const _dirty = process.env.mkConfig.dirty

export default {
  name: 'MkModuloMix',
  layout: 'dashboard',
  components: {
    MkForm
  },
  mixins: [MkRulesMix, MkOncesMix],
  data() {
    return {
      colaSave: [],
      created: true,
      urlModulo: this.$options.name,
      titModulo: getTitFromName(this.$options.name),
      accion: '',

      //filtros y busqueda

      //modal
      modal: false,
      tituloModal: '',

      paramsExtra: {},
      item: {
        id: 0,
        name: ''
      },
      dirty: {
        item: {}
      },
      formVerif: false,
      cacheCan: {
        1: false,
        2: false,
        4: false,
        8: false
      },
      Auth: {
        recycled: false,
        authAccess: this.$options.authAccess || this.$options.name,
        proteger: this.$options.middleware || '',
        _updateData: this._updateData
      },
      grabarDebug: false,
      colaOk: 0,
      colaError: []
    }
  },
  methods: {
    logger(message, action = '0') {
      let m = {}
      m.message = message
      if (action > 0) {
        m.action = action
      }
      this.$store.dispatch('auth/logger', m)
    },
    async grabarCola(def = 0) {
      console.log(
        'empieza grabar cola',
        this.colaSave.length,
        this.$store.state.auth.online
      )
      let me = this
      let response = {}
      if (this.$store.state.auth.online) {
        if (this.colaSave.length > 0) {
          let e = this.colaSave.pop()
          localStorage.setItem('colaSave', JSON.stringify(this.colaSave))
          try {
            if (e.method == 'put') {
              response = await me.$axios.put(e.url, e.data)
            } else {
              response = await me.$axios.post(e.url, e.data)
            }
          } catch (error) {
            response.data = { ok: -10 }
          }
          if (response.data.ok > 0) {
            this.colaOk++
          } else {
            this.colaError.push(e)
          }
          await this.grabarCola(1)
        }
        if (def == 0 && (this.colaOk > 0 || this.colaError.length > 0)) {
          if (this.colaError.length > 0) {
            this.colaSave = JSON.parse(JSON.stringify(this.colaError))
          }
          Swal.fire({
            position: 'center',
            title: 'Proceso Offline completo',
            html:
              '<b style="color:green">Correctos: ' +
              this.colaOk +
              '</b><br>' +
              '<b style="color:red">Errados: ' +
              this.colaError.length +
              '</b>',
            icon: 'warning',
            showConfirmButton: false,
            timer: 6000
          })
          // console.log(
          //   'Se completo el grabado offline... Correctos: ' +
          //     this.colaOk +
          //     ' con Error:' +
          //     this.colaError.length
          // )
          localStorage.setItem('colaSave', JSON.stringify(this.colaSave))
          this.colaOk = 0
          this.colaError = []
          this.afterSave(me, 0)
        }
      }
    },
    async execOnline() {
      let ping = await this.ping()
      this.$store.commit('auth/setOnline', ping)
      if (ping) {
        document.body.classList.remove('offline')
        document.body.classList.add('online')
        this.grabarCola()
      } else {
        document.body.classList.remove('online')
        document.body.classList.add('offline')
      }
      return ping
    },
    goOnline() {
      this.execOnline()
      console.log('internet Online', this.$store.state.auth.online)
    },
    goOffline() {
      document.body.classList.remove('online')
      document.body.classList.add('offline')
      this.$store.commit('auth/setOnline', false)
      console.log('internet Offline')
    },
    goLoad() {
      this.execOnline()
      console.log('internet Load', this.$store.state.auth.online)
    },
    async ping() {
      try {
        await this.$axios.head(process.env.mkConfig.baseURL + 'ping', {})
        return true
      } catch (error) {
        return false
      }
    },
    formatDT(d = '', time = true) {
      return formatDT(d, time)
    },
    getDataLista(
      lista,
      valor,
      busco = 'id',
      devuelvo = 'name',
      defa = false,
      index = false
    ) {
      return getDataLista(lista, valor, busco, devuelvo, defa, index)
    },
    async getDatasBackend(mod, listas) {
      let data = await this.$store.dispatch('auth/loadDatas', {
        mod: mod,
        listas: listas
      })
      listas.forEach((el) => {
        let datos = {}
        if (el.lista && el.lista != '') {
          datos = data[el.lista]
        } else {
          datos = data[el.mod]
          el.lista = 'l' + el.mod
        }

        if (el.item) {
          if (el.item.isArray) {
            el.item.forEach((e) => this.updateListCol(e, datos))
          } else {
            this.updateListCol(el.item, datos)
          }
        }
        if (typeof el.each === 'function' && Array.isArray(datos)) {
          datos.forEach(el.each)
        }

        let sort = el.sort || false
        if (sort && Array.isArray(datos)) {
          datos.sort(function(a, b) {
            return a[sort] - b[sort]
          })
        }

        let sortAsc = el.sortAsc || false
        if (sortAsc && Array.isArray(datos)) {
          datos.sort(function(a, b) {
            return b[sortAsc] - a[sortAsc]
          })
        }

        if (el.lista != '') {
          if (this[el.lista]) {
            this[el.lista] = datos
          }
        }
      })
      return data
    },
    getDataCache(data, url, paginate = true, lista = 1) {
      if (paginate) {
        paginate = false
      }

      return this.$store.getters['auth/getDataCache'](
        data,
        url,
        paginate,
        lista
      )
    },
    getCt(url, paginate = true, lista = 1) {
      if (paginate) {
        paginate = false
      }
      return this.$store.getters['auth/getCt'](url, paginate, lista)
    },
    isOk(data, url = '') {
      //console.log('Entro a isok',data);
      if (data._warning) {
        data._warning.forEach((e) => {
          c(e[0], e[2], e[1], e[3])
        })
      }
      if (data.ok < 0) {
        c(data.msg, this.$options.name, 'error', 'error')
        if (data.ok == -401 || data.ok == -1001) {
          this.$store.dispatch('auth/logout')
        }
        return false
      }
      return true
    },
    beforeSave(me) {},
    afterSave(me, isError = 0) {},
    async grabarItem() {
      let me = this
      //console.log('url6',this.urlModulo);
      //if (!me.$refs.mkForm.$refs.form.validate()) {
      if (!me.formVerif) {
        me.formVerif = me.$refs.mkForm.$refs.form
      }
      //console.log('entro');
      if (!me.formVerif.validate()) {
        return false
      }
      //console.log('siguio');
      let isError = 0
      if (this.grabarDebug) {
        console.log('item antes de Grabar:', me.item)
      }
      //console.log('url7',this.urlModulo);
      let x = await me.beforeSave(me)
      if (x === false) {
        console.log('no grabo x beforeSave')
        return false
      }
      //console.log('url8',this.urlModulo);
      if (me.MkImgMix && typeof me.mkImgData.myImg.hasImage === 'function') {
        // // me.item.imgDel=me.mkImgData.imgDel;
        // me.item.imgFile='';
        me.mkImgData.refresh = true
        if (!me.mkImgData.imgDel) {
          if (me.mkImgData.myImg.hasImage()) {
            //    me.mkImgData.refresh = true
            me.item.imgFile = this.mkImgData.myImg.generateDataUrl(
              'image/png',
              0.7
            )
            //        let blob = await this.mkImgData.myImg.promisedBlob();
            //          me.item.imgFile = blob;
            //            alert('size: ' +me.item.imgFile.size)

            //alert('1',me.item.imgFile.size);
          }
        } else {
          me.item.imgDel = me.mkImgData.imgDel
        }
      }

      let itemData = {}
      if (me.item.id !== null && me.item.id > 0) {
        if (!this.can('edit', true)) {
          return false
        }
        let url = me.urlModulo + '/' + me.item.id

        if (_dirty) {
          for (const el in me.item) {
            if (
              JSON.stringify(me.dirty.item[el]) != JSON.stringify(me.item[el])
            ) {
              if (me.item[el] !== undefined && el.indexOf('_temp_') == -1) {
                itemData[el] = me.item[el]
              }
            }
          }
          if (Object.keys(itemData).length === 0) {
            me.closeDialog()
            me.afterSave(me, 1)
            if (this.grabarDebug) {
              alert('esta vacio', me.item)
            }
            return false
          }
        } else {
          itemData = me.item
        }
        if (me.item._noData) {
          itemData._noData = me.item._noData
        }
        itemData.id = me.item.id
        if (this.grabarDebug === true) {
          //console.log('url:', url + this.getCt(url))
          console.log('datos', itemData)
          me.afterSave(me, isError)
          me.formVerif = false
          return true
        }
        if (!this.$store.state.auth.online) {
          this.setColaGrabar(
            'put',
            url + this.getCt(url),
            itemData,
            me.urlModulo
          )
        } else {
          me.$axios
            .put(url + this.getCt(url), itemData)
            .then(function(response) {
              if (me.isOk(response.data)) {
                me.closeDialog()
              } else {
                isError = -1
              }
            })
            .catch(function(error) {
              if (error.message === 'Network Error') {
                this.setColaGrabar(
                  'put',
                  url + this.getCt(url),
                  itemData,
                  me.urlModulo
                )
                alert(
                  'Error de Conexion sin Internet, el Registro se enviara en cuanto se tenga conexion...'
                )
              }
              console.error(error)
              isError = -2
            })
            .finally(function() {
              me.afterSave(me, isError)
            })
        }
      } else {
        if (!this.can('add', true)) {
          return false
        }
        if (me.item.id == null) {
          delete me.item.id
        }

        let url = me.urlModulo
        if (this.grabarDebug === true) {
          // console.log('url:', url + this.getCt(url))
          console.log('datos', me.item)
          me.afterSave(me, isError)
          me.formVerif = false
          return true
        }
        //console.log('url',url,me.urlModulo,this.urlModulo)
        if (!this.$store.state.auth.online) {
          this.setColaGrabar(
            'post',
            url + this.getCt(url),
            me.item,
            me.urlModulo
          )
        } else {
          me.$axios
            .post(url + this.getCt(url), me.item)
            .then(function(response) {
              if (me.isOk(response.data)) {
                me.closeDialog()
                me.paramsExtra = {}
              } else {
                isError = -1
              }
            })
            .catch(function(error) {
              if (error.message === 'Network Error') {
                me.setColaGrabar(
                  'post',
                  url + this.getCt(url),
                  me.item,
                  me.urlModulo
                )
                alert(
                  'Error de Conexion sin Internet, el Registro se enviara en cuanto se tenga conexion...'
                )
              }
              console.error(error)
              isError = -2
            })
            .finally(function() {
              me.afterSave(me, isError)
              me.formVerif = false
            })
        }
      }
    },
    beforeOpen(accion, data = {}) {},
    afterOpen(accion, data = {}) {},
    closeDialog() {
      this.tituloModal = ''
      this.modal = false
    },
    setColaGrabar(method, url, datos, proc) {
      let cola = false
      if (proc == 'Evaluaciones' && method == 'post') {
        this.colaSave.map((e) => {
          if (
            e.method == method &&
            e.data.beneficiarios_id == datos.beneficiarios_id &&
            e.data.ruteos_id == datos.ruteos_id
          ) {
            cola = e
          }
        })
      }
      if (proc == 'SolicitudServicios' && method == 'put') {
        this.colaSave.map((e) => {
          if (e.method == method && e.data.id == datos.id) {
            cola = e
          }
        })
      }
      //console.log('cola3',eva.data.beneficiarios_id , datos.beneficiarios_id);
      if (cola) {
        console.log('cola', cola)
        cola.fecha = new Date()
        cola.data = datos
      } else {
        this.colaSave.push({
          fecha: new Date(),
          method: method,
          url: url,
          data: datos,
          proc: proc
        })
      }
      localStorage.setItem('colaSave', JSON.stringify(this.colaSave))
      //console.log('cola2',this.colaSave);
      this.closeDialog(proc, datos)
      alert(
        'se Puso en Cola la grabacion porque no hay Conexion Actualmente...'
      )
      return true
    },
    async openDialog(accion, data = {}, open = true) {
      if (!this.can(accion, true)) {
        return false
      }
      this.accion = accion

      if (!this.formVerif) {
        this.formVerif = this.$refs.mkForm.$refs.form
      }
      this.formVerif.resetValidation()

      this.item = Object.assign({}, data)
      data = this.item
      if ((await this.beforeOpen(accion, this.item)) == false) {
        return false
      }

      //mkImg
      if (this.MkImgMix) {
        this.mkImgData.remove = true
        let d = new Date()
        let prefix = this.imgPrefix || this.$options.name
        this.mkImgData.imgFile = ''
        let id_img=this.item._temp_id_img || this.item.id
        if (!this.item.noImage && this.accion != 'add') {
          if (this.item._temp_offline != -1) {
            this.mkImgData.imgFile =
              _storage + prefix + '_' + id_img + '.png?v=' + d.getTime()
          } else {
            if (this.item.imgFile != '') {
              this.mkImgData.imgFile = this.item.imgFile
              console.log(this.mkImgData.imgFile)
            }
          }
        }
        this.mkImgData.file = ''
        this.mkImgData.imgCanDel = accion == 'edit'
        this.mkImgData.imgCanEdit = accion == 'edit'
        this.mkImgData.imgDel = false
      }
      //mkImg

      if (accion == 'add') {
        this.item.id = null
        this.tituloModal = 'Registrar ' + this.titModulo
      }

      this.dirty.item = {}
      if (accion != 'add') {
        if (_dirty && this.item._temp_offline != -1) {
          this.dirty.item = JSON.parse(JSON.stringify(this.item))
          //console.log('before dirty ditty',this.dirty.item);
        }
        if (accion == 'edit') {
          this.tituloModal =
            '(' + this.item.id + ') ' + 'Editar ' + this.titModulo
        }
      }

      if (this.$refs.focus) {
        this.$nextTick(this.$refs.focus.focus())
      }

      if (accion == 'show') {
        //this.item.id = this.item.id * -1
        this.tituloModal =
          '<span class="caption">(' +
          this.item.id +
          ') </span>' +
          'Ver ' +
          this.titModulo
      }
      this.afterOpen(accion, data)
      if (open) {
        this.modal = true
      }
      //
    },
    setParams(name = '', value = '', encrypt = false) {
      if (name == '') {
        name = 'paginator'
        value = false
        return false
      }
      setCache(this.$options.name + '.Params.' + name, value, encrypt)
    },
    getParams(name = '', def = false, encrypt = false) {
      return getCache(this.$options.name + '.Params.' + name, def, encrypt)
    },
    can(val, alertar = false, modulo = '') {
      let acceso = ''
      let guard = ''
      if (this.Auth) {
        acceso = this.Auth.authAccess || this.$options.name
        guard = this.$options.middleware || this.Auth.proteger || ''
      } else {
        acceso =
          this.authAccess || this.$options.authAccess || this.$options.name
        guard = this.$options.middleware || ''
      }
      if (modulo != '') {
        acceso = modulo
      }

      val = val.toLowerCase().trim()
      const permisos = this.$store.state.auth.permisos
      if (
        [permisos['edit'], permisos['add']].includes(permisos[val]) &&
        this.Auth.recycled
      ) {
        return false
      }

      if (typeof guard == 'string') {
        if (guard != 'authAccess') {
          return true
        }
      } else {
        if (!guard.includes('authAccess')) {
          return true
        }
      }

      let passed = this.$store.getters['auth/tienePermiso'](val, acceso)
      //console.error('Can mix:',val,':',acceso,'=',passed);
      if (!passed) {
        if (alertar) {
          if (alertar === true) {
            alertar = 'no tiene permisos'
          }
          //alert(alertar);
          Swal.fire({
            position: 'top-end',
            title: alertar,
            icon: 'warning',
            showConfirmButton: false,
            timer: 1500
          })
        }
      }

      return passed
    },
    _updateData(data, val) {
      this.Auth[data] = val
    },
    async getListaBackend(url, campos = '', item = null) {
      let lista = await this.$store.dispatch('auth/loadData', {
        url: url,
        campos: campos
      })
      if (item) {
        if (item.isArray) {
          item.forEach((e) => this.updateListCol(e, lista))
        } else this.updateListCol(item, lista)
      }
      return lista
    },
    async getDataBackend(url, campos = '', datos = null, method = '') {
      let data = await this.$store.dispatch('auth/loadData', {
        url: url,
        campos: campos,
        datos: datos,
        method: method
      })
      return data
    },
    async captureGps() {
      //this.getPosition()
      if (this.coordenadas.latitude) {
        let response = await this.$axios.post('Rastreo', {
          _noData: 1,
          lat: this.coordenadas.latitude || -1,
          lng: this.coordenadas.longitude || -1
        })
      }
    },
    rastreo() {
      //this.captureGps()
      setInterval(this.captureGps, 1000 * 60 * 5)
    }
  },
  watch: {
    Auth: {
      deep: true,
      handler: function(v, old) {
        //  console.log('wath',this.oldRecycled,v.recycled)
        if (this.oldRecycled != v.recycled) {
          this.listar()
          this.oldRecycled = v.recycled
        }
      }
    }
  },
  computed: {},
  provide: function() {
    return {
      can: this.can,
      Auth: this.Auth,
      setParams: this.setParams,
      getParams: this.getParams
    }
  },
  created: function() {
    window.addEventListener('offline', this.goOffline)
    window.addEventListener('load', this.goLoad)
    window.addEventListener('online', this.goOnline)

    this.$store.dispatch('auth/getUser')
    this.created = 2
  },
  beforeDestroy() {
    console.log('destruido')
    //navigator.geolocation.clearWatch(this.watchId)
    window.removeEventListener('offline', this.goOffline)
    window.removeEventListener('load', this.goLoad)
    window.removeEventListener('online', this.goOnline)
  },
  async mounted() {
    await this.ping()
    setTimeout(() => {
      this.getPosition(this.captureGps)
    }, 3000)

    //this.seguirPosition()
    this.rastreo()
    try {
      this.colaSave = JSON.parse(localStorage.getItem('colaSave'))
      if (!this.colaSave) {
        this.colaSave = []
      }
    } catch (error) {
      this.colaSave = []
    }
  }
}
</script>