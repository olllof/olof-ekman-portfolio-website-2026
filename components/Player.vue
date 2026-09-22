<script setup>
const { client } = usePrismic()

const { data: radio } = await useAsyncData('radio', () => {
    return client.getSingle('radio', {
        // fetchLinks: 'post.title,post.featured_image'
    })
})

</script>

<template lang="pug">
#player.fixed.bottom-0.left-0.md_left-auto.md_right-16.z-50(
    class='w-[90vw] w-max-w-[20rem] md_w-[30rem]'
)
    //- .wrapper(
    //-     class='shadow-[#00000033] h-[4.6rem] border-[#0005B4]'
    //- ).mx-4.my-4.rounded-lg.shadow-xl.overflow-hidden.border-2
    //-     iframe(width='100%' height='100' border='0' style='border: 0;' src='https://us7.streamingpulse.com/4589/' class='')
    .wrapper(
        class='shadow-[#00000033] h-[130px] border-[#0005B4]'
    ).mx-4.my-4.rounded-lg.shadow-xl.overflow-hidden.border-2
        div(v-html='radio?.data?.soundcloud_embed', v-if='radio && radio.data && radio.data.soundcloud_embed')
        //- pre {{  }}
</template>

<style lang="sass">

</style>