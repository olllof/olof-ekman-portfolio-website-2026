<script setup>
const route = useRoute()
const router = useRouter()

const showMenu = ref(false)

const toggleMenu = () => {
    showMenu.value = !showMenu.value
}



// watchEffect(() => {
//     isPostsPage.value = route.path.includes('/posts')
// })


const currentRoute = computed(() => router.currentRoute.value.path)
const isHome = computed(() => currentRoute.value === "/")
// const isPostsPage = computed(() => currentRoute.value.includes('posts'))
// const halfMenu = computed(() => isPostsPage.value ? 'calc(100vw-3.5rem)' : 'calc(100vw-2.5rem)')
</script>

<template lang="pug">
#menu
    button(@click='toggleMenu').relative.z-50
        icon(
            :name='showMenu ? "ic:outline-close" : "solar:hamburger-menu-outline"' 
            class='w-[1.9rem] md_w-[2.5rem]'
        ).text-xl.menu-color
    
    .menu(:class='{ "scale-100": showMenu, "h-[100svh] w-[calc(100vw-2.5rem)]": true, "md_w-1x2": isHome, "md_w-[calc(100vw-3.5rem)]": ! isHome }' class='bg-[#0c0e12]').fixed.top-0.left-0.transition-all.origin-top-left.p-8.uppercase.scale-0.monument
        //- .rounded-full
        .wrapper.h-full
            //- .border-2.rounded-xl(class='border-[#0005B4]')
            .items.flex.flex-col.gap-0.justify-center.items-center.h-full.z-40(
                class='text-[2rem] md_text-[7vw]'
            )
            
                .menu-item
                    nuxt-link(to='/' @click='toggleMenu')
                        .menu-item Home
                //- .menu-item.hover_rotate-180.transition-all
                    nuxt-link(to='/shows' @click='toggleMenu')
                        .menu-item Shows
                //- .menu-item.hover_rotate-180.transition-all
                    nuxt-link(to='/residents' @click='toggleMenu')
                        .menu-item Residents
                .menu-item
                    nuxt-link(to='/prints' @click='toggleMenu')
                        .menu-item Prints
                .menu-item
                    nuxt-link(to='/about' @click='toggleMenu')
                        .menu-item About
                .menu-item
                    nuxt-link(to='/contact' @click='toggleMenu')
                        .menu-item Contact
                
</template>

<style lang="sass" scoped>
.menu 
    // transform: translateY(-50%)
    a
        // color: #F7a
        // color: #FA0
        color: white
    .menu-item
        transition: all 0.1s ease
        text-shadow: 0 0 1rem #FFFFFF00
        &:hover
            transition: all 0.1s ease
            text-shadow: 0 0 1rem #FFFFFF66
            color: #CDF
            transform: scale(1.01)

</style>