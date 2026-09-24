<script setup>
const { client } = usePrismic()

const { data: homepage } = await useAsyncData('homepage', () => client.getSingle('homepage'))

useSeoMeta({
    ogTitle: 'Olof Ekman — Photographer based in Berlin',
    description: () => richTextToPlain(homepage.value?.data?.body) || 'Portraits, weddings, families and prints by Berlin-based photographer Olof Ekman.',
    ogImage: () => homepage.value?.data?.image?.url,
})

// Default menu shown before any menu items are added in Prismic.
const fallbackMenu = [
    { title: 'Portraits' },
    { title: 'Weddings & Celebrations' },
    { title: 'Prints' },
    { title: 'Various' },
]

// Use the menu from Prismic if it has titles, otherwise the fallback above.
const menu = computed(() => {
    const items = (homepage.value?.data?.menu || []).filter(item => item.title)
    return items.length ? items : fallbackMenu
})

const hoverN = ref(null)

// Shown when nothing is hovered: the Homepage "Default image" field,
// falling back to the first menu item's image if none is set.
const defaultImageUrl = computed(() =>
    homepage.value?.data?.image?.url || menu.value[0]?.image?.url || ''
)

// Style for each menu item's hover image. Only the hovered item is visible.
const itemImageStyle = (item, i) => ({
    backgroundImage: item.image?.url ? `url(${item.image.url})` : 'none',
    opacity: hoverN.value === i ? 1 : 0,
})

// Pull a dominant colour from each menu image (via the imgix palette API) so a
// menu item's hover colour matches the picture shown. Falls back to the
// brand red if there's no image or the request fails.
const RED = '#e0392b'
const { data: menuColors } = await useAsyncData('menuColors', () =>
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

// Hover styling for a menu item. Uses the colour chosen in Prismic if set,
// otherwise the image's dominant colour, otherwise the brand red.
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
#page.index.flex
    .w-full.md_w-1x2.flex.flex-col(class='md_justify-center md_min-h-[92vh]')
        .py-4.px-4
            .menu.mb-6
                .menu-item(
                    v-for='(item, i) in menu' :key='i'
                    @mouseenter='hoverN = i'
                    @mouseleave='hoverN = null'
                )
                    prismic-link(v-if='item.link?.link_type && item.link.link_type !== "Any"' :field='item.link')
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
#page.index
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
