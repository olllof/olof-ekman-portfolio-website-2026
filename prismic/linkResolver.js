// Maps a Prismic document to the URL it should resolve to — used by
// Prismic's "Preview" button in the editor to know which page to open.
export default function linkResolver(doc) {
    if (doc.type === 'homepage') return '/'
    if (doc.type === 'post') return `/posts/${doc.uid}`
    // Draft redesign pages — not the live /posts/{uid} route yet.
    if (doc.type === 'gallery_page') return `/posts/${doc.uid}-preview`
    if (doc.type === 'prints_page') return '/prints'
    if (doc.type === 'page') return `/${doc.uid}`
    return '/'
}
