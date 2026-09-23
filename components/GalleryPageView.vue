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
</script>

<template lang="pug">
#gallery-page-view.mx-4.py-4.md_mx-6.md_py-6.xl_mx-8.xl_py-8(class='min-h-[92vh]')

    .hero.grid.gap-8.items-end.pb-8.mb-8(class='md_grid-cols-[1.05fr_1fr] border-b border-white/10')
        div
            h1.uppercase.font-b(class='text-[3rem] md_text-[4.5rem] leading-[0.86] mb-4') {{ title }}
            p.mb-4(v-if='tagline' class='text-[1.1rem] md_text-[1.4rem] italic' style='font-family: "Antic Didone", serif;') {{ tagline }}
            p.mb-6(v-if='description' class='max-w-[34ch] opacity-70 text-sm') {{ description }}
        .hero-media.relative.cursor-pointer(v-if='hero.image' @click='openLightbox(0)')
            img.w-full.object-cover(:src='imgUrl(hero.image, 1400)' :alt='hero.caption || title' class='h-[260px] md_h-[420px]')
            .mt-2.mono.opacity-70(v-if='hero.caption' class='text-xs') {{ hero.caption }}

    .gallery.pb-8(class='columns-2 md_columns-3')
        a.gallery-card.block.cursor-pointer(
            v-for='(item, i) in items' :key='i'
            href='#'
            @click.prevent='openLightbox(i + 1)'
            style='break-inside: avoid;'
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
    .gallery
        column-gap: 2.5rem

    .gallery-card
        margin-bottom: 2.5rem

    .cap-line
        width: 2rem
        height: 1px
        background: rgba(255,255,255,0.3)
        margin-top: 0.5rem
</style>
