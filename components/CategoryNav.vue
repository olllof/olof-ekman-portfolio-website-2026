<script setup>
// Quick cross-navigation between the four category pages — alongside the
// main hamburger menu, not replacing it. Shared by the redesigned gallery
// pages (Portraits, Weddings, Festivals) and the Prints page.
defineProps({
    active: { type: String, default: '' },
})

const items = [
    { uid: 'portraits', label: 'Portraits', path: '/posts/portraits' },
    { uid: 'weddings', label: 'Weddings', path: '/posts/weddings' },
    { uid: 'festivals', label: 'Festivals', path: '/posts/festivals' },
    { uid: 'prints', label: 'Prints', path: '/prints' },
]
</script>

<template lang="pug">
nav.category-nav.mb-6
    nuxt-link.underline-hover(
        v-for='item in items' :key='item.uid'
        :to='item.path'
        :class='item.uid === active ? "menu-color" : ""'
    ) {{ item.label }}
</template>

<style lang="sass">
.category-nav
    display: flex
    flex-wrap: nowrap
    justify-content: center
    gap: clamp(0.5rem, 3vw, 1.5rem)
    letter-spacing: 0.03em
    -webkit-text-size-adjust: 100%
    text-size-adjust: 100%
    overflow-x: auto
    padding-bottom: 2px
    a
        flex: none
        text-transform: uppercase
        font-weight: 500
        font-size: clamp(0.45rem, calc((100vw - 4.5rem) / 30), 0.8rem)
</style>
