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
.heroes.w-full
    .mx-16.my-8
        
        //- .prev.w-12.text-2xl.font-normal.opacity-50.hover_opacity-100.z-50.cursor-pointer.hidden.md_block.flex.justify-center.items-center.h-16.text-center.absolute.h-0(class='translate-y-[290px]')
        //-         icon(name='solar:alt-arrow-left-linear').w-12

        //- .next.w-12.text-2xl.font-normal.opacity-50.hover_opacity-100.z-50.relative.cursor-pointer.hidden.md_block.flex.justify-center.items-center.h-16.text-center.float-right.absolute.h-0(class='translate-y-[290px]')
        //-     icon(name='solar:alt-arrow-right-linear').w-12

        swiper(
            :modules="[SwiperAutoplay, SwiperNavigation]"
            :slides-per-view="1"
            :autoplay="{ delay: 6000 }"
            :space-between="0"
            :grab-cursor="true"
            :loop="true"
            :navigation="{ nextEl: '.next', prevEl: '.prev' }"
        ).swiper
            swiper-slide.hero(v-for='(hero, i) in homepage?.data?.featured' :key='i').swiper-slide
                .img(
                    :style='{ backgroundImage: `url(${hero.post?.data?.featured_image.url.split("?")[0] + "?auto=format%2Ccompress&fit=crop&w=2400&h=1200"})`}'
                    class='h-[512px]'
                ).bg-cover.bg-center.flex.flex-col.justify-center.items-center
                    //- , width: (512 * 2) + "px"
                    .w-10x12
                        .title(style='font-size: 8vh; line-height: 0.9;').text-center.druk
                            | {{ hero.post?.data?.title[0]?.text }}

</template>

<style lang="sass">
.hero
    // :hover
    .title
        // color: #FA0 !important
        color: #FFF !important
        // mix-blend-mode: difference
.img .title
    color: white
        // text-shadow: 0px 0px 50px #000
.swiper, .swiper-slide
    border-radius: 100px
</style>
