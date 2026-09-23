import pugPlugin from "vite-plugin-pug"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    app: {
        head: {
            charset: "utf-8",
            viewport: "width=device-width, initial-scale=1",
            link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
            templateParams: {
                separator: '–'
            },
        },
    },
    css: [
        "~/assets/fonts/fonts.css",
        "~/assets/sass/global.sass",
    ],
    modules: [
        "@nuxtjs/prismic",
        "@nuxtjs/tailwindcss",
        "@nuxtjs/device", // $device.isDesktop
        "nuxt-icon", // https://icones.js.org
        'dayjs-nuxt', // https://nuxt.com/modules/dayjs
        '@hypernym/nuxt-anime',
        'nuxt-swiper',
        '@nuxtjs/google-fonts',
    ],
    
    prismic: {
        endpoint: 'olof-ekman',
        // Required for Prismic's "Preview" button (in the document editor)
        // to work — it loads Prismic's small toolbar script that manages
        // the preview session.
        toolbar: true,
        linkResolver: './prismic/linkResolver.js',
    },
    
    anime: {
        provide: true
    },
    
    googleFonts: {
        families: {
            'Inter': [400, 500],
            'Bodoni Moda': { wght: [400], ital: [400] },
            'Antic Didone': [400],
            'Rajdhani': [500, 700],
            'Carlito': [400, 700],
        }
    },

    vite: {
        plugins: [pugPlugin()],
    },
    
    site: {
        // Update this to your real domain once you've bought it (e.g. https://olofekman.com)
        url: 'https://olof-ekman-portfolio-website-2026.vercel.app',
        name: 'Olof Ekman',
        description: 'Berlin-based photographer — portraits, weddings, families and prints.',
        defaultLocale: 'en', // not needed if you have @nuxtjs/i18n installed
    },
})
