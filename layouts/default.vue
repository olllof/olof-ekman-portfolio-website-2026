<script setup>
// Global SEO defaults. Pages set their own title (appended with the brand) and
// can override the description / og:image below.
useHead({
    titleTemplate: (t) => (t ? `${t} — Olof Ekman` : 'Olof Ekman — Photographer based in Berlin'),
    htmlAttrs: { lang: 'en' },
})
useSeoMeta({
    description:
        'Olof Ekman is a Berlin-based photographer capturing portraits, weddings, families and personal projects — with a love for spontaneity, colour and genuine, unexpected moments.',
    ogSiteName: 'Olof Ekman',
    ogType: 'website',
    twitterCard: 'summary_large_image',
})

const router = useRouter()
const routeName = computed(() => router.currentRoute.value.name)
const isHome = computed(() => routeName.value === "index")
const showRadio = ref(false)

const toggleRadio = () => {
    showRadio.value = !showRadio.value
}

// Apply the shared light/dark theme to the whole site.
const light = useSiteTheme()
useHead({
    bodyAttrs: {
        class: computed(() => (light.value ? 'site-light' : 'site-dark')),
    },
})
if (process.client) {
    watch(light, (isLight) => {
        document.body.classList.toggle('site-light', isLight)
        document.body.classList.toggle('site-dark', !isLight)
    }, { immediate: true })
}
</script>

<template lang="pug">
#default.layout.flex.flex-col(class='min-h-[100vh]')
    .overlay.noise.z-0
    
    player(:class='{ "translate-x-[40rem]": ! showRadio }').transition-all.duration-300
    
    app-header(@radio-toggle='toggleRadio')
    
    //- logo-new(
    //-     v-show='routeName === "index"'
    //-     :top='routeName === "index" ? "-16vw" : "0vw"' 
    //-     :left='routeName === "index" ? "-30vw" : "0vw"' 
    //-     :size='routeName === "index" ? "300vw" : "14vw"'
    //- )
    //- logo(
    //-     top='280vw'
    //-     left='-60vw'
    //-     size='300vw'
    //-     v-show='routeName === "index"'
    //- )
    
    
    //- .wallpaper.relative.z-10
        //- .py-24
        //- :class='{ "mix-blend-difference": isHome }'
        //- .ontop(style='min-height: calc(100svh - 3rem)').relative.z-10.px-0.py-4.pt-0.pb-48
    #main.relative.z-20.flex-1(class='mr-[2.5rem] md_mr-[3.5rem]')
        //- .ml-20.mr-8
        //- .content.flex.flex-col.w-100.justify-center.align-center(style='min-height: calc(100svh - 8rem)')
        slot

    app-footer
</template>

<style lang="sass" scoped>
.overlay
    position: fixed
    top: 0
    left: 0
    width: 100vw
    height: 100vh
    // background: rgba(0, 0, 0, 0.5)
</style>