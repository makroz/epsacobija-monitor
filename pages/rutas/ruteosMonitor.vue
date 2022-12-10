<template>
  <div id="pageTable" style="overscroll-behavior-y: contain !important;">
    <v-container grid-list-md fluid v-if="lRuteos.dispon">
      <v-layout row wrap>
        <v-flex xs12>
          <v-card>
            <!-- presentacion -->
            <v-layout v-bind="binding">
              <v-flex pa-4 class="text-xs-center">
                <img
                  style="max-width: 100%; height: auto"
                  src="~/static/img/hi.gif"
                />
              </v-flex>
              <v-flex>
                <v-card-title primary-title>
                  <div>
                    <div class="font-weight-medium">Bienvenido</div>
                    <div class="headline primary--text text-uppercase">
                      {{
                        $store.state.auth.authUser
                          ? $store.state.auth.authUser.name
                          : 'Desconocido'
                      }}
                    </div>
                    <div v-show="$store.state.auth.pwa">
                      <v-btn id="buttonInstall" large class="error">
                        Instalar APPLICACION
                      </v-btn>
                    </div>
                    <span>
                      Este es tu panel de control, donde podras visualizar todas
                      tus Rutas abiertas y Disponibles, ademas de otros datos
                      importantes.</span
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
                  title="Rutas Disponibles"
                  :text="lRuteos.dispon ? lRuteos.dispon.ok + '' : '0'"
                  color="green darken-4 grey--text"
                ></mk-simple-card>

                <mk-simple-card
                  title="Rutas Abiertas"
                  :text="lRuteos.open ? lRuteos.open.ok + '' : '0'"
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
                  >my_location</v-icon>
                  <v-icon
                  :color="$store.state.auth.online ? 'green' : 'grey'"
                  @click="execOnline()"
                  >wifi</v-icon>
              </v-layout>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
      <!-- Rutas Disponibles -->
      <v-card>
        <v-toolbar color="green darken-4" dark>
          <v-icon>add_location_alt</v-icon>
          <v-toolbar-title>Rutas Disponibles</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-list two-line>
          <v-list-tile
            v-for="ruta in lRuteos.dispon.data"
            :key="ruta.id"
          >
            <v-list-tile-avatar>
              <v-btn
                icon
                flat
                color="success"
                @click="getRutasOptimizada(ruta, true)"
              >
                <v-badge
                  :value="
                    getDataLista(lRutas, ruta.rutas_id, 'id', 'beneficiarios')
                  "
                  color="cyan"
                  overlap
                >
                  <template v-slot:badge>
                    <span>
                      {{
                        getDataLista(
                          lRutas,
                          ruta.rutas_id,
                          'id',
                          'beneficiarios',
                          []
                        ).length
                      }}</span
                    >
                  </template>
                  <v-icon large>map</v-icon>
                </v-badge>
              </v-btn>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>
                <v-layout row wrap>
                  <v-flex>
                    <span class="caption">
                      {{ ruta.id }}
                    </span>
                    <span class="title text-capitalize">
                      {{ getDataLista(lRutas, ruta.rutas_id) }}</span
                    >
                  </v-flex>
                </v-layout>
              </v-list-tile-title>
              <v-list-tile-sub-title class="caption">{{
                getDataLista(lRutas, ruta.rutas_id, 'id', 'descrip')
              }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn icon color="primary" @click="addRuteo(ruta)" v-if="$store.state.auth.online">
                <v-icon>add</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-card>
      <br />
      <!-- Rutas Abiertas -->
      <v-card>
        <v-toolbar color="yellow darken-4" dark>
          <v-icon>pin_drop</v-icon>
          <v-toolbar-title>Rutas Abiertas</v-toolbar-title>
        </v-toolbar>
        <v-list two-line dense>
          <v-list-group
            v-model="ruteo.active"
            v-for="ruteo in lRuteos.open.data"
            :key="ruteo.id"
            active-class="red"
            value="1"
          >
            <v-list-tile slot="activator" style="background-color: #EEEEEE">
              <v-list-tile-avatar>
                <v-btn
                  icon
                  flat
                  color="success"
                  @click.stop="
                    getRutasOptimizada(
                      getDataLista(lRutas, ruteo.rutas_id, 'id', '*'),
                      true
                    )
                  "
                >
                  <v-badge :value="true" color="cyan" overlap>
                    <template v-slot:badge>
                      <span>
                        {{
                          getDataLista(
                            lRutas,
                            ruteo.rutas_id,
                            'id',
                            'beneficiarios',
                            []
                          ).length
                        }}
                      </span>
                    </template>
                    <v-icon large>map</v-icon>
                  </v-badge>
                </v-btn>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>
                  <v-layout row wrap>
                    <v-flex>
                      <span class="caption">
                        {{ ruteo.id }}
                      </span>
                      <span class="title text-capitalize">
                        {{ getDataLista(lRutas, ruteo.rutas_id) }}
                      </span>
                      <span class="caption">
                        {{
                          getDataLista(lRutas, ruteo.rutas_id, 'id', 'descrip')
                        }}
                      </span>
                    </v-flex>
                  </v-layout>
                </v-list-tile-title>
                <v-list-tile-sub-title class="caption">
                  {{ getSubHeader(ruteo) }}
                  <!-- Abierto: {{ formatDT(ruteo['created_at']) }} - {{ ruteo.obs }} -->
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-btn
                  icon
                  color="primary"
                  @click.stop=""
                  large
                  v-if="
                    getDataLista(
                      lRutas,
                      ruteo.rutas_id,
                      'id',
                      'beneficiarios',
                      []
                    ).length -
                      ruteo.evaluaciones.length >
                      0
                  "
                >
                  <v-badge :value="true" color="green" overlap>
                    <template v-slot:badge>
                      <span>
                        {{
                          getDataLista(
                            lRutas,
                            ruteo.rutas_id,
                            'id',
                            'beneficiarios',
                            []
                          ).length - ruteo.evaluaciones.length
                        }}
                      </span>
                    </template>
                    <v-icon large>groups</v-icon>
                  </v-badge>
                </v-btn>
                <v-btn
                  v-else
                  icon
                  color="primary"
                  @click.stop="getPosition(setClose, ruteo.id)"
                  large
                  title="Cerrar Ruteo"
                >
                  <v-icon large>fact_check</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
            <v-list-tile
              v-for="bene in getDataLista(
                lRutas,
                ruteo.rutas_id,
                'id',
                'beneficiarios'
                //D
              )"
              :key="bene"
            >
              <v-list-tile-avatar class="pa-0 pm-0">
                <v-btn
                  icon
                  color="blue"
                  @click="verMapaBene(bene, true)"
                  small
                  style="margin: 0; margin-left: 3px"
                >
                  <v-icon>directions_car</v-icon>
                </v-btn>
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title>
                  <span class="caption"> {{ ruteo.id }}</span>
                  {{ getDataLista(lBeneficiarios, bene) }}
                </v-list-tile-title>
                <v-list-tile-sub-title class="caption">
                  {{
                    (
                      getDataLista(lBeneficiarios, bene, 'id', 'distancia', 0) *
                      1.0
                    ).toFixed(2)
                  }}
                  Km
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action> </v-list-tile-action>

              <v-list-tile-action>
                <v-btn
                  icon
                  :color="getColorEval(ruteo, bene)"
                  @click="openEval(ruteo, bene)"
                >
                  <v-icon>assignment</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </v-list-group>
        </v-list>
      </v-card>
      <br />
      <!-- Rutas Atrasadas  -->
      <v-card>
        <v-toolbar color="red darken-4" dark>
          <v-icon>fmd_bad</v-icon>
          <v-toolbar-title>Rutas Atrasadas </v-toolbar-title>
        </v-toolbar>
        <v-list two-line dense>
          <v-list-group
            v-model="ruteo1.active"
            v-for="ruteo1 in lRuteos.retrased.data"
            :key="ruteo1.id"
            active-class="grey"
          >
            <v-list-tile slot="activator" style="background-color: #EEEEEE"
              >>
              <v-list-tile-avatar>
                <v-btn
                  icon
                  flat
                  color="success"
                  @click.stop="
                    getRutasOptimizada(
                      getDataLista(lRutas, ruteo1.rutas_id, 'id', '*'),
                      true
                    )
                  "
                >
                  <v-badge :value="true" color="cyan" overlap>
                    <template v-slot:badge>
                      <span>
                        {{
                          getDataLista(
                            lRutas,
                            ruteo1.rutas_id,
                            'id',
                            'beneficiarios',
                            []
                          ).length
                        }}
                      </span>
                    </template>
                    <v-icon large>map</v-icon>
                  </v-badge>
                </v-btn>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title>
                  <v-layout row wrap>
                    <v-flex>
                      <span class="caption">
                        {{ ruteo1.id }}
                      </span>
                      <span class="title text-capitalize">
                        {{ getDataLista(lRutas, ruteo1.rutas_id) }}
                      </span>
                      <span class="caption">
                        {{
                          getDataLista(lRutas, ruteo1.rutas_id, 'id', 'descrip')
                        }}
                      </span>
                    </v-flex>
                  </v-layout>
                </v-list-tile-title>
                <v-list-tile-sub-title class="caption">
                  {{ getSubHeader(ruteo1) }}
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-btn
                  icon
                  color="primary"
                  @click.stop=""
                  large
                  v-if="
                    getDataLista(
                      lRutas,
                      ruteo1.rutas_id,
                      'id',
                      'beneficiarios',
                      []
                    ).length -
                      ruteo1.evaluaciones.length >
                      0
                  "
                >
                  <v-badge :value="true" color="green" overlap>
                    <template v-slot:badge>
                      <span>
                        {{
                          getDataLista(
                            lRutas,
                            ruteo1.rutas_id,
                            'id',
                            'beneficiarios',
                            []
                          ).length - ruteo1.evaluaciones.length
                        }}
                      </span>
                    </template>
                    <v-icon large>groups</v-icon>
                  </v-badge>
                </v-btn>
                <v-btn
                  v-else
                  icon
                  color="primary"
                  @click.stop="getPosition(setClose, ruteo1.id)"
                  large
                  title="Cerrar Ruteo"
                >
                  <v-icon large>fact_check</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
            <v-list-tile
              v-for="bene in getDataLista(
                lRutas,
                ruteo1.rutas_id,
                'id',
                'beneficiarios'
                //D
              )"
              :key="bene"
            >
              <v-list-tile-avatar class="pa-0 pm-0">
                <v-btn
                  icon
                  color="blue"
                  @click="verMapaBene(bene, true)"
                  small
                  style="margin: 0; margin-left: 3px"
                >
                  <v-icon>directions_car</v-icon>
                </v-btn>
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title>
                  {{ getDataLista(lBeneficiarios, bene) }}
                </v-list-tile-title>
                <v-list-tile-sub-title class="caption">
                  {{
                    (
                      getDataLista(lBeneficiarios, bene, 'id', 'distancia', 0) *
                      1.0
                    ).toFixed(2)
                  }}
                  Km
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action> </v-list-tile-action>

              <v-list-tile-action>
                <v-btn
                  icon
                  :color="getColorEval(ruteo1, bene)"
                  @click="openEval(ruteo1, bene)"
                >
                  <v-icon>assignment</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </v-list-group>
        </v-list>
      </v-card>
      <br />
      <!-- Rutas Cerradas -->
      <v-card>
        <v-toolbar color="blue darken-4" dark>
          <v-icon>where_to_vote</v-icon>
          <v-toolbar-title>Rutas Cerradas en estas 2 semanas</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-list tree-line>
          <v-list-tile
            v-for="rutaC in lRuteos.closed.data"
            :key="rutaC.id"
          >
            <v-list-tile-content>
              <v-list-tile-title>
                <v-layout row wrap>
                  <v-flex>
                    <span class="caption">
                      {{ rutaC.id }}
                    </span>
                    <span class="title text-capitalize">
                      {{ getDataLista(lRutas, rutaC.rutas_id) }}
                    </span>
                    
                    <span class="caption">
                      {{
                        getDataLista(lRutas, rutaC.rutas_id, 'id', 'descrip')
                      }}
                    </span>
                    <span class="caption red white--text" v-if="rutaC._temp_offline==-1">
                      OFF-LINE aun no se grabo!!
                    </span>
                  </v-flex>
                </v-layout>
              </v-list-tile-title>
              <v-list-tile-sub-title class="caption">
                Abierto el:
                {{ formatDT(rutaC.created_at) }}
              </v-list-tile-sub-title>
              <v-list-tile-sub-title class="caption">
                Cerrado el:
                {{ formatDT(rutaC.fec_cerrado) }}
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
      <br />
      <!-- formulario Principal -->
      <mk-form
        ref="mkForm"
        :modal="modal"
        :tit="tituloModal"
        :accion="accion"
        @closeDialog="closeDialog"
        @grabarItem="grabarItem"
        :menuBottom="true"
      >
        <v-container grid-list-md fluid>
          <v-text-field
            label="Observaciones"
            v-model="item.obs"
            ref="focus"
          ></v-text-field>
        </v-container>
      </mk-form>
      <mk-form-full-screen
        ref="mkFormEval"
        :modal="modalEval"
        :tit="tituloModal"
        :accion="accion"
        @closeDialog="closeEval"
        @grabarItem="grabarEval"
        :menuBottom="true"
      >
        <v-container grid-list-md fluid class="white">
          <v-switch
            v-model="estado"
            label="Se puede realizar la Evaluación?"
            color="indigo"
          >
          </v-switch>
          <v-text-field
            label="Notas de la Evaluación"
            v-model="item.obs"
            ref="focusEval"
            :rules="this.estado ? [] : [this.rules.required]"
            validate-on-blur
          ></v-text-field>

          <template v-if="estado && modalEval">
            <v-tabs centered color="indigo" dark icons-and-text>
              <v-tabs-slider color="yellow"></v-tabs-slider>

              <v-tab href="#tab-1" elevation-10>
                Encuesta
                <v-icon>content_paste</v-icon>
              </v-tab>

              <v-tab href="#tab-2" elevation-10>
                Servicios
                <v-icon>plumbing</v-icon>
              </v-tab>

              <v-tab-item value="tab-1">
                <v-card v-for="categ in lCateg" :key="categ.id" elevation-5>
                  <v-toolbar color="secondary" dark dense>
                    <v-toolbar-side-icon></v-toolbar-side-icon>
                    <v-toolbar-title> {{ categ.name }}</v-toolbar-title>
                  </v-toolbar>

                  <div
                    v-for="pregunta in lPregCateg(categ.id)"
                    :key="pregunta.pregunta"
                  >
                    <v-layout row wrap pa-2>
                      <v-flex grow>
                        <span class="title text-capitalize">
                          {{ pregunta.pregunta }}
                        </span>
                      </v-flex>
                      <v-flex shrink>
                        <v-text-field
                          v-if="pregunta.tipo == 2"
                          label="valor"
                          v-model="item.respuestas[pregunta.id]"
                          :rules="[rules.required, rules.num]"
                          validate-on-blur
                          type="number"
                          style="width: 80px"
                        ></v-text-field>

                        <v-radio-group
                          v-if="pregunta.tipo == 1"
                          v-model="item.respuestas[pregunta.id]"
                          row
                          :rules="[rules.required]"
                          validate-on-blur
                        >
                          <v-radio color="green" label="Si" value="1"></v-radio>
                          <v-radio color="red" label="No" value="0"></v-radio>
                        </v-radio-group>
                      </v-flex>
                    </v-layout>
                    <v-divider></v-divider>
                  </div>
                </v-card>
              </v-tab-item>
              <v-tab-item value="tab-2">
                <v-card>
                  <v-list>
                    <template v-for="servicio in lServicios">
                      <v-list-tile
                        :key="servicio.id"
                        :class="
                          servicio.selected
                            ? 'deep-purple lighten-5 deep-purple--text text--accent-4'
                            : ''
                        "
                      >
                        <v-list-tile-action>
                          <v-checkbox
                            v-if="servicio.estado == 0"
                            v-model="servicio.selected"
                            color="deep-purple accent-4"
                          ></v-checkbox>
                        </v-list-tile-action>

                        <v-list-tile-content>
                          <v-list-tile-title>
                            {{ servicio.name }}
                            <span style="font-size: 10px">
                              {{ servicio.obs }}
                              {{ servicio.estado }}
                            </span>
                          </v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-avatar v-if="servicio.selected">
                          <v-text-field
                            v-model="servicio.cantidad"
                            :disabled="
                              servicio.estado == 0
                                ? servicio.cant
                                  ? false
                                  : true
                                : true
                            "
                            :rules="[
                              rules.required,
                              rules.num,
                              rules.minVal(1)
                            ]"
                            validate-on-blur
                            color="primary"
                            :class="servicio.selectded ? 'secondary' : ''"
                            type="number"
                            min="1"
                            style="
                              font-size: 12px;
                              padding-bottom: 0;
                              padding-top: 12px;
                            "
                          ></v-text-field>
                        </v-list-tile-avatar>
                      </v-list-tile>
                    </template>
                  </v-list>
                </v-card>
              </v-tab-item>
            </v-tabs>
          </template>
        </v-container>
      </mk-form-full-screen>
    </v-container>
  </div>
