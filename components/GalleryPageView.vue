<script setup>
// Shared layout for the redesigned gallery pages (Portraits, Weddings,
// Festivals, Families) — same hero + gap-free masonry gallery as Prints,
// minus the price/shop band since these aren't for sale. Reads a
// `gallery_page` Prismic document by UID.

const props = defineProps({
    uid: { type: String, required: true },
})

const { client } = usePrismic()
const { data: page } = await useAsyncData(`gallery-page-${props.uid}`, () =>
    client.getByUID('gallery_page', props.uid)
)

const d = computed(() => page.value?.data || {})

const title = computed(() => d.value.title || props.uid)
const tagline = computed(() => d.value.tagline || '')
const description = computed(() => d.value.description || '')
// No button at all unless a label is set in Prismic.
const ctaLabel = computed(() => d.value.cta_label || '')
const ctaLink = computed(() => d.value.cta_link)

const hero = computed(() => ({
    image: d.value.hero_image?.url || '',
    caption: d.value.hero_caption || '',
}))
// Skip any item that's mid-edit in Prismic (image not set yet) so an
// in-progress edit never breaks the live page.
const items = computed(() => (d.value.gallery || []).filter(g => g.image?.url))

useSeoMeta({
    title: () => title.value,
    ogTitle: () => `${title.value} — Olof Ekman`,
    description: () => description.value || `${title.value} — photography by Olof Ekman, Berlin.`,
    ogImage: () => hero.value.image,
})

const imgUrl = (url, w) => url.split('?')[0] + `?auto=format,compress&w=${w}`

// Click any image (including the hero) to see it full-size in the same
// zoom/pan lightbox used elsewhere on the site.
const allImages = computed(() => [
    { url: hero.value.image, alt: hero.value.caption || title.value },
    ...items.value.map(g => ({ url: g.image.url, alt: g.caption || g.image.alt })),
])
const galleryOpen = ref(false)
const galleryIndex = ref(0)
const openLightbox = (i) => {
    galleryIndex.value = i
    galleryOpen.value = true
}

// Deterministic column placement: image 1 goes to column 1, image 2 to
// column 2, image 3 to column 3, image 4 back to column 1, etc. — instead
// of the browser's height-balanced `columns` fill, which is unpredictable
// from the Prismic editor's point of view. Each column then just stacks
// its images naturally (no cropping), so the visual style is unchanged.
// An image can also be pinned to a specific column via its "Column" field
// in Prismic (left on "Auto" otherwise), which overrides the round-robin
// for just that image. Column numbers above the column count wrap around
// (only relevant on desktop's 3 columns — mobile is a single column, so
// pinning has nothing to override there).
const distributeColumns = (n) => {
    const cols = Array.from({ length: n }, () => [])
    items.value.forEach((item, i) => {
        const pinned = parseInt(item.column, 10)
        const col = pinned >= 1 ? (pinned - 1) % n : i % n
        cols[col].push({ item, i })
    })
    return cols
}
const mobileColumns = computed(() => distributeColumns(1))
const desktopColumns = computed(() => distributeColumns(3))
</script>

<template lang="pug">
#gallery-page-view.mx-4.py-4.md_mx-6.md_py-6.xl_mx-8.xl_py-8(class='min-h-[92vh]')

    category-nav(:active='uid')

    .hero.grid.gap-8.items-end.pb-8.mb-8(class='md_grid-cols-[1.05fr_1fr] border-b' style='border-color: color-mix(in srgb, currentColor 10%, transparent);')
        div
            h1.uppercase.font-b.page-title.mb-4 {{ title }}
            p.mb-4(v-if='tagline' class='text-[1.1rem] md_text-[1.4rem] italic' style='font-family: "Antic Didone", serif;') {{ tagline }}
            p.mb-6(v-if='description' class='max-w-[34ch] text-sm') {{ description }}
            prismic-link.underline-hover.mono.uppercase(v-if='ctaLabel' :field='ctaLink' class='text-xs') {{ ctaLabel }} →
        .hero-media.relative.cursor-pointer(v-if='hero.image' @click='openLightbox(0)')
            img.w-full.object-cover(:src='imgUrl(hero.image, 1400)' :alt='hero.caption || title' class='h-[260px] md_h-[420px]')
            .mt-2.mono(v-if='hero.caption' class='text-xs') {{ hero.caption }}

    .gallery.pb-8
        .gallery-grid.flex.md_hidden
            .gallery-col(v-for='(col, ci) in mobileColumns' :key='"m" + ci')
                a.gallery-card.cursor-pointer(
                    v-for='{ item, i } in col' :key='i'
                    href='#'
                    @click.prevent='openLightbox(i + 1)'
                )
                    .thumb.relative.overflow-hidden(style='background: #15171d;')
                        img.w-full.block(:src='imgUrl(item.image.url, 900)' :alt='item.caption || item.image.alt')
                    .cap.pt-2(v-if='item.caption')
                        .text-sm {{ item.caption }}
                        .cap-line

        .gallery-grid.hidden.md_flex
            .gallery-col(v-for='(col, ci) in desktopColumns' :key='"d" + ci')
                a.gallery-card.cursor-pointer(
                    v-for='{ item, i } in col' :key='i'
                    href='#'
                    @click.prevent='openLightbox(i + 1)'
                )
                    .thumb.relative.overflow-hidden(style='background: #15171d;')
                        img.w-full.block(:src='imgUrl(item.image.url, 900)' :alt='item.caption || item.image.alt')
                    .cap.pt-2(v-if='item.caption')
                        .text-sm {{ item.caption }}
                        .cap-line

    PostGallery(
        v-model='galleryOpen'
        :images='allImages'
        :initial-slide='galleryIndex'
    )

</template>

<style lang="sass">
#gallery-page-view

    .page-title
        display: block
        font-size: clamp(1.3rem, calc((100vw - 4.5rem) / 8), 4.5rem)
        line-height: 0.86
        @media (min-width: 768px)
            font-size: 4.5rem

    .gallery-grid
        gap: 1.75rem
        @media (min-width: 768px)
            gap: 2.5rem

    .gallery-col
        flex: 1
        min-width: 0
        display: flex
        flex-direction: column
        gap: 1.75rem
        @media (min-width: 768px)
            gap: 2.5rem

    .gallery-card
        .thumb img
            transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)

        &:hover .thumb img
            transform: scale(1.05)

    .cap-line
        width: 2rem
        height: 1px
        background: color-mix(in srgb, currentColor 30%, transparent)
        margin-top: 0.5rem
</style>
