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

// Shown on the right when nothing is hovered: the Homepage "Default image"
// field, falling back to the first menu item's image if none is set.
const defaultImageUrl = computed(() =>
    homepage.value?.data?.image?.url || menu.value[0]?.image?.url || ''
)

// Style for each menu item's hover image. Only the hovered item is visible.
const itemImageStyle = (item, i) => ({
    backgroundImage: item.image?.url ? `url(${item.image.url})` : 'none',
    width: 'calc(50vw - 2rem)',
    opacity: hoverN.value === i ? 1 : 0,
})

// Pull a dominant colour from each menu image (via the imgix palette API) so a
// menu item's hover colour matches the picture shown on the right. Falls back
// to the brand red if there's no image or the request fails.
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
    .w-full.md_w-1x2
        .py-4.px-4
            .info(v-if='homepage?.data?.body')
                prismic-rich-text(:field='homepage?.data?.body')

        .menu.ml-4.mr-8.py-2
            .menu-item(
                v-for='(item, i) in menu' :key='i'
                @mouseenter='hoverN = i'
                @mouseleave='hoverN = null'
            )
                nuxt-link(v-if='item.link?.uid' :to='`/posts/${item.link.uid}`')
                    .pb-6.md_pb-5.hover-title(:style='hoverTitleStyle(item, i)')
                        h4.uppercase.flex(class='text-[2rem] md_text-[5vw]')
                            div {{ item.title }}
                .pb-6.md_pb-5.hover-title(v-else :style='hoverTitleStyle(item, i)')
                    h4.uppercase.flex(class='text-[2rem] md_text-[5vw]')
                        div {{ item.title }}
    .w-1x2.hidden.md_block
        .images
            .image(
                v-if='defaultImageUrl'
                :style='{ backgroundImage: `url(${defaultImageUrl})`, width: "calc(50vw - 2rem)", opacity: hoverN === null ? 1 : 0 }'
                class='h-[100vh] right-[3.5rem]'
                data-n='default'
            ).fixed.top-0.bg-cover.bg-no-repeat.bg-center.bg-gray-100.index-image-hover-wrapper.z-40
            .image(
                v-for='(item, i) in menu' :key='i'
                :style='itemImageStyle(item, i)'
                class='h-[100vh] right-[3.5rem]'
                :data-n='i'
            ).fixed.top-0.bg-cover.bg-no-repeat.bg-center.bg-gray-100.index-image-hover-wrapper.z-40
</template>

<style lang="sass">
.info
    font-family: 'Carlito', sans-serif
    font-weight: 600

    font-size: 30px
    @media (min-width: 768px)
        font-size: 2vw
    line-height: 1.1
    text-shadow: 0 0 10px #9995A4
.menu-item h4
    font-family: 'Monument Extended', sans-serif
    line-height: 1
.hover-title
    transition: all 0.1s ease
    text-shadow: 0 0 1rem transparent
.index-image-hover-wrapper
    transition: opacity 0.3s ease
</style>
