<script>
export default {
  name: 'MkRulesMix',
  data() {
    return {
      rulesUnico: {
        valid: true,
        old: '',
        processing: false
      },
      rules: {
        required: (value) => !!value || 'Dato es Requerido',
        noSpaces: (v) => (v || '').indexOf(' ') < 0 || 'No se admite espacios',
        num: (value) => !value || !isNaN(value) || 'Debe ser un Numerico',
        min(minNum, cero = false) {
          return (v) => {
            if (cero && (v || '').length == 0) {
              return true
            }
            return (
              (v || '').length >= minNum || 'Minimo ' + minNum + ' caracteres'
            )
          }
        },
        max(maxNum) {
          return (v) => {
            return (
              (v || '').length <= maxNum || 'Maximo ' + maxNum + ' caracteres'
            )
          }
        },
        minVal(minNum) {
          return (v) => {
            return v >= minNum || 'debe ser Mayor o igual a ' + minNum
          }
        },
        maxVal(maxNum) {
          return (v) => {
            return v <= maxNum || 'debe ser Menor o igual  a ' + maxNum
          }
        },
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'e-mail no válido'
        },
        unique: (campo) => {
          //console.log('Aqui estoy');
          let me = this
          return (v) => {
            if (!v) {
              return true
            }
            if (!me.rulesUnico.processing && v != me.rulesUnico.old) {
              //console.log('corriendo Unique:',v,'/',me.rulesUnico.old);
              me.rulesUnico.processing = true
              let id = me.item.id
              if (!id) {
                id = 0
              }
              try {
                me.$axios
                  .get(
                    me.urlModulo +
                      '/' +
                      id +
                      '?existe=1&where=' +
                      campo +
                      '&valor=' +
                      v,
                    { where: campo, valor: v }
                  )
                  .then(({ data }) => {
                    if (data.ok > 0) {
                      me.rulesUnico.valid = 'Ese dato ya existe'
                    } else {
                      me.rulesUnico.valid = true
                    }
                    me.rulesUnico.old = v
                    me.rulesUnico.processing = false
                    me.$refs[campo].validate()
                  })
              } catch (error) {
                me.rulesUnico.processing = false
                if (error.message === 'Network Error') {
                  me.rulesUnico.valid = true
                  alert('Sin Internet...')
                }
              }
            }
            return me.rulesUnico.valid
          }
        }
      }
    }
  }
}
</script>