</template>

<script>
import MkModuloMix from '@/components/mkComponentes/mixins/MkModuloMix'
import MkAppMix from '@/components/mkComponentes/mixins/MkAppMix'
import VWidget from '@/components/VWidget'
import Swal from 'sweetalert2'

export default {
  middleware: ['authAccess'],
  mixins: [MkModuloMix, MkAppMix],
  components: { VWidget },
  name: 'RuteosMonitor',
  data() {
    return {
      urlModulo: 'Ruteos',
      lRuteos: {
        dispon: {
          ok: 0,
          data: []
        },
        open: {
          ok: 0,
          data: []
        },
        closed: {
          ok: 0,
          data: []
        },
        retrased: {
          ok: 0,
          data: []
        }
      },
      estado: false,
      modalEval: false,
      lCateg: [],
      lPreguntas: [],
      lRutas: [],
      item: { respuestas: {} },
      ordBenef: 'lRutas',
      scrollTop: 0,
      openTab: 0
      //grabarDebug:true,
    }
  },
  '$store.auth.state.online': {
    immediate: true,
    handler(val) {
      console.log('actualizado', val)
    }
  },
  methods: {
    closeDialog(proc = '', data = false) {
      if (data) {
         console.log(proc, data)
        if (proc == 'Evaluaciones') {
          let evalu = this.getDataLista(
            this.lRuteos.open.data,
            data.ruteos_id,
            'id',
            'evaluaciones',
            false
          )
          if (!evalu) {
            evalu = this.getDataLista(
              this.lRuteos.retrased.data,
              data.ruteos_id,
              'id',
              'evaluaciones',
              false
            )
          }
          if (evalu) {
            let evalitem = this.getDataLista(
              evalu,
              data.beneficiarios_id,
              'beneficiarios_id',
              '*',
              false
            )
            if (evalitem) {
              for (let i in data) {
                evalitem[i] = data[i]
              }
              //              evalitem=data
              evalitem._temp_offline = -1
              //console.log('evalitem', evalitem)
            } else {
              evalu.push({ _temp_offline: -1, ...data })
              // console.log('evalu', evalu)
            }
          }
        }
        if (proc == 'setClose') {
          let lista=1;
          let evalu = this.getDataLista(
            this.lRuteos.open.data,
            data.id,
            'id',
            '*',
            false,true
          )
          if (!evalu) {
            lista=2
            evalu = this.getDataLista(
              this.lRuteos.retrased.data,
              data.id,
              'id',
              '*',
              false, true
            )
          }
          if (evalu) {
              //console.log('evalu setclose',evalu);
              evalu.data.estado =2
              evalu.data.fec_cerrado = new Date()
              evalu.data._temp_offline = -1
              this.lRuteos.closed.data.push({...evalu.data})
              if (lista==1){
                this.lRuteos.open.data.splice(evalu.index,1)
              }else{
                this.lRuteos.retrased.data.splice(evalu.index,1)
              }
          }
        }
      }
      this.restoreTab()
      this.tituloModal = ''
      this.modal = false
      this.modalEval = false
    },
    async grabarEval() {
      if (!this.$refs.mkFormEval.$refs.form.validate()) {
        return false
      }

      this.item.servicios = {}
      this.lServicios.forEach((e) => {
        if (e.selected && e.estado == 0) {
          this.item.servicios[e.id] = e.cantidad
        }
      })

      let data = {
        _noData: 1,
        id: this.item.id,
        obs: this.item.obs,
        lat: this.coordenadas.latitude || -1,
        lng: this.coordenadas.longitude || -1,
        estado: this.estado ? 2 : 1,
        usuarios_id: this.$store.state.auth.authUser.id,
        ruteos_id: this.item.ruteos_id,
        beneficiarios_id: this.item.beneficiarios_id,
        respuestas: this.item.respuestas,
        servicios: this.item.servicios
      }
      if (
        this.item.id > 0 &&
        JSON.stringify(this.dirty.item.servicios) !=
          JSON.stringify(this.item.servicios)
      ) {
        data.benef = this.item.beneficiarios_id
      }
      //console.log(this.item, data)

      this.item = data

      if (!this.can('add', true)) {
        return false
      }

      this.urlModulo = 'Evaluaciones'
      // let evalu = this.getDataLista(
      //   this.lRuteos.open.data,
      //   data.ruteos_id,
      //   'id',
      //   'evaluaciones',
      //   false
      // )
      // if (!evalu) {
      //   evalu = this.getDataLista(
      //     this.lRuteos.retrased.data,
      //     data.ruteos_id,
      //     'id',
      //     'evaluaciones',
      //     false
      //   )
      // }
      // if (evalu) {
      //   let evalitem = this.getDataLista(
      //     evalu,
      //     data.beneficiarios_id,
      //     'beneficiarios_id',
      //     '*',
      //     false
      //   )
      //   if (evalitem) {
      //     evalitem._temp_offline = -1
      //   } else {
      //     evalu.push({ beneficiarios_id: data.beneficiarios_id, _temp_offline: -1 })
      //   }
      // }
      await this.grabarItem()
      this.urlModulo = 'Ruteos'
      return true
    },
    setClose(id) {
      if (!this.can('edit', true)) {
        return false
      }
      Swal.fire({
        title: 'Desea Cerrar este Ruteo',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'red',
        reverseButtons: true,
        confirmButtonText: 'Si deseo Cerrarlo!'
      }).then((action) => {
        if (!action.value) {
          return false
        }
        let me = this
        let url = 'RuteosMonitor/setClose'
        //me.dataTable.loading = true
        let dato = {
          id: id,
          lat: this.coordenadas.latitude,
          lng: this.coordenadas.longitude
        }
        if (!this.$store.state.auth.online) {
          this.setColaGrabar('post', url + this.getCt(url), dato, 'setClose')
        } else {
          me.$axios
            .post(url + this.getCt(url), dato)
            .then(function(response) {
              if (me.isOk(response.data)) {
                me.afterSave(me, 0)
              } else {
                //con error
              }
            })
            .catch(function(error) {
              if (error.message === 'Network Error') {
                this.setColaGrabar(
                  'post',
                  url + this.getCt(url),
                  dato,
                  'setClose'
                )
                alert(
                  'Error de Conexion sin Internet, el Registro se enviara en cuanto se tenga conexion...'
                )
              }
              console.error(error)
            })
            .finally(function() {
              //me.dataTable.loading = false
            })
        }
      })
    },
    getColorEval(ruteo, bene) {
      // console.log('color',this.getDataLista(
      //   ruteo.evaluaciones,
      //   bene,
      //   'beneficiarios_id',
      //   'estado'
      // ),this.getDataLista(ruteo.evaluaciones, bene, 'beneficiarios_id', 'verif'));

      let e = this.getDataLista(
        ruteo.evaluaciones,
        bene,
        'beneficiarios_id',
        '*'
      )
      //console.log('eval:',e);
      return !e
        ? 'grey'
        : e._temp_offline //this.getDataLista(ruteo.evaluaciones, bene, 'beneficiarios_id', 'verif')
        ? 'red'
        : e.estado == 2
        ? 'green'
        : 'yellow'
    },
    getOpenTab() {
      this.openTab = [-1, -1]

      this.lRuteos.open.data.map((e, index) => {
        if (e.active) {
          this.openTab[0] = index
        }
      })
      this.lRuteos.retrased.data.map((e, index) => {
        if (e.active) {
          this.openTab[1] = index
          return true
        }
      })
      return true
    },
    restoreTab() {
      if (this.openTab[0] >= 0) {
        this.lRuteos.open.data[this.openTab[0]].active = true
      }
      if (this.openTab[1] >= 0) {
        this.lRuteos.retrased.data[this.openTab[1]].active = true
      }
      window.scrollTo(0, this.scrollTop)
    },
    closeEval() {
      this.modalEval = false
      this.restoreTab()
    },
    openEval(data, bene) {
      if (this.initOnce('openEval')) {
        return false
      }
      if (!this.can('add', true)) {
        return false
      }
      this.scrollTop = window.scrollY
      this.getOpenTab()
      //console.log('scroll',this.scrollTop);
      this.getPosition()
      this.item = Object.assign({}, data)
      this.item._noData = 1
      this.item.lat = this.coordenadas.latitude
      this.item.beneficiarios_id = bene
      this.item.lng = this.coordenadas.longitude
      this.item.usuarios_id = this.$store.state.auth.authUser.id
      this.item.ruteos_id = data.id
      this.item.rutas_id = data.rutas_id
      this.item.obs = ''
      this.item.id = null
      this.item.estado = 0
      let evaluacion = this.getDataLista(
        this.item.evaluaciones,
        bene,
        'beneficiarios_id',
        '*'
      )
      this.item.servicios = {}
      this.lServicios.forEach((e) => {
        e.cantidad = 1
        e.selected = false
        e.estado = 0
        let existe = false
        if (evaluacion) {
          //          console.log('evaluaciones',evaluacion,Array.isArray(evaluacion.servicios));
          // if (!Array.isArray(evaluacion.servicios)) {
          //   console.log('servicio no es array:', evaluacion.servicios)
          //   evaluacion.servicios = []
          // }
          if (!evaluacion._temp_offline) {
            existe = this.getDataLista(
              evaluacion.servicios,
              e.id,
              'servicios_id',
              '*'
            )
          } else {
            if (evaluacion.servicios[e.id]) {
              existe = {
                cant: evaluacion.servicios[e.id].cant
                  ? evaluacion.servicios[e.id].cant
                  : evaluacion.servicios[e.id],
                estado: evaluacion.servicios[e.id].estado
                  ? evaluacion.servicios[e.id].estado
                  : 0
              }
            }
          }
          if (existe) {
            e.cantidad = existe.cant
            e.selected = true
            e.estado = existe.estado
            if (existe.estado == 0) {
              this.item.servicios[e.id] = existe.cant
            }
          }
        }
      })

      if (!evaluacion._temp_offline) {
        this.item.respuestas = {}
        this.lPreguntas.forEach((e) => {
          if (evaluacion) {
            this.item.respuestas[e.id] = this.getDataLista(
              evaluacion.respuestas,
              e.id,
              'preguntas_id',
              'r_s',
              ''
            )
          } else {
            this.item.respuestas[e.id] = ''
          }
        })
      } else {
        this.item.respuestas = evaluacion.respuestas
      }

      this.dirty.item = null
      if (evaluacion) {
        this.item.id = evaluacion.id
        this.item.estado = 1 * evaluacion.estado
        this.item.obs = evaluacion.obs
        if (this.$config.dirty) {
          this.dirty.item = JSON.parse(JSON.stringify(this.item))
        }
      }
      this.estado = this.item.estado <= 1 ? false : true

      this.$refs.mkFormEval.$refs.form.resetValidation()
      this.tituloModal =
        'Evaluacion de ' + this.getDataLista(this.lBeneficiarios, bene) //colocar computada de acuerdo al tamano
      if (!this.modalEval) this.modalEval = true
      //this.$nextTick(this.$refs.focus.focus)
    },
    getSubHeader(data) {
      return 'Abierto:' + this.formatDT(data.created_at) + ' - ' + data.obs
    },

    async afterSave(me, isError = 0) {
      if (isError != 1) {
        me.lRuteos = await this.getListaBackend('RuteosMonitor')
      }
      if (isError >= 0) {
        this.modalEval = false
        //modalMap=false;
      }
      this.$nextTick(this.restoreTab())
      return true
    },
    addRuteo(data) {
      if (!this.can('add', true)) {
        return false
      }
      this.item = Object.assign({}, data)
      this.item.lat = this.coordenadas.latitude || -1
      this.item.lng = this.coordenadas.longitude || -1
      this.item.usuarios_id = this.$store.state.auth.authUser.id
      this.item.rutas_id = data.id
      this.item._noData = 1
      this.item.obs = ''
      this.item.id = null

      this.$refs.mkForm.$refs.form.resetValidation()
      this.tituloModal =
        'Abrir Ruteo para ' + this.getDataLista(this.lRutas, this.item.rutas_id)
      this.modal = true
      this.$nextTick(this.$refs.focus.focus)
    },
    change(e) {
      this.item.usuarios_id = this.lRutas.find((el) => el.id === e).usuarios_id
    },
    beforeOpen(accion, data = {}) {
      data.lat = this.coordenadas.latitude
      data.lng = this.coordenadas.longitude
    },
    ordDistancia(e) {
      let r = []
      //console.log('sort',e)
      e.beneficiarios.forEach((el) => {
        let benef = this.getDataLista(this.lBeneficiarios, el, 'id', '*')
        if (benef) {
          benef.distancia = this.distancia(benef)
          //console.log('sortdentro',el,benef)
        }

        r.push({
          id: el,
          estado: e,
          distancia: benef.distancia
        })
        //        console.log('sortdentro2',e)
      })
      r.sort(function(a, b) {
        return a.distancia - b.distancia
      })
      e.beneficiariosD = r
      return e
    },
    ordBeneficiarios(lista) {
      //console.log('listaord',lista);
      lista.forEach((e) => {
        e = this.ordDistancia(e)
      })
      return lista
    },
    Success() {
      this.ordBeneficiarios(this.lRutas)
    }
  },
  computed: {
    binding() {
      const binding = {}
      if (this.$vuetify.breakpoint.xs) binding.column = true
      return binding
    },
    lPregCateg: (app) => (categ) => {
      let l = app.lPreguntas.filter((e) => e.categ_id == categ)

      //console.log('categ:', categ, l)
      return l
    }
  },
  async mounted() {
    // await this.ping()
    // setTimeout(() => {
    //   this.getPosition()
    // }, 3000)
    this.lRuteos = await this.getListaBackend('RuteosMonitor')
    let listas = await this.getDatasBackend(this.urlModulo, [
      {
        mod: 'Beneficiarios',
        campos: 'id,name',
        datos: { _customFields: 1 },
        each: (e) => {
          e.distancia = 0
        }
      },
      {
        mod: 'Rutas',
        datos: { rel: 1 },
        campos: 'id,name,usuarios_id,descrip'
      },
      {
        mod: 'Categ',
        sort: 'orden',
        datos: { modulo: 'mkPreguntas' },
        campos: 'id,name,orden'
      },
      { mod: 'Preguntas', sort: 'orden' },
      {
        mod: 'Servicios',
        each: (e) => {
          e.cantidad = 1
          e.selected = false
        }
      }
    ])
    this.colaSave.map(e=>{
      this.closeDialog(e.proc,e.data)
    })
    //    this.ordBeneficiarios(this.lRutas)
  }
}
</script>
<style scoped>

</style>
