<script setup>
const { client } = usePrismic()
const { data: page } = await useAsyncData('prints-page', () => client.getSingle('prints_page'))

const d = computed(() => page.value?.data || {})

const title = computed(() => d.value.title || 'Prints')
const tagline = computed(() => d.value.tagline || 'Photographs to live with.')
const description = computed(() => d.value.description || 'A selection of photographs available as fine art prints. Printed in Berlin, signed and carefully packed.')
const bandHeading = computed(() => d.value.band_heading || 'Made to be lived with.')
const bandDescription = computed(() => d.value.band_description || 'My prints are produced to order in Berlin using archival pigment inks on fine art paper. Each print is carefully checked, signed by me, and packed with care.')
const specs = computed(() => {
    const list = (d.value.specs || []).map(s => s.label).filter(Boolean)
    return list.length ? list : ['Fine art paper', 'Archival pigment inks', 'Printed in Berlin', 'Signed by Olof']
})

const hero = computed(() => ({
    image: d.value.hero_image?.url || '',
    caption: d.value.hero_caption || '',
    price: d.value.hero_price,
}))
// Skip any print entry that's mid-edit in Prismic (image not set yet) so an
// in-progress edit never breaks the live page — it just doesn't show until
// the image is added.
const prints = computed(() => (d.value.prints || []).filter(p => p.image?.url))

useSeoMeta({
    title: () => title.value,
    ogTitle: () => `${title.value} — Olof Ekman`,
    description: () => description.value,
    ogImage: () => hero.value.image,
})

const imgUrl = (url, w) => url.split('?')[0] + `?auto=format,compress&w=${w}`

// Which print (by index) currently has its demo clip playing (hover preview
// on desktop only — tapping a print opens the full-size lightbox instead).
const playingIndex = ref(null)

const startDemo = (i, item) => {
    if (!item.demo_video?.url) return
    playingIndex.value = i
    nextTick(() => {
        const el = document.querySelector(`[data-print-video="${i}"]`)
        if (el) { el.currentTime = 0; el.play().catch(() => {}) }
    })
}
const stopDemo = (i) => {
    if (playingIndex.value !== i) return
    playingIndex.value = null
    const el = document.querySelector(`[data-print-video="${i}"]`)
    if (el) el.pause()
}

// Click any print (including the hero) to see it full-size in the same
// zoom/pan lightbox used on the Portraits/Weddings/etc. pages.
const allImages = computed(() => [
    { url: hero.value.image, alt: hero.value.caption },
    ...prints.value.map(p => ({ url: p.image?.url, alt: p.caption || p.image?.alt })),
])
const galleryOpen = ref(false)
const galleryIndex = ref(0)
const openLightbox = (i) => {
    galleryIndex.value = i
    galleryOpen.value = true
}
</script>

<template lang="pug">
#prints-page.mx-4.py-4.md_mx-6.md_py-6.xl_mx-8.xl_py-8(class='min-h-[92vh]')

    .hero.grid.gap-8.items-end.pb-8.mb-8(class='md_grid-cols-[1.05fr_1fr] border-b border-white/10')
        div
            h1.uppercase.font-b(class='text-[3rem] md_text-[4.5rem] leading-[0.86] mb-4') {{ title }}
            p.mb-4(class='text-[1.1rem] md_text-[1.4rem] italic' style='font-family: "Antic Didone", serif;') {{ tagline }}
            p.mb-6(class='max-w-[34ch] text-sm') {{ description }}
            nuxt-link.underline-hover.mono.uppercase(to='/prints#about' class='text-xs') About prints →
        .hero-media.relative.cursor-pointer(v-if='hero.image' @click='openLightbox(0)')
            img.w-full.object-cover(:src='imgUrl(hero.image, 1400)' :alt='hero.caption' class='h-[260px] md_h-[420px]')
            .flex.justify-between.mt-2.mono.opacity-70(class='text-xs')
                span {{ hero.caption }}
                span.menu-color From €{{ hero.price }}

    .gallery.pb-8(class='columns-2 md_columns-3 gap-4' style='column-gap: 1.2rem;')
        a.print-card.block.mb-6.cursor-pointer(
            v-for='(item, i) in prints' :key='i'
            href='#'
            @mouseenter='startDemo(i, item)'
            @mouseleave='stopDemo(i)'
            @click.prevent='openLightbox(i + 1)'
            style='break-inside: avoid;'
        )
            .thumb.relative.overflow-hidden(style='background: #15171d;')
                img.w-full.block(:src='imgUrl(item.image.url, 900)' :alt='item.caption' :style='{ opacity: playingIndex === i ? 0 : 1, transition: "opacity 0.35s ease" }')
                video.absolute.inset-0.w-full.h-full(
                    v-if='item.demo_video?.url'
                    :data-print-video='i'
                    :src='item.demo_video.url'
                    muted loop playsinline preload='metadata'
                    :style='{ opacity: playingIndex === i ? 1 : 0, transition: "opacity 0.35s ease", objectFit: "cover" }'
                )
                span.play-hint.mono.uppercase(v-if='item.demo_video?.url' class='text-[0.6rem]') Hover to preview
            .cap.pt-2
                .text-sm {{ item.caption }}
                .mono.menu-color(class='text-xs') From €{{ item.price }}
                .cap-line

    nuxt-link.view-all.mono.uppercase.inline-flex.items-center.gap-2.mb-8(to='/prints' class='text-xs border border-white/15 px-4 py-3') View all prints →

    .band.grid.gap-8.pt-8(class='md_grid-cols-3 border-t border-white/10')
        h2.uppercase.font-b(class='text-[2.2rem] md_text-[2.8rem] leading-[0.92]') {{ bandHeading }}
        p.opacity-70(class='text-sm max-w-[38ch] self-center') {{ bandDescription }}
        .specs.flex.flex-col.gap-2.justify-center.mono.uppercase(class='text-xs opacity-70')
            div(v-for='(spec, i) in specs' :key='i' class='pl-3 border-l border-white/15') {{ spec }}

    PostGallery(
        v-model='galleryOpen'
        :images='allImages'
        :initial-slide='galleryIndex'
    )

</template>

<style lang="sass">
#prints-page
    .play-hint
        position: absolute
        top: 0.6rem
        right: 0.6rem
        z-index: 2
        color: #fff
        background: rgba(12,14,18,0.55)
        border: 1px solid rgba(255,255,255,0.14)
        padding: 0.25rem 0.5rem
        opacity: 0
        transition: opacity 0.25s ease
        pointer-events: none
    .print-card:hover .play-hint
        opacity: 1
    .cap-line
        width: 2rem
        height: 1px
        background: rgba(255,255,255,0.3)
        margin-top: 0.5rem
</style>
