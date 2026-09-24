// Maps a Prismic document to the URL it should resolve to — used by
// Prismic's "Preview" button in the editor to know which page to open.
export default function linkResolver(doc) {
    if (doc.type === 'homepage') return '/'
    if (doc.type === 'post') return `/posts/${doc.uid}`
    if (doc.type === 'gallery_page') return `/posts/${doc.uid}`
    if (doc.type === 'prints_page') return '/prints'
    if (doc.type === 'contact_page') return '/contact'
    if (doc.type === 'page') return `/${doc.uid}`
    return '/'
}
