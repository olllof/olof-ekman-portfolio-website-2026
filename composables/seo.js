// Turn a Prismic rich-text field into a plain-text meta description.
export const richTextToPlain = (field, max = 160) => {
    if (!Array.isArray(field)) return ''
    const text = field
        .filter((b) => b && b.text)
        .map((b) => b.text)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim()
    if (text.length <= max) return text
    return text.slice(0, max - 1).replace(/\s+\S*$/, '').trim() + '…'
}
