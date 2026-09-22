<script setup>
const { isMobile } = useDevice()

const uid = useRoute().params.uid
const { client } = usePrismic()
const { data: post } = await useAsyncData('post', () =>
    client.getByUID('post', uid)
)

const postTitle = computed(() => (post.value?.data?.title?.[0]?.text || post.value?.data?.short_title || 'Olof Ekman').trim())
useHead({ title: () => postTitle.value })
useSeoMeta({
    ogTitle: () => `${postTitle.value} — Olof Ekman`,
    description: () => richTextToPlain(post.value?.data?.body) || `${postTitle.value} — photography by Olof Ekman, Berlin.`,
    ogImage: () => post.value?.data?.featured_image?.url,
})

const isMounted = ref(false)

onMounted(() => {
    isMounted.value = true
})

onBeforeRouteLeave((to, from, next) => {
    // Clear the inline overrides this page set so each destination's own CSS
    // governs the body again (e.g. the homepage's black background). Forcing
    // white/black here would leak onto the next page and hide its styling.
    document.body.style.backgroundColor = ''
    document.body.style.color = ''
    document.body.style.backgroundImage = ''
    next()
})


watchEffect(() => {
    if (post?.value && isMounted?.value) {
        const data = post?.value?.data
        const bg = data.bg_color
        const fg = data.text_color
        const wallpaper = data.wallpaper?.url ? data.wallpaper.url : false

        // A per-post colour set in Prismic overrides the theme; otherwise clear
        // the inline styles so the site light/dark toggle controls the page.
        document.body.style.backgroundColor = bg || ''
        document.body.style.color = fg || ''
        document.body.style.backgroundImage = wallpaper ? `url(${wallpaper})` : ''
    }
})

const aspect = (image) => {
    const ratio = image.gallery_item.dimensions.width / image.gallery_item.dimensions.height
    return `aspect-${Math.floor(ratio * 100)}x${Math.floor(ratio * 100)}`
}

const itemClasses = (length, index, total, item) => {
    const classes = []
    if (length === 1) classes.push('w-full')
    else if (length === 2)  classes.push('md_w-1x2')
    else if (length === 3)  classes.push('md_w-1x3')
    else if (length === 4)  classes.push('md_w-1x4')
    else if (length === 5)  classes.push('md_w-1x5')
    else if (length === 6)  classes.push('md_w-1x6')

    if (item.vertical_align === 'Middle') classes.push('self-center')
    if (item.vertical_align === 'Bottom') classes.push('self-end')
    if (item.vertical_align === 'Top') classes.push('self-start')
    
    if (item.horizontal_align === 'Center') classes.push('justify-center')
    if (item.horizontal_align === 'Right') classes.push('justify-end')
    if (item.horizontal_align === 'Left') classes.push('justify-start')
    
    if (item.text_justification === 'Center') classes.push('text-center')
    if (item.text_justification === 'Right') classes.push('text-right')
    if (item.text_justification === 'Left') classes.push('text-left')
    
    return classes.join(' ')
}

const imageJustify = (item) => {
    const classes = []
    if (item.horizontal_align === 'Center') classes.push('justify-center')
    if (item.horizontal_align === 'Right') classes.push('justify-end')
    if (item.horizontal_align === 'Left') classes.push('justify-start')
    return classes.join(' ')
}

const itemStyle = (item, index, total) => {
    const style = {}
    if (item.image_size) style.width = !isMobile ? item.image_size * 100 + '%' : '100%'
    if (item.padding_top) style.paddingTop = !isMobile ? item.padding_top + 'vw' : 0
    if (item.padding_right) style.paddingRight = !isMobile ? item.padding_right + 'vw' : 0
    if (item.padding_bottom) style.paddingBottom = !isMobile ? item.padding_bottom + 'vw' : 0
    if (item.padding_left) style.paddingLeft = !isMobile ? item.padding_left + 'vw' : 0
    return style
}

// Gallery lightbox
const galleryOpen = ref(false)
const galleryIndex = ref(0)

const allImages = computed(() => {
    if (!post.value?.data?.rows) return []
    const imgs = []
    for (const row of post.value.data.rows) {
        for (const item of row.items) {
            if (item.image?.url) {
                imgs.push({ url: item.image.url, alt: item.image.alt, dimensions: item.image.dimensions })
            }
        }
    }
    return imgs
})

const flatIndexMap = computed(() => {
    if (!post.value?.data?.rows) return {}
    const map = {}
    let idx = 0
    for (let i = 0; i < post.value.data.rows.length; i++) {
        const row = post.value.data.rows[i]
        for (let j = 0; j < row.items.length; j++) {
            if (row.items[j].image?.url) {
                map[`${i}-${j}`] = idx++
            }
        }
    }
    return map
})

const openGallery = (rowIdx, itemIdx) => {
    const idx = flatIndexMap.value[`${rowIdx}-${itemIdx}`]
    if (idx !== undefined) {
        galleryIndex.value = idx
        galleryOpen.value = true
    }
}

