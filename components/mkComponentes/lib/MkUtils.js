export function c(msg, m1 = '', m2 = '', tipo = '') {
    // if (m1!=''){
    //   m1=' '+m1.trim()+' ';
    // }
    // if (m2!=''){
    //   m2=' '+m2.trim()+' ';
    // }
    let c1 = 'background:#35495e ; color: #fff'
    let c2 = 'background:#41b883 ; color: #fff'
    if (tipo.trim() == 'warning') {
        c1 = 'background:#FF5733 ; color: #fff'
    }
    if (tipo.trim() == 'warning') {
        c1 = 'background:#FF5733 ; color: #fff'
    }
    if (tipo.trim() == 'info') {
        c1 = 'background:#1C72E7 ; color: #fff'
        c2 = 'background:#000 ; color: #fff'
    }

    if (tipo.trim() == 'error') {
        c1 = 'background:#ff0808 ; color: #fff'
        c2 = 'background:#000 ; color: #fff'
        console.error(
            '%c ' + m1 + ' %c ' + m2 + ' %c',
            'padding: 1px; border-radius: 3px 0 0 3px;' + c1,
            'padding: 1px; border-radius: 0 3px 3px 0;' + c2,
            'background:transparent',
            msg
        )
    } else {
        console.log(
            '%c ' + m1 + ' %c ' + m2 + ' %c',
            'padding: 1px; border-radius: 3px 0 0 3px;' + c1,
            'padding: 1px; border-radius: 0 3px 3px 0;' + c2,
            'background:transparent',
            msg
        )
    }

    return true
}

export function getTitFromName(msg) {
    return (msg + '')
        .split('/')
        .pop()
        .split(/(?=[A-Z])/)
        .join(' ')
}

export function getFirstUpperCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

export function getDataLista(
    lista,
    valor,
    busco = 'id',
    devuelvo = 'name',
    defa = false,
    index = false
) {
    let r = defa
    if (!lista) {
        return r
    }
    let i = -1
    let o = lista.find((el, index) => {
        if (el[busco] == valor) {
            i = index
        }
        return el[busco] == valor
    })
    if (o) {

        if (devuelvo == '*') {
            r = o
        } else {
            r = o[devuelvo]
        }
        if (index) {
            let r1 = {}
            r1.index = i
            r1.data = r
            return r1
        }
    }
    // if (r == undefined) {
    //     r = o
    // }
    //console.log('getdatalista resulatdo:', r);
    return r
}
export function getDistancia(lat1, lon1, lat2, lon2) {
    //console.log('calcula distancia');
    var R = 6371 // Radius of the earth in km
    var dLat = ((lat2 - lat1) * Math.PI) / 180 // deg2rad below
    var dLon = ((lon2 - lon1) * Math.PI) / 180
    var a =
        0.5 -
        Math.cos(dLat) / 2 +
        (Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            (1 - Math.cos(dLon))) /
        2

    return R * 2 * Math.asin(Math.sqrt(a))
}

export function imprimirElemento(html = 'En Blanco', title = 'Impresion') {
    let elemento = document.getElementById('printArea')
    elemento.innerHTML = html
    window.print()
    return true
}

export function formatDT(d = '', time = true) {
    //return new Date(data).toString().split
    //    console.log('fecha',(d+' ').trim())
    if (!d || d == '') {
        return ''
    }
    let data = new Date(d)
    let year = data.getFullYear().toString()
    let month = (data.getMonth() + 101).toString().substring(1)
    let day = (data.getDate() + 100).toString().substring(1)
    let hour = (data.getHours() + 100).toString().substring(1)
    let minute = (data.getMinutes() + 100).toString().substring(1)
    let secons = (data.getSeconds() + 100).toString().substring(1)
    let r = year + '/' + month + '/' + day
    if (time) {
        r = r + ' ' + hour + ':' + minute + ':' + secons
    }
    return r
}

// export function goOnline() {
//     document.body.classList.remove('offline');
//     document.body.classList.add('online');
//     console.log('internet Online');
//     // Hacer algo m??s al ir online
// }

// export function goOffline() {
//     document.body.classList.remove('online');
//     document.body.classList.add('offline');
//     console.log('internet Offline');
//     // Hacer algo m??s al ir offline
// }