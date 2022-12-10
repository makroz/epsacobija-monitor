<template>
  <div id="pageTable">
    <v-container grid-list-md fluid>
      <v-layout row wrap>
        <v-flex xs12>
          <v-card>
            <!-- presentacion -->
            <v-layout>
              <v-flex pa-4 class="text-xs-center">
                <img
                  style="max-width: 100%; max-height: 250px; height: auto"
                  src="~/static/img/recolector.jpg"
                />
              </v-flex>
              <v-flex>
                <v-card-title primary-title>
                  <div>
                    <div class="font-weight-medium">Bienvenido Recolector</div>
                    <div class="headline primary--text text-uppercase">
                      {{
                        $store.state.auth.authUser
                          ? $store.state.auth.authUser.name
                          : 'Guess'
                      }}
                    </div>
                    <div v-show="$store.state.auth.pwa">
                      <v-btn id="buttonInstall" large class="error">
                        Instalar APPLICACION
                      </v-btn>
                    </div>
                    <span>
                      Este es tu panel de control, donde podras visualizar todas
                      tus Recolecciones Disponibles y Activas, ademas de otros
                      datos importantes.</span
                    >
                  </div>
                </v-card-title>
              </v-flex>
            </v-layout>
            <v-divider light></v-divider>
            <!-- cuadritos informativos -->
            <v-card-actions class="pa-3">
              <v-layout align-space-around justify-space-around row fill-height>
                <mk-simple-card
                  title="Solicitudes Disponibles"
                  :text="lSolicitudServicios.length + ''"
                  color="green darken-4 grey--text"
                ></mk-simple-card>

                <mk-simple-card
                  title="Solicitudes Aceptadas"
                  :text="nAceptadas"
                  color="yellow darken-4"
                ></mk-simple-card>

                <mk-simple-card
                  title="Grabaciones Offline"
                  :text="colaSave.length"
                  color="red darken-4 white--text"
                ></mk-simple-card>
                <v-icon
                  :color="location ? 'green' : 'grey'"
                  @click="getPosition()"
                  >my_location</v-icon
                >
                <v-icon
                  :color="$store.state.auth.online ? 'green' : 'grey'"
                  @click="execOnline()"
                  >wifi</v-icon
                >
              </v-layout>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
      <!-- Solicitudes Disponibles -->
      <v-card>
        <v-toolbar color="green darken-4" dark>
          <v-toolbar-title>Solicitudes Disponibles</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-list two-line>
          <v-list-tile v-for="(sol, index) in lDispon" :key="index">
            <v-list-tile-avatar>
              <v-btn
                icon
                flat
                color="success"
                @click="verMapaBene(index, false)"
              >
                <v-icon large>directions_car</v-icon>
              </v-btn>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>
                <v-layout row wrap>
                  <v-flex>
                    <span class="title text-capitalize">
                      {{ sol.name ? sol.name : 'Desconicido' }}
                    </span>
                  </v-flex>
                </v-layout>
              </v-list-tile-title>
              <v-list-tile-sub-title class="caption">
                Cant. Solicitudes:
                {{ Object.keys(sol.lista).length }}
              </v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn icon color="primary" @click="aceptarSol(sol, index)" v-if="$store.state.auth.online" >
                <v-icon>add_task</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-card>
      <br />
      <!-- Solicitudes Aceptadas -->
      <v-card>
        <v-toolbar color="yellow darken-4" dark>
          <v-btn
            icon
            flat
            color="primary"
            @click.stop="getRutasOptimizada(lAsignadaD, false)"
          >
            <v-badge :value="true" color="red" overlap>
              <template v-slot:badge>
                <span>
                  {{ lAsignadaD.length }}
                </span>
              </template>
              <v-icon large>map</v-icon>
            </v-badge>
          </v-btn>

          <v-toolbar-title>Solicitudes Aceptadas</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-list two-line>
          <template v-for="(sol, index) in lAsignadaD">
            <v-list-tile
              v-if="lAsignada[sol.id] && lAsignada[sol.id].name"
              :key="index"
            >
              <v-list-tile-avatar>
                <v-btn
                  icon
                  flat
                  color="success"
                  @click="verMapaBene(sol.id, false)"
                >
                  <v-icon large>directions_car</v-icon>
                </v-btn>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>
                  <v-layout row wrap>
                    <v-flex>
                      <span class="title text-capitalize">
                        {{
                          lAsignada[sol.id].name
                            ? lAsignada[sol.id].name
                            : 'Desconocido'
                        }}
                      </span>
                      <span
                        class="caption red white--text"
                        v-if="lAsignada[sol.id]._temp_offline == -1"
                      >
                        OFF-LINE aun no se grabo!!
                      </span>
                    </v-flex>
                  </v-layout>
                </v-list-tile-title>
                <v-list-tile-sub-title class="caption">
                  Cant. Solicitudes:
                  Distancia: {{ (sol.distancia * 1.0).toFixed(2) }} Km
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-btn
                  icon
                  :color="
                    lAsignada[sol.id]._temp_offline == -1 ? 'red' : 'green'
                  "
                  dark
                  @click="realizarSol(lAsignada[sol.id], sol.id)"
                >
                  <v-icon>plumbing</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </template>
        </v-list>
      </v-card>
      <br />
      <!-- Solicitudes Realizadas -->
      <v-card>
        <v-toolbar color="blue darken-4" dark>
          <v-toolbar-title>Ordenes de Servicios 7 dias</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-list two-line>
          <v-list-tile
            class="elevation-1"
            v-for="(ordenes, index) in lOrdenes"
            :key="index"
          >
            <v-list-tile-avatar>
              <v-btn
                icon
                flat
                color="success"
                @click="verMapaBene(ordenes.beneficiario_id, false)"
              >
                <v-icon large>directions_car</v-icon>
              </v-btn>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>
                <v-layout row wrap>
                  <v-flex>
                    <span class="title text-capitalize">
                      {{
                        getDataLista(
                          lBeneficiarios,
                          ordenes.beneficiario_id,
                          'id',
                          'name',
                          'Desconocido'
                        )
                      }}
                    </span>
                  </v-flex>
                </v-layout>
              </v-list-tile-title>
              <v-list-tile-sub-title class="caption">
                {{ ordenes }}
                Orden No. {{ ordenes.id }} - Ref: {{ ordenes.ref }} <br />
                Fecha {{ formatDT(ordenes.created_at) }} Estado:
                {{ lEstadosSol[ordenes.estado] }}
              </v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn
                icon
                dark
                :color="lColorSol[ordenes.estado]"
                @click="verRealizadas(ordenes)"
              >
                <v-icon>visibility</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-card>
      <br />
      <!-- formulario Principal -->
      <mk-form-full-screen
        ref="mkForm"
        :modal="modal"
        :tit="tituloModal"
        :accion="accion"
        @closeDialog="closeDialog"
        @grabarItem="grabarItem"
        :bTitulo="bTitulo"
        :menuBottom="true"
      >
        <mk-show-solicitud
          :item="item"
          :accion="item.accion"
          :lBeneficiarios="lBeneficiarios"
          :lForma_pagos="lForma_pagos"
          :lEstadosSol="lEstadosSol"
          :lMateriales="lMateriales"
          :lServices="lServices"
          :lMedidas="lMedidas"
          :lControl_calidades="lControl_calidades"
          :mkImgData="mkImgData"
        >
        </mk-show-solicitud>
      </mk-form-full-screen>
    </v-container>
  </div>
