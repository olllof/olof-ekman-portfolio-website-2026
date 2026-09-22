<script setup>
// PREVIEW BUILD of the redesigned Portraits page — lives at a separate URL
// so it doesn't touch the live /posts/portraits page yet. It reads from the
// exact same Prismic "Portraits" document as the live page, so adding,
// removing or reordering images there updates this preview automatically.
// Once approved, rename this file to portraits.vue to make it live.

const { client } = usePrismic()
const { data: post } = await useAsyncData('portraits-preview', () =>
    client.getByUID('post', 'portraits')
)

const postTitle = computed(() => post.value?.data?.title?.[0]?.text || 'Portraits')
useSeoMeta({
    title: () => postTitle.value,
    ogTitle: () => `${postTitle.value} — Olof Ekman`,
    description: () => richTextToPlain(post.value?.data?.body) || `${postTitle.value} — photography by Olof Ekman, Berlin.`,
})

// Flatten every image out of the post's rows/items — same source data the
// live generic template reads, just re-laid-out here.
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

const hero = computed(() => allImages.value[0] || null)
const gallery = computed(() => allImages.value.slice(1))

const imgUrl = (url, w) => url.split('?')[0] + `?auto=format,compress&w=${w}`
</script>

<template lang="pug">
#portraits-page.mx-4.py-4.md_mx-6.md_py-6.xl_mx-8.xl_py-8(class='min-h-[92vh]')

    .hero.grid.gap-8.items-end.pb-8.mb-8(class='md_grid-cols-[0.85fr_1.15fr] border-b border-white/10')
        div
            h1.uppercase.font-b(class='text-[3rem] md_text-[4.5rem] leading-[0.86]') {{ postTitle }}
        .hero-media(v-if='hero')
            img.w-full.object-cover(
                :src='imgUrl(hero.url, 1400)'
                :alt='hero.alt || "Portrait"'
                :style='{ aspectRatio: `${hero.dimensions.width} / ${hero.dimensions.height}`, maxHeight: "560px" }'
            )

    .gallery.pb-8(class='columns-2 md_columns-3' style='column-gap: 2.5rem;')
        a.portrait-card.block.relative.overflow-hidden(
            v-for='(img, i) in gallery' :key='i'
            href='#'
            style='break-inside: avoid; background: #15171d; margin-bottom: 2.5rem;'
        )
            img.w-full.block(:src='imgUrl(img.url, 900)' :alt='img.alt || "Portrait"')

</template>

<style lang="sass">
#portraits-page
    .portrait-card img
        transition: transform 0.5s ease
    .portrait-card:hover img
        transform: scale(1.035)
</style>
