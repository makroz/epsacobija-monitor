export default function({ $axios, redirect, error: nuxtError }) {
    $axios.onRequest(config => {
        //console.log('Making request to ' + config.url)
    })

    $axios.onError(error => {
        // if ((error.message + '').indexOf('Network Error') > -1) {
        //     //  throw new Error('Network Error')
        // }
        return Promise.reject(error);
    })
}