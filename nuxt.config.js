const pkg = require('./package')

const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

module.exports = {
    ssr: false,

    env: {
        mkConfig: {
            authKey: process.env.AUTH_KEY,
            dirty: process.env.DIRTY,
            storageUrl: process.env.STORAGE_URL,
            baseURL: process.env.API_URL,
            version: process.env.VERSION,
        },
    },

    publicRuntimeConfig: {
        version: process.env.VERSION,
        dirty: process.env.DIRTY,
        baseURL: process.env.API_URL,
        storageUrl: process.env.STORAGE_URL,
        tbl_opts_p: process.env.tbl_opts_p,
        tbl_opts_type: process.env.tbl_opts_type,
        authKey: process.env.AUTH_KEY,
    },
    privateRuntimeConfig: {},

    /*
     ** Headers of the page
     */
    head: {
        title: 'Mon/Recol Epsa Cobija v' + process.env.VERSION,
        meta: [
            { charset: 'utf-8' },
            { name: 'theme-color', content: '#1976D2' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            {
                hid: 'Monitor',
                name: 'Monitoreo/Recoleccion de la App Saneamiento Epsa Cobija',
                content: 'Epsa Cobija v' +
                    process.env.VERSION +
                    ' \n' +
                    '    Makroz@hotmail.com. +591 72170900',
            },
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            // {
            //     rel: 'stylesheet',
            //     href: 'https://fonts.googleapis.com/css?family=Material+Icons'
            // }
        ],
        script: [{
            src: 'https://cdnjs.cloudflare.com/ajax/libs/echarts/4.0.4/echarts-en.min.js',
        }, ],
    },

    /*
     ** Customize the progress-bar color
     */
    loading: { color: '#3adced' },

    /*
     ** Global CSS
     */
    css: [
        '~/assets/style/theme.styl',
        '~/assets/style/app.styl',
        '~/assets/style/app.css',
        'font-awesome/css/font-awesome.css',
        'roboto-fontface/css/roboto/roboto-fontface.css',
    ],

    /*
     ** Plugins to load before mounting the App
     */
    plugins: [
        '@/plugins/vuetify',
        '@/plugins/vee-validate',
        '~/plugins/axios',
        '~/plugins/sw.client.js',
    ],

    /*
     ** Nuxt.js modules
     */
    modules: [
        '@nuxtjs/axios',
        '@nuxtjs/pwa',
        '@nuxtjs/webpackmonitor',
        'nuxt-webfontloader',
    ],
    webfontloader: {
        google: {
            families: ['Roboto:300,400,500,700', 'Material+Icons'],
        },
    },
    pwa: {
        icon: {
            sizes: [64, 512],
        },
        manifest: {
            name: 'Monitor/Recolector Saneamiento Epsa Cobija v' + process.env.VERSION,
            lang: 'es',
            theme_color: '#1976D2',
        },
    },
    router: {
        trailingSlash: true,
    },

    axios: {
        baseURL: process.env.API_URL,
    },
    buildModules: [],

    /*
     ** Build configuration
     */
    build: {
        transpile: ['vuetify/lib'],
        plugins: [new VuetifyLoaderPlugin()],
        loaders: {
            stylus: {
                import: ['~assets/style/variables.styl'],
            },
        },
        /*
         ** You can extend webpack config here
         */
        extend(config, ctx) {},
    },
}