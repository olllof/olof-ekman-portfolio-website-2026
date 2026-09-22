<script setup>
useSeoMeta({
    title: 'Prints',
    ogTitle: 'Prints — Olof Ekman',
    description: 'Fine art photography prints by Olof Ekman. Printed in Berlin, signed and carefully packed.',
})

// TEMP placeholder selection — swap these for the real print picks, prices
// and editions whenever those are decided. `demo` is an optional short
// muted clip (public/prints/*.mp4) that plays on hover/tap over the image.
const hero = {
    image: 'https://images.prismic.io/olof-ekman/9EsWqC8BodSI1clB_OlofEkman_Concert_Scion%26Tikiman17.jpg',
    location: 'Sweden', year: 2024, price: 95,
}

const prints = [
    { image: 'https://images.prismic.io/olof-ekman/lnzrKpcpwWaxH6UC_Max.jpg', location: 'Berlin', year: 2024, price: 85, demo: '/prints/grid1-demo.mp4' },
    { image: 'https://images.prismic.io/olof-ekman/GvYco6kEGHVwhk1q_DSCF0177.jpg', location: 'Berlin', year: 2024, price: 75 },
    { image: 'https://images.prismic.io/olof-ekman/6P0K856AtNO4ep3S_R1-02106-0019.jpg', location: 'Berlin', year: 2023, price: 75 },
    { image: 'https://images.prismic.io/olof-ekman/563m0RugDrme2_Ep_Anja%26KiretWedding_%F0%9F%93%B8Olof_Ekman_Edited1st_Selection24.jpg', location: 'Berlin', year: 2024, price: 95 },
    { image: 'https://images.prismic.io/olof-ekman/U1aUkMSeo8rzqMgF_IMG_4700.jpg', location: 'Berlin', year: 2023, price: 75 },
    { image: 'https://images.prismic.io/olof-ekman/Jpejfy7w3vhyaphb_R1-05113-0006.jpg', location: 'Berlin', year: 2024, price: 85 },
    { image: 'https://images.prismic.io/olof-ekman/220bLJ-zHpWuOhZX_Anja%26KiretWedding_%F0%9F%93%B8Olof_Ekman_Edited1st_Selection10.jpg', location: 'Berlin', year: 2024, price: 95 },
    { image: 'https://images.prismic.io/olof-ekman/5h7YqaepGY2HuTIy_DSCF0609.jpg', location: 'Berlin', year: 2025, price: 75 },
    { image: 'https://images.prismic.io/olof-ekman/7WripKUMmiO_6IBT_Anja%26KiretWedding_%F0%9F%93%B8Olof_Ekman_Edited2nd_Selection22.jpg', location: 'Berlin', year: 2024, price: 85 },
]

const imgUrl = (url, w) => url.split('?')[0] + `?auto=format,compress&w=${w}`

// Which print (by index) currently has its demo clip playing (hover preview
// on desktop only — tapping a print opens the full-size lightbox instead).
const playingIndex = ref(null)

const startDemo = (i, item) => {
    if (!item.demo) return
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
    { url: hero.image, alt: `${hero.location}, ${hero.year}` },
    ...prints.map(p => ({ url: p.image, alt: `Print, ${p.location} ${p.year}` })),
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
            h1.uppercase.font-b(class='text-[3rem] md_text-[4.5rem] leading-[0.86] mb-4') Prints
            p.mb-4(class='text-[1.1rem] md_text-[1.4rem] italic' style='font-family: "Antic Didone", serif;') Photographs to live with.
            p.mb-6(class='max-w-[34ch] opacity-70 text-sm') A selection of photographs available as fine art prints. Printed in Berlin, signed and carefully packed.
            nuxt-link.underline-hover.mono.uppercase(to='/prints#about' class='text-xs') About prints →
        .hero-media.relative.cursor-pointer(@click='openLightbox(0)')
            img.w-full.object-cover(:src='imgUrl(hero.image, 1400)' :alt='`${hero.location}, ${hero.year}`' class='h-[260px] md_h-[420px]')
            .flex.justify-between.mt-2.mono.opacity-70(class='text-xs')
                span {{ hero.location }}, {{ hero.year }}
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
                img.w-full.block(:src='imgUrl(item.image, 900)' :alt='`Print, ${item.location} ${item.year}`' :style='{ opacity: playingIndex === i ? 0 : 1, transition: "opacity 0.35s ease" }')
                video.absolute.inset-0.w-full.h-full(
                    v-if='item.demo'
                    :data-print-video='i'
                    :src='item.demo'
                    muted loop playsinline preload='metadata'
                    :style='{ opacity: playingIndex === i ? 1 : 0, transition: "opacity 0.35s ease", objectFit: "cover" }'
                )
                span.play-hint.mono.uppercase(v-if='item.demo' class='text-[0.6rem]') Hover to preview
            .cap.pt-2
                .text-sm {{ item.location }}, {{ item.year }}
                .mono.menu-color(class='text-xs') From €{{ item.price }}
                .cap-line

    nuxt-link.view-all.mono.uppercase.inline-flex.items-center.gap-2.mb-8(to='/prints' class='text-xs border border-white/15 px-4 py-3') View all prints →

    .band.grid.gap-8.pt-8(class='md_grid-cols-3 border-t border-white/10')
        h2.uppercase.font-b(class='text-[2.2rem] md_text-[2.8rem] leading-[0.92]') Made to be lived with.
        p.opacity-70(class='text-sm max-w-[38ch] self-center') My prints are produced to order in Berlin using archival pigment inks on fine art paper. Each print is carefully checked, signed by me, and packed with care.
        .specs.flex.flex-col.gap-2.justify-center.mono.uppercase(class='text-xs opacity-70')
            div(class='pl-3 border-l border-white/15') Fine art paper
            div(class='pl-3 border-l border-white/15') Archival pigment inks
            div(class='pl-3 border-l border-white/15') Printed in Berlin
            div(class='pl-3 border-l border-white/15') Signed by Olof

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
