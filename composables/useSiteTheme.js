// Shared light/dark theme for the whole site. Defaults to dark; the visitor's
// choice is remembered in a cookie (persists across pages and visits).
export const useSiteTheme = () => useCookie('theme_light', { default: () => false })
