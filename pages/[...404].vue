<template lang="pug">
.container.mx-auto
  //- layout-seo
  .page#about.mb-24
    .inner.flex(style='min-height: 80vh').justify-center.items-center
      .box.text-center
        h1.mb-4.text-xl.uppercase Page not found
        nuxt-link(to='/').underline Home
</template>

<script setup>
useSeoMeta({
    title: 'Page not found',
    description: '404',
    ogImage: '/idol-share.png',
})

</script>