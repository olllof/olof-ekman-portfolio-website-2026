<script setup>
const props = defineProps({
    post: Object,
    i: Number
})

</script>

<template lang="pug">
nuxt-link(:to='`/posts/${post.uid}`').post
    prismic-image(
        :field='post.data.featured_image'
        :alt='post.data.title[0].text'
        :imgix-params='{ fit: "crop", w: 1024, h: 1024 }'
        class='w-[512px] rounded-[7vw]'
    )
    //- .px-8
    
    //- prismic-rich-text(:field='post.data.title').mb-16
        //- .flex
            //- .w-1x12.order-1
            
            //- .w-2x12(:class='{ "order-2": i % 2 === 0, "order-3": i % 2 !== 0 }')
                .image
                    //- (:style='{ transform: "translateX("+ (Math.random() * 50 - 25) +"%) translateY("+ (Math.random() * 300 - 150) +"px)" }')
                    prismic-image(
                        :field='post.data.featured_image'
                    )
                    //- .xinvert.aspect-square.rounded-full.xgrayscale
            
            //- .w-7x12(:class='{ "order-2": i % 2 !== 0, "order-3": i % 2 === 0 }')
                prismic-rich-text(:field='post.data.body')
</template>

<style lang="sass">
// .post h1
//     font-size: 2rem
    // font-size: 7vw
    // line-height: 0.8
    // font-family: 'Drukk'
    // .title(style='font-size: 9vw; line-height: 0.8;').mb-8.druk.w-10x12
</style>