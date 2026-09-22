<script setup>
const router = useRouter()
const currentRoute = computed(() => router.currentRoute.value.path)
const isHome = computed(() => currentRoute.value === "/")
</script>

<template lang="pug">
footer#app-footer.pt-4.md_pt-8.pb-2.pl-4.relative.z-20.opacity-30
    //- .container.mx-auto.py-8
    .text-xs(:class='{ "md_pl-8 md_pr-32": !isHome }')
        .md_flex.justify-between
            .left
                .flex.gap-4
                    a(href='https://www.instagram.com/ollllof/' target="_blank")
                        | Instagram

            .right.md_text-right.mt-2.md_mt-0(v-if='! isHome')
                | &copy; 2026 Olof Ekman

</template>
