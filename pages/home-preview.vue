<script setup>
// Draft-only restyle of the homepage: category list first (styled like the
// Prints page's glowing headline), a new italic subheading, then the intro
// paragraph moved below — instead of paragraph-then-list. Not linked from
// anywhere; visit directly to review before this replaces pages/index.vue.
const { client } = usePrismic()

const { data: homepage } = await useAsyncData('homepage-preview', () => client.getSingle('homepage'))

useSeoMeta({
    title: 'Homepage preview',
    ogTitle: 'Olof Ekman — Photographer based in Berlin',
})

const fallbackMenu = [
    { title: 'Portraits' },
    { title: 'Weddings & Celebrations' },
    { title: 'Prints' },
    { title: 'Various' },
]

const menu = computed(() => {
    const items = (homepage.value?.data?.menu || []).filter(item => item.title)
    return items.length ? items : fallbackMenu
})

const hoverN = ref(null)

const defaultImageUrl = computed(() =>
    homepage.value?.data?.image?.url || menu.value[0]?.image?.url || ''
)

const itemImageStyle = (item, i) => ({
    backgroundImage: item.image?.url ? `url(${item.image.url})` : 'none',
    opacity: hoverN.value === i ? 1 : 0,
})

const RED = '#e0392b'
const { data: menuColors } = await useAsyncData('menuColors-preview', () =>
    Promise.all(menu.value.map(async (item) => {
        if (!item.image?.url) return RED
        try {
            const sep = item.image.url.includes('?') ? '&' : '?'
            const data = await $fetch(item.image.url + sep + 'palette=json')
            return data?.dominant_colors?.vibrant?.hex || RED
        } catch {
            return RED
        }
    }))
)

const hoverTitleStyle = (item, i) => {
    if (hoverN.value !== i) return {}
    const c = item.color || menuColors.value?.[i] || RED
    return {
        color: c,
        textShadow: `0 0 1rem ${c}66`,
        transform: 'translateX(1rem)',
    }
}
</script>

<template lang="pug">
#home-preview.flex
    .w-full.md_w-1x2.flex.flex-col(class='md_justify-center md_min-h-[92vh]')
        .py-4.px-4
            .menu.mb-6
                .menu-item(
                    v-for='(item, i) in menu' :key='i'
                    @mouseenter='hoverN = i'
                    @mouseleave='hoverN = null'
                )
                    nuxt-link(v-if='item.link?.uid' :to='`/posts/${item.link.uid}`')
                        .pb-1.hover-title.font-b.uppercase.menu-title(:style='hoverTitleStyle(item, i)')
                            | {{ item.title }}
                    .pb-1.hover-title.font-b.uppercase.menu-title(v-else :style='hoverTitleStyle(item, i)')
                        | {{ item.title }}

            .info.description(v-if='homepage?.data?.body')
                prismic-rich-text(:field='homepage?.data?.body')

            .images.mt-4(v-if='defaultImageUrl || menu.length')
                .image(
                    v-if='defaultImageUrl'
                    :style='{ backgroundImage: `url(${defaultImageUrl})`, opacity: hoverN === null ? 1 : 0 }'
                    data-n='default'
                ).absolute.inset-0.bg-cover.bg-no-repeat.bg-center.bg-gray-100.index-image-hover-wrapper.z-40
                .image(
                    v-for='(item, i) in menu' :key='i'
                    :style='itemImageStyle(item, i)'
                    :data-n='i'
                ).absolute.inset-0.bg-cover.bg-no-repeat.bg-center.bg-gray-100.index-image-hover-wrapper.z-40
</template>

<style lang="sass">
#home-preview
    .menu-item h4
        line-height: 1
    .menu-title
        display: block
        font-size: clamp(1.6rem, 8.5vw, 3rem)
        line-height: 0.86
        @media (min-width: 768px)
            font-size: 5vw
    .description
        font-family: 'Inter', Arial, Helvetica, sans-serif
        font-weight: 400
        font-size: 0.95rem
        opacity: 0.7
        max-width: 34ch
        line-height: 1.4
        text-shadow: none
    .hover-title
        transition: all 0.1s ease
    .images
        position: relative
        width: 100%
        height: 60vh
        @media (min-width: 768px)
            position: fixed
            top: 0
            right: 3.5rem
            width: calc(50vw - 2rem)
            height: 100vh
            margin-top: 0
    .index-image-hover-wrapper
        transition: opacity 0.3s ease
</style>
