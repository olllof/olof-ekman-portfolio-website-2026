<script setup>
const { client } = usePrismic()

// const { data: posts } = await useAsyncData('posts', () => client.getByType('post', { 
//     pageSize: 100,


const { data: homepage } = await useAsyncData('homepage', () => {
    return client.getSingle('homepage', {
        fetchLinks: 'post.title,post.featured_image'
    })
})

</script>

<template lang="pug">
.heroes.w-full.mb-16
    //- (class='aspect-[2/1]')
    //- pre {{ homepage?.data?.featured }}
    Vue3Marquee(
        :duration='10 * homepage?.data?.featured.length'
        :pauseOnHover='true'
    ).drop-shadow-2xl
        .hero(v-for='hero in homepage?.data?.featured').grayscale.hover_grayscale-0
            //- pre {{ hero.image_override }}
            //- pre {{ hero.title_override }}
            //- pre {{ hero.text }}
            
            .img(
                :style='{ backgroundImage: `url(${hero.post?.data?.featured_image.url.split("?")[0] + "?auto=format%2Ccompress&fit=crop&w=2400&h=1200"})`, width: (512 * 2) + "px"}'
                class='h-[512px]'
            ).bg-cover.bg-center.flex.flex-col.justify-center.items-center
                .w-10x12
                    .title.druk(style='font-size: 8vh; line-height: 0.9;').text-center
                        | {{ hero.post?.data?.title[0]?.text }}
            //- .background-cover.background-center.no-repeat
            
            //- pre hi
            
    
</template>

<style lang="sass">
.hero:hover
    .title
        color: #FA0
.img .title
    color: white
        // text-shadow: 0px 0px 50px #000
</style>