</template>
<script>
import MkModuloMix from '@/components/mkComponentes/mixins/MkModuloMix'
import MkAppMix from '@/components/mkComponentes/mixins/MkAppMix'
import MkEstadosMix from '@/components/mkComponentes/mixins/MkEstadosMix'
import MkImgMix from '@/components/mkComponentes/mixins/MkImgMix'
import MkShowSolicitud from '@/components/mkComponentes/MkShowSolicitud'

export default {
  middleware: ['authAccess'],
  mixins: [MkModuloMix, MkAppMix, MkEstadosMix, MkImgMix],
  components: { MkShowSolicitud },
  name: 'Recolector',
  data() {
    return {
      urlModulo: 'SolicitudServicios',
      lSolicitudServicios: [],
      lDispon: {},
      lAsignada: {},
      lAsignadaD: [],
      lServices: [],
      lMateriales: [],
      lMedidas: [],
      lForma_pagos: [],
      lControl_calidades: [],
      lOrdenes: {},
      nAceptadas: 0,
      imgPrefix: 'solicitud_servicios',
      bTitulo: '',
      ordBenef: 'lAsignada'
      //grabarDebug:true,
    }
  },
  methods: {
    aceptarSol(data, id) {
      data.id = id
      data.estado = 1
      data.accion = 'aceptar'
      this.openDialog('edit', data)
    },
    realizarSol(data, id) {
      data.id = id
      data.estado = 2
      data.accion = 'realizar'
      data._temp_id_img=data.orden_servicios_id
      this.openDialog('edit', data)
    },
    verRealizadas(data) {
      if (data.estado == 0) {
        data.estado = 3
      }
      data._temp_id_img=data.orden_servicios_id
      data.accion = 'show'
      this.openDialog('edit', data)
    },
    getSolicitudServicios() {
      let user = this.$store.state.auth.authUser.id
      let fecha = new Date()
      fecha.setDate(fecha.getDate() - 7)
      return [
        {
          mod: 'SolicitudServicios',
          datos: {
            modulo: 'mkServicios',
            rel: 1,
            filtros: [['estado', '=', '1']]
          },
          each: (e) => {
            if (e.estado == 1) {
              if (this.lDispon[e.beneficiarios_id]) {
                this.lDispon[e.beneficiarios_id].lista[e.id] = e
              } else {
                this.lDispon[e.beneficiarios_id] = {
                  name: this.getDataLista(
                    this.lBeneficiarios,
                    e.beneficiarios_id,
                    'id',
                    'name',
                    'Desconocido'
                  ),
                  lista: {}
                }
                this.lDispon[e.beneficiarios_id].lista[e.id] = e
              }
            }
          }
        },
        {
          mod: 'SolicitudServicios',
          lista: 'Asignado',
          datos: {
            modulo: 'mkServicios',
            filtros: [
              ['estado', '=', '2'],
              ['usuarios_id_2', '=', user]
            ]
          },
          each: (e) => {
            if (e.estado == 2) {
              if (this.lAsignada[e.beneficiarios_id]) {
                this.lAsignada[e.beneficiarios_id].lista[e.id] = e
              } else {
                this.lAsignada[e.beneficiarios_id] = {
                  name: this.getDataLista(
                    this.lBeneficiarios,
                    e.beneficiarios_id,
                    'id',
                    'name',
                    'Desconocido'
                  ),
                  lista: {}
                }
                this.lAsignada[e.beneficiarios_id].lista[e.id] = e
                this.lAsignadaD.push({
                  id: e.beneficiarios_id,
                  distancia: 0
                })
              }
            }
          }
        },
        {
          mod: 'Orden_servicios',
          datos: {
            modulo: 'mkServicios',
            filtros: [
              ['created_at', '>', fecha],
              ['recolector_id', '=', user]
            ]
          },
          each: (e) => {
            this.lOrdenes[e.id] = {
              name: this.getDataLista(
                this.lBeneficiarios,
                e.beneficiario_id,
                'id',
                'name',
                'Desconocido'
              ),
              lista: {},
              ...e
            }
          }
        },
        {
          mod: 'SolicitudServicios',
          lista: 'Realizados',
          datos: {
            modulo: 'mkServicios',
            relations: ['materiales', 'qa'],
            filtros: [
              ['usuarios_id_3', '=', user],
              ['fecha_3', '>', fecha],
              ['orden_servicios_id', '>', 0]
            ]
          },
          each: (e) => {
            if (this.lOrdenes[e.orden_servicios_id]) {
              this.lOrdenes[e.orden_servicios_id].lista[e.id] = e
            }
          }
        }
      ]
    },
    closeDialog(proc = '', data = false) {
      if (data) {
        console.log(proc, data)
        if (proc == 'SolicitudServicios') {
          this.lAsignada[data.id] = {...this.lAsignada[data.id],ref:data.ref,forma_pago_id:data.forma_pago_id,obs:data.obs}
          this.lAsignada[data.id]._temp_offline = -1
          if (data.imgFile){
            this.lAsignada[data.id].imgFile = data.imgFile
          }
          data.servicios.forEach((e)=>{
            if (this.lAsignada[data.id] && this.lAsignada[data.id].lista && this.lAsignada[data.id].lista[e.sol_id]){
            this.lAsignada[data.id].lista[e.sol_id].estado = e.realizado?3:9
            this.lAsignada[data.id].lista[e.sol_id].obs = e.obs
            this.lAsignada[data.id].lista[e.sol_id].materiales = e.materiales
            }
            
          })
        }
      }
      this.restoreTab()
      this.tituloModal = ''
      this.modal = false
    },
    restoreTab() {
      window.scrollTo(0, this.scrollTop)
    },
    beforeSave(me) {
      let servicios = []
      for (const obj in me.lServices) {
        if (me.lServices[obj].selected == true) {
          let service = {
            id: me.lServices[obj].id,
            //cant: me.lServices[obj].cantidad,
            sol_id: me.lServices[obj].sol_id
          }

          if (me.item.accion == 'realizar') {
            //if (me.item.estado == 2) {
            service.realizado = me.lServices[obj].realizado
            service.obs = me.lServices[obj].obs_sol
            if (service.realizado) {
              service.materiales = me.lServices[obj].materiales
            }
          }

          servicios.push(service)
        }
      }
      me.item.servicios = servicios
      //me.item.beneficiario_id = servicios
      //me.item.estado = (me.item.estado * 1) + 1
      me.item.estado++
    },
    async afterSave(me, isError = 0) {
      //console.log('aftersve', isError)
      if (isError > -1) {
        this.lDispon = {}
        this.lAsignada = {}
        this.lOrdenes = {}
        this.lAsignadaD = []
        //let filtros = [['OR', ['estado', '=', '1'], ['estado', '=', '2']]]s
        let listas = await this.getDatasBackend(
          this.urlModulo,
          this.getSolicitudServicios()
        )
        this.nAceptadas = listas.Asignado.length
        this.coordenadas = {}
        this.getPosition()
      } else {
        me.item.estado--
      }
      return true
    },
    async beforeOpen(accion, data = {}) {
      this.scrollTop = window.scrollY
      data._noData = 1
      data.lat = this.coordenadas.latitude
      data.lng = this.coordenadas.longitude
      if (accion == 'show') {
        data.accion = accion
      }
      this.lServices = []
      if (accion == 'add') {
        this.bTitulo = ''
        //this.itemData.epsa = ''
        data.estado = -1
        data.foto = 0
        data.accion = 'add'

        this.lServicios.forEach((e) => {
          this.lServices.push({
            cantidad: 1,
            estado: -1,
            selected: null,
            ...e
          })
        })
      } else {
        let sel = null
        let lSol = Object.keys(data.lista)
        lSol.forEach((el) => {
          let e = data.lista[el]
          let serv = this.getDataLista(
            this.lServicios,
            e.servicios_id,
            'id',
            '*'
          )
          //aqui empeiza lo mismo que recolector
          if (serv) {
            let serv_ = {}
            if (e.estado == 2) {
              serv_ = {
                realizado: false,
                obs_sol: e.obs || '',
                obs_verif: e.obs_verif || '',
                materiales: []
              }
            }
            let qa = {}
            if (e.estado > 2 || data.estado > 3) {
              this.lControl_calidades.forEach((el) => {
                qa[el.id] = { selected: false, puntos: '' }
              })
              if (e.estado >= 4 && e.estado <= 7) {
                e.qa.forEach((el) => {
                  qa[el.id] = { selected: true, puntos: el.puntos }
                })
              }
              sel = 1
              e.estado = e.estado * 1
              serv_ = {
                realizado: e.estado != 9 && e.estado != 8 && e.estado != 1,
                verificado:
                  (e.estado > 3 && e.estado != 9) || data.estado > 3
                    ? data.estado >= 5 && e.estado < 8 && e.estado > 3
                      ? 4
                      : e.estado
                    : null,
                obs_sol: e.obs,
                obs_verif: e.obs_verif,
                materiales: e.materiales || [], //aqui
                qa: qa
              }
            }
            this.lServices.push({
              sol_id: e.id,
              cantidad: e.cant,
              fecha: e.created_at,
              estado: e.estado,
              evaluaciones_id: e.evaluaciones_id,
              monitor: this.getDataLista(
                this.lUsuarios,
                e.created_by,
                'id',
                'name',
                ''
              ),
              ...serv,
              ...serv_,
              selected: sel,
              cantidad: e.cant,
              cant: e.cant
            })
            //console.log('service', this.lServices)
          }
          //hasta aqui
        })
        data.noImage = !!!data.foto
        data.lista=undefined
        data.name=undefined
        data.noImage=undefined
        data.beneficiario_id=undefined
      }
    },
    afterOpen(accion, data) {
      if (data.accion == 'aceptar') {
        this.tituloModal = 'Aceptar Solicitudes'
        this.bTitulo = 'Aceptar'
      }
      if (data.accion == 'realizar') {
        this.tituloModal = 'Crear Nota de Servicio'
        this.bTitulo = 'Realizar'
      }
      if (data.accion == 'show') {
        this.tituloModal = 'Nota de Servicio ' + data.id
        this.accion = 'show'
      }
    },
    ordDistancia(lista) {
      let r = this.ordBeneficiarios(lista)

      return { beneficiariosD: r }
    },
    ordBeneficiarios(lista) {
      let r = []
      for (const index in lista) {
        if (Object.hasOwnProperty.call(lista, index)) {
          r.push({
            id: index,
            distancia: this.distancia(
              this.getDataLista(this.lBeneficiarios, index, 'id', '*')
            )
          })
        }
      }
      r.sort(function(a, b) {
        return a.distancia - b.distancia
      })
      return r
    },
    Success() {
      this.lAsignadaD = this.ordBeneficiarios(this.lAsignada)
    }
  },
  async mounted() {
    // this.ping()
    // setTimeout(() => {
    //   this.getPosition()
    // }, 3000)

    let listas = await this.getDatasBackend(this.urlModulo, [
      { mod: 'Usuarios', campos: 'id,name' },
      {
        mod: 'Beneficiarios',
        campos: 'id,name,epsa',
        datos: { _customFields: 1 }
      },
      {
        mod: 'Rutas',
        datos: { rel: 1 },
        campos: 'id,name,usuarios_id,descrip'
      },
      {
        mod: 'Materiales',
        datos: { modulo: 'mkServicios', filtros: [['lnota', '=', '1']] },
        campos: 'id,name,medida_id'
      },
      {
        mod: 'Medidas',
        datos: { modulo: 'mkServicios' },
        campos: 'id,simbolo'
      },
      {
        mod: 'Forma_pagos',
        datos: { modulo: 'mkServicios' },
        campos: 'id,name'
      },
      {
        mod: 'Servicios',
        each: (e) => {
          e.cantidad = 1
          e.selected = false
        }
      },
      {
        mod: 'Control_calidades',
        datos: { modulo: 'mkServicios' },
        campos: 'id,name,orden',
        orden: 'orden'
      },
      ...this.getSolicitudServicios()
    ])

    this.nAceptadas = listas.Asignado.length
    this.colaSave.map(e=>{
      this.closeDialog(e.proc,e.data)
    })

  }
}
</script>
<style scoped>
</style>
