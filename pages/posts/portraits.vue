<script setup>
useSeoMeta({
    title: 'Portraits',
    ogTitle: 'Portraits — Olof Ekman',
    description: 'Portraits — photography by Olof Ekman, Berlin.',
})

// PREVIEW BUILD — swap any of these image URLs (or the order) freely before
// this replaces the live /posts/portraits page. `hero` is the big featured
// shot at the top; `ratio` is its width/height so the hero box never crops
// it unexpectedly. `gallery` is the masonry grid below, in display order.
const hero = {
    image: 'https://images.prismic.io/olof-ekman/uGqYQmO7-5VEkWtX_Zylvacleanbackground.png',
    ratio: '850 / 566',
}

const gallery = [
    'https://images.prismic.io/olof-ekman/9m7Y6x59C1dkENxF_DSCF5966.jpg',
    'https://images.prismic.io/olof-ekman/QuCNj6E56T5xblFF__DSF2791.jpg',
    'https://images.prismic.io/olof-ekman/Jpejfy7w3vhyaphb_R1-05113-0006.jpg',
    'https://images.prismic.io/olof-ekman/lnzrKpcpwWaxH6UC_Max.jpg',
    'https://images.prismic.io/olof-ekman/S2eMyV5Qpn9KimvL_DSCF6166.jpg',
    'https://images.prismic.io/olof-ekman/PxbhWykgsZetN0Wl_DSCF1800.jpg',
    'https://images.prismic.io/olof-ekman/xiy5DTVC8h7cfx0v_11--3120olaf9547.jpg',
    'https://images.prismic.io/olof-ekman/iLFaPujpupeWb7aG__DSF2698.jpg',
    'https://images.prismic.io/olof-ekman/ymHg7Oh-1XFixwtF_DSC00043.jpg',
    'https://images.prismic.io/olof-ekman/zcYF5WD_sMeqHIFO_DSCF5905.jpg',
    'https://images.prismic.io/olof-ekman/U1aUkMSeo8rzqMgF_IMG_4700.jpg',
]

const imgUrl = (url, w) => url.split('?')[0] + `?auto=format,compress&w=${w}`
</script>

<template lang="pug">
#portraits-page.mx-4.py-4.md_mx-6.md_py-6.xl_mx-8.xl_py-8(class='min-h-[92vh]')

    .hero.grid.gap-8.items-end.pb-8.mb-8(class='md_grid-cols-[0.85fr_1.15fr] border-b border-white/10')
        div
            h1.uppercase.font-b(class='text-[3rem] md_text-[4.5rem] leading-[0.86]') Portraits
        .hero-media
            img.w-full.object-cover(:src='imgUrl(hero.image, 1400)' alt='Portrait' :style='{ aspectRatio: hero.ratio, maxHeight: "560px" }')

    .gallery.pb-8(class='columns-2 md_columns-3 gap-4' style='column-gap: 1.2rem;')
        a.portrait-card.block.relative.overflow-hidden.mb-4(
            v-for='(img, i) in gallery' :key='i'
            href='#'
            style='break-inside: avoid; background: #15171d;'
        )
            img.w-full.block(:src='imgUrl(img, 900)' alt='Portrait')

</template>

<style lang="sass">
#portraits-page
    .portrait-card img
        transition: transform 0.5s ease
    .portrait-card:hover img
        transform: scale(1.035)
</style>
