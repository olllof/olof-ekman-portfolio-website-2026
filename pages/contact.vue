<script setup>
const { client } = usePrismic()
// Falls back to the defaults below until the "Contact Page" document is
// created in Prismic, so this never breaks the live /contact route.
const { data: page } = await useAsyncData('contact-page', () =>
    client.getSingle('contact_page').catch(() => ({}))
)

const d = computed(() => page.value?.data || {})

const heading = computed(() => d.value.heading || 'Contact')
const intro = computed(() => d.value.intro || "For bookings, prints, or any questions, please get in touch. I'd love to hear from you.")
const email = computed(() => d.value.email || 'hello@olofekman.com')
const instagramHandle = computed(() => d.value.instagram_handle || '@ollllof')
const instagramLink = computed(() => d.value.instagram_link?.url ? d.value.instagram_link : { link_type: 'Web', url: 'https://www.instagram.com/ollllof/' })
const heroImage = computed(() => d.value.hero_image?.url || '')

useSeoMeta({
    title: () => heading.value,
    ogTitle: () => `${heading.value} — Olof Ekman`,
    description: () => intro.value,
    ogImage: () => heroImage.value,
})

const form = reactive({ name: '', email: '', subject: '', message: '' })
const status = ref('idle') // idle | sending | sent | error
const errorMessage = ref('')

const submit = async () => {
    status.value = 'sending'
    errorMessage.value = ''
    try {
        await $fetch('/api/contact', { method: 'POST', body: { ...form } })
        status.value = 'sent'
        form.name = ''
        form.email = ''
        form.subject = ''
        form.message = ''
    } catch (err) {
        status.value = 'error'
        errorMessage.value = err?.data?.statusMessage || 'Something went wrong — please try again.'
    }
}
</script>

<template lang="pug">
#contact-page.flex(class='min-h-[100vh]')
    .w-1x2.hidden.md_block(v-if='heroImage')
        .image(:style='{ backgroundImage: `url(${heroImage})` }' class='fixed top-0 left-0 h-[100vh]').bg-cover.bg-center.bg-no-repeat.bg-gray-100(style='width: calc(50vw - 1.75rem);')
    .w-full.px-6.py-10.md_py-16(:class='heroImage ? "md_w-1x2 md_ml-auto md_px-10 xl_px-16" : "md_w-10x12 md_mx-auto md_px-10"')
        h1.uppercase.font-b.page-title.mb-6 {{ heading }}
        p.mb-8(class='max-w-[46ch]') {{ intro }}

        form.mb-10(@submit.prevent='submit')
            .grid.gap-6.mb-6(class='md_grid-cols-2')
                .field
                    label.mono.uppercase.text-xs(for='cf-name') Name *
                    input#cf-name(v-model='form.name' type='text' required)
                .field
                    label.mono.uppercase.text-xs(for='cf-email') Email *
                    input#cf-email(v-model='form.email' type='email' required)
            .field.mb-6
                label.mono.uppercase.text-xs(for='cf-subject') Subject
                input#cf-subject(v-model='form.subject' type='text')
            .field.mb-8
                label.mono.uppercase.text-xs(for='cf-message') Message *
                textarea#cf-message(v-model='form.message' rows='5' required)

            button.underline-hover.mono.uppercase(type='submit' :disabled='status === "sending"' class='text-sm')
                | {{ status === 'sending' ? 'Sending…' : 'Send message' }} →

            p.mt-4.text-sm.menu-color(v-if='status === "sent"') Thanks — your message is on its way.
            p.mt-4.text-sm(v-if='status === "error"' style='color: #e0392b;') {{ errorMessage }}

        .divider.mb-8

        .info-block.mb-6
            .mono.uppercase.text-xs.opacity-60.mb-1 Email
            a.underline-hover(:href='`mailto:${email}`') {{ email }}
        .info-block
            .mono.uppercase.text-xs.opacity-60.mb-1 Instagram
            prismic-link.underline-hover(:field='instagramLink') {{ instagramHandle }}
</template>

<style lang="sass">
#contact-page
    .page-title
        display: block
        font-size: clamp(2.2rem, 11vw, 4.5rem)
        line-height: 0.86
        @media (min-width: 768px)
            font-size: 4.5rem

    .field
        display: flex
        flex-direction: column
        gap: 0.5rem

    input, textarea
        background: transparent
        border: none
        border-bottom: 1px solid rgba(255,255,255,0.25)
        color: inherit
        font-family: inherit
        font-size: 1rem
        padding: 0.4rem 0
        outline: none
        transition: border-color 0.2s ease
        resize: vertical
        &:focus
            border-bottom-color: rgba(255,255,255,0.8)

    button[type='submit']
        background: none
        border: none
        padding: 0
        cursor: pointer
        &:disabled
            opacity: 0.5
            cursor: default

    .divider
        width: 2rem
        height: 1px
        background: rgba(255,255,255,0.3)
</style>
