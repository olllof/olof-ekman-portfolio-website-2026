<template lang="pug">
#page.about
    template(v-if='!page || !page?.uid')
        .container.mx-auto(class='min-h-[92vh]').pt-10
            h1 404
            h2 Not found
    template(v-else)
        .flex(class='min-h-[100vh]')
            //- Left: image (fixed, full height on desktop)
            .w-1x2.hidden.md_block(v-if='page?.data?.image?.url')
                .image(
                    :style='{ backgroundImage: `url(${page.data.image.url})`, width: "calc(50vw - 1.75rem)" }'
                    class='fixed top-0 left-0 h-[100vh]'
                ).bg-cover.bg-center.bg-no-repeat.bg-gray-100
            //- Right: text (right half when there's an image, else a centered column)
            .w-full(:class='page?.data?.image?.url ? "md_w-1x2 md_ml-auto" : "md_w-10x12 md_mx-auto"')
                //- Mobile image on top
                .md_hidden.w-full(v-if='page?.data?.image?.url')
                    .image(
                        :style='{ backgroundImage: `url(${page.data.image.url})` }'
                        class='h-[45vh]'
                    ).bg-cover.bg-center.bg-no-repeat.bg-gray-100
                .px-6.py-8.md_px-8.md_py-16
                    .title(class='text-[1.8rem] md_text-[2.6vw] lh-[0.9]').mb-6.md_mb-8.font-b
                        | {{  page?.data?.title?.[0]?.text }}

                    .subtitle(
                        v-if="page?.data?.subheading"
                        class='text-[1.4rem] md_text-[1.6rem] lh-[0.9]'
                    ).mb-6.md_mb-8.font-b
                        | {{  page?.data?.subheading?.[0]?.text }}

                    .body(v-if='page?.data?.body').text-sm.md_text-base.pb-16
                        prismic-rich-text(:field='page.data.body')
</template>

<script setup>
const uid = useRoute().params.uid
const { client } = usePrismic()
const { data: page } = await useAsyncData('page', () =>
    client.getByUID('page', uid)
)

const pageTitle = computed(() => (page.value?.data?.title?.[0]?.text || page.value?.data?.subheading?.[0]?.text || 'Olof Ekman').trim())
useHead({ title: () => pageTitle.value })
useSeoMeta({
    ogTitle: () => `${pageTitle.value} — Olof Ekman`,
    description: () => richTextToPlain(page.value?.data?.body) || richTextToPlain(page.value?.data?.subheading),
    ogImage: () => page.value?.data?.image?.url,
})
</script>