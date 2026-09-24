export default defineEventHandler(async (event) => {
    const { name, email, subject, message } = await readBody(event)

    if (!name || !email || !message) {
        throw createError({ statusCode: 400, statusMessage: 'Name, email and message are required.' })
    }

    const config = useRuntimeConfig()
    if (!config.resendApiKey) {
        throw createError({ statusCode: 500, statusMessage: 'Email sending is not configured yet.' })
    }

    const result = await $fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${config.resendApiKey}`,
            'Content-Type': 'application/json',
        },
        body: {
            from: 'Olof Ekman website <onboarding@resend.dev>',
            to: [config.contactToEmail || 'hello@olofekman.com'],
            reply_to: email,
            subject: subject ? `[Contact form] ${subject}` : `[Contact form] New message from ${name}`,
            text: `From: ${name} <${email}>\n\n${message}`,
        },
    }).catch((err) => {
        throw createError({ statusCode: 502, statusMessage: 'Could not send the message. Please try again later.', cause: err })
    })

    return { ok: true, id: result?.id }
})