const embedSize = (item, type) => {
    if (type === 'class') {
        let clazz = ''
        if (item.embed_size && !item.custom_embed_size) clazz = 'aspect-square'
        else if (!item.embed_size && !item.custom_embed_size) clazz = 'aspect-square'
        if (clazz) return [clazz]
    }
    else if (type === 'style') {
        let style = {}
        if (item.custom_embed_size) {
            style.aspectRatio = item.custom_embed_size.replace('/', ' / ')
            return style
        }
    }
}

</script>

<template lang="pug">
#page._container._mx-auto(class='min-h-[92vh]')
    template(v-if='!post || !post?.uid')
        .mx-4.py-4.md_mx-6.md_py-6.xl_mx-8.xl_py-8
            h1 404
            h2 Not found
    .mx-4.py-4.md_mx-6.md_py-6.xl_mx-8.xl_py-8(v-else)
        .title(class='text-[1.8rem] md_text-[2.4rem] xl_text-[3.3rem] lh-[0.8]').mb-8.md_w-10x12.font-b
            | {{  post?.data?.title?.[0]?.text }}
        
        .rows(v-if='post.data.rows')
            .row(v-for='(row,i) in post.data.rows' :key='i').mb-8.md_mb-8
                .flex.gap-4.md_gap-4.xl_gap-8.justify-center.items-center.flex-wrap.md_flex-nowrap
                    //- pre {{ row.items.length }}
                    .item(
                        v-for='(item, j) in row.items' 
                        :key='j'
                        :class='itemClasses(row.items.length, j, row.items.length, item)'
                    )
                        
                        .image(
                            v-if='item.image?.url'
                            :class='imageJustify(item)'
                            @click='openGallery(i, j)'
                        ).flex.mb-4.md_mb-0.cursor-pointer
                            prismic-image(
                                :field='item.image'
                                :imgix-params='{ "auto": "format,compress","w": 2400 / row.items.length, "h": 2000 / (row.items.length/2), "fit": "max" }'
                                :style='itemStyle(item, j, row.items.length)'
                            )
                        .caption(
                            v-if='item?.image?.alt'
                            style='font-size: 0.66rem;'
                        ).text-center.mt-1
                            | {{ item.image.alt }}
                        
                        .text(
                            v-if='item.text.length'
                            :style='itemStyle(item, j, row.items.length)'
                        )
                            prismic-rich-text(:field='item.text')
                        
                        .embed(
                            v-if='item.embed1?.embed_url || item.embed_code'
                            :style='itemStyle(item, j, row.items.length)'
                            :class='{ "mt-4": item.image?.url }'
                            class="_max-w-[calc(100%-2.5rem)]"
                        ).md_max-w-none.mx-auto.md_mx-0
                            prismic-embed(
                                v-if='item.embed1?.embed_url'
                                :field='item.embed1'
                                :class='{ "aspect-video": item.embed1?.provider_name === "YouTube" || item.embed1?.provider_name === "Vimeo", "aspect-square": item.embed_size === "square", "aspect-square": true }'
                            )
                            //- pre {{  item.embed1 }}
                            
                            .embed-inner(
                                v-if='item.embed_code'
                                v-html='item.embed_code'
                                :class='embedSize(item, "class")'
                                :style='embedSize(item, "style")'
                            )
                            //- pre {{  item.embed_code }}
                            
                        
        
        .text-lg(v-if='post?.data?.body')
            prismic-rich-text(:field='post.data.body')
        
        
        .embed(v-if='post.data?.embed?.embed_url').mt-12.w-full
            prismic-embed(
                :field='post.data.embed'
                :class='{ "aspect-video": post.embed?.provider_name === "YouTube" || post.embed?.provider_name === "Vimeo" }'
            )
        
        
    PostGallery(
        v-model='galleryOpen'
        :images='allImages'
        :initial-slide='galleryIndex'
    )
//- img(:src="post.data.featured_image.Hero.url.split('?')[0] + '?auto=format%2Ccompress&fit=facearea&facepad=10&w=2400&h=1000'").invert.my-16.rounded-full.drop-shadow-2xl
        
//- .gallery(v-if='post.data.gallery').my-16.drop-shadow-2xl
    //- pre {{ post.data.gallery }}
    Vue3Marquee(
        :duration='post.data.gallery.length * 10'
        :pauseOnHover='true'
    ).rounded-2xl
        .image(v-for='(image, i) in post.data.gallery.filter(e => e.gallery_item.url)' :key='i')
            img(
                :src='image.gallery_item.url.split("?")[0] + "?auto=format%2Ccompress&fit=max&h=1024"'
                :style='{ height: "512px", width: (512 * image.gallery_item.dimensions.width / image.gallery_item.dimensions.height) + "px" }'
            )
                //- .rounded-2xl.mx-4
                //- .rounded-lg.drop-shadow-2xl
            //- div().rounded-lg.drop-shadow-2xl
                //- img(:src="image.gallery_item.url.split('?')[0] + '?auto=format%2Ccompress&fit=facearea&facepad=10&w=2400&h=1000'").rounded-lg.drop-shadow-2xl
            //- img(:src="image.image.url.split('?')[0] + '?auto=format%2Ccompress&fit=facearea&facepad=10&w=2400&h=1000'").rounded-lg.drop-shadow-2xl

</template>

<style lang="sass">
iframe
    height: 100% !important
</style>