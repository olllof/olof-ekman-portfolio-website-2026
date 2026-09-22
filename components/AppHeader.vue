<template lang="pug">
header#app-header
    .fixed.top-0.right-0.z-30.h-full.bg.h-full(class='w-[2.5rem] md_w-[3.5rem]')
    .fixed.top-0.right-0.z-40.h-full.noise.h-full(class='w-[2.5rem] md_w-[3.5rem]')
    .fixed.top-0.right-0.z-50.h-full.b(class='w-[2.5rem] md_w-[3.5rem]')
        .flex.flex-col.h-full.w-full.items-center.justify-between.md_my-2

            app-menu.mb-3.lg_mb-0

            nuxt-link(to='/').sidebar-title.menu-color
                span.by Photography by
                span.name Olof Ekman

            .spacer
                button(
                    @click='toggleTheme'
                    :aria-label='light ? "Switch to dark background" : "Switch to light background"'
                    class='mb-3 md_mb-5 h-[2.16rem] md_h-[2.88rem]'
                ).menu-color.cursor-pointer.flex.items-center.justify-center
                    //- Angel scaled ~1.2x so its head matches the devil's width
                    //- (halo adds height). Button height is fixed to the taller
                    //- icon so the sidebar title never shifts on toggle.
                    angel-icon(v-if='light' class='h-[2.16rem] md_h-[2.88rem]')
                    devil-icon(v-else class='h-[1.8rem] md_h-[2.4rem]')
</template>

<script setup>
const light = useSiteTheme()
const toggleTheme = () => { light.value = !light.value }
</script>

<style lang="scss" scoped>
.sidebar-title {
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    display: flex;
    align-items: center;
    gap: 0.55rem;
    white-space: nowrap;
    line-height: 1;
    max-height: 80vh;

    .by {
        font-family: 'Antic Didone', serif;
        font-style: italic;
        font-weight: 400;
        font-size: 1.15rem;
    }

    .name {
        font-family: 'Rajdhani', sans-serif;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        font-size: 1.15rem;
    }
}
</style>
