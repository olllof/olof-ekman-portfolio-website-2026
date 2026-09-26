<script setup>
import { Navigation } from 'swiper/modules'

const props = defineProps({
    images: { type: Array, default: () => [] },
    modelValue: { type: Boolean, default: false },
    initialSlide: { type: Number, default: 0 },
})

const emit = defineEmits(['update:modelValue'])

const swiperRef = ref(null)
const loadedSlides = ref(new Set())
const currentZoom = ref(1)
const offsetX = ref(0)
const offsetY = ref(0)
const isDragging = ref(false)
const dragStartX = ref(0)
const dragStartY = ref(0)
const lastTouchDistance = ref(0)
const isTouchZooming = ref(false)
const lastTapTime = ref(0)
const lastTapX = ref(0)
const lastTapY = ref(0)

const onSwiper = (swiper) => {
    swiperRef.value = swiper
}

watch(() => props.modelValue, (open) => {
    if (open && swiperRef.value) {
        nextTick(() => swiperRef.value.slideTo(props.initialSlide, 0))
        resetZoom()
    }
    if (open) {
        document.body.style.overflow = 'hidden'
    } else {
        document.body.style.overflow = ''
        isDragging.value = false
        // The Swiper instance is destroyed when the lightbox unmounts (v-if
        // above), so this ref would otherwise still point at a dead
        // instance next time a stray pointerup fires the window listener.
        swiperRef.value = null
    }
})

watch(() => props.initialSlide, (idx) => {
    if (props.modelValue && swiperRef.value) {
        swiperRef.value.slideTo(idx, 0)
        resetZoom()
    }
})

const resetZoom = () => {
    currentZoom.value = 1
    offsetX.value = 0
    offsetY.value = 0
}

// The active slide's rendered (pre-transform) size, used to work out how
// far the image can be panned at the current zoom level. `offsetWidth` /
// `offsetHeight` reflect the element's layout box, which CSS `transform`
// never changes, so this stays accurate while zoomed and while panning.
const getActiveImg = () => document.querySelector('.post-gallery .swiper-slide-active img')

const clampOffsets = () => {
    const img = getActiveImg()
    if (!img) return
    const boundX = Math.max(0, (img.offsetWidth * (currentZoom.value - 1)) / 2)
    const boundY = Math.max(0, (img.offsetHeight * (currentZoom.value - 1)) / 2)
    offsetX.value = Math.max(-boundX, Math.min(boundX, offsetX.value))
    offsetY.value = Math.max(-boundY, Math.min(boundY, offsetY.value))
}

// Used by the zoom slider and its +/- buttons.
const setZoom = (v) => {
    currentZoom.value = Math.max(1, Math.min(8, v))
    clampOffsets()
}
const zoomModel = computed({
    get: () => currentZoom.value,
    set: (v) => setZoom(v),
})
// Where the slider thumb sits along the track, as a percentage — drives the
// black/grey fill split either side of it (see the `--fill` CSS variable).
const zoomFillPercent = computed(() => ((currentZoom.value - 1) / 7) * 100)

const onImageLoad = (i) => {
    loadedSlides.value = new Set([...loadedSlides.value, i])
}

const close = () => emit('update:modelValue', false)

const onKeydown = (e) => {
    if (e.key === 'Escape') close()
}

const handleWheel = (e) => {
    if (!props.modelValue) return
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    currentZoom.value = Math.max(1, Math.min(8, currentZoom.value * delta))
    clampOffsets()
}

const handlePointerDown = (e) => {
    if (currentZoom.value > 1) {
        isDragging.value = true
        dragStartX.value = e.clientX
        dragStartY.value = e.clientY
        // Otherwise Swiper's own swipe detection also sees this same drag
        // and can advance to the next/previous slide while panning a
        // zoomed-in image.
        if (swiperRef.value) swiperRef.value.disable()
    }
}

const handlePointerMove = (e) => {
    if (!isDragging.value || currentZoom.value <= 1) return

    // offsetX/Y are applied to the image in screen pixels (the translate
    // happens after the scale — see the template), so a pointer delta of
    // d screen pixels should always move the image by d pixels on screen,
    // regardless of zoom level.
    offsetX.value += e.clientX - dragStartX.value
    offsetY.value += e.clientY - dragStartY.value
    clampOffsets()

    dragStartX.value = e.clientX
    dragStartY.value = e.clientY
}

const handlePointerUp = () => {
    isDragging.value = false
    if (swiperRef.value) swiperRef.value.enable()
}

const handleDoubleClick = () => {
    if (currentZoom.value > 1) {
        resetZoom()
    } else {
        currentZoom.value = 3.5
    }
}

const handleTouchStart = (e) => {
    // Manual double-tap detection: mobile browsers don't reliably
    // synthesize a `dblclick` DOM event from two taps, especially with
    // touch-action: none and Swiper's own touch handling on the same
    // element, so the desktop @dblclick handler alone doesn't fire here.
    if (e.touches.length === 1) {
        const touch = e.touches[0]
        const now = Date.now()
        const dx = Math.abs(touch.clientX - lastTapX.value)
        const dy = Math.abs(touch.clientY - lastTapY.value)
        if (now - lastTapTime.value < 300 && dx < 30 && dy < 30) {
            handleDoubleClick()
            lastTapTime.value = 0
        } else {
            lastTapTime.value = now
            lastTapX.value = touch.clientX
            lastTapY.value = touch.clientY
        }
    }
    if (e.touches.length === 2) {
        isTouchZooming.value = true
        if (swiperRef.value) {
            swiperRef.value.disable()
        }
        const touch1 = e.touches[0]
        const touch2 = e.touches[1]
        lastTouchDistance.value = Math.hypot(
            touch2.clientX - touch1.clientX,
            touch2.clientY - touch1.clientY
        )
    }
}

const handleTouchMove = (e) => {
    if (e.touches.length === 2 && lastTouchDistance.value > 0) {
        e.preventDefault()
        const touch1 = e.touches[0]
        const touch2 = e.touches[1]
        const currentDistance = Math.hypot(
            touch2.clientX - touch1.clientX,
            touch2.clientY - touch1.clientY
        )
        const ratio = currentDistance / lastTouchDistance.value
        currentZoom.value = Math.max(1, Math.min(8, currentZoom.value * ratio))
        lastTouchDistance.value = currentDistance
        clampOffsets()
    }
}

const handleTouchEnd = () => {
    lastTouchDistance.value = 0
    isTouchZooming.value = false
    if (swiperRef.value) {
        swiperRef.value.enable()
    }
}

onMounted(() => {
    window.addEventListener('keydown', onKeydown)
    window.addEventListener('pointerup', handlePointerUp)
})

onUnmounted(() => {
    window.removeEventListener('keydown', onKeydown)
    window.removeEventListener('pointerup', handlePointerUp)
    document.body.style.overflow = ''
})
</script>

<template lang="pug">
Teleport(to='body')
    Transition(name='gallery-fade')
        .post-gallery(v-if='modelValue' @click.self='close')
            button.close-btn(@click='close')
                svg(xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round')
                    line(x1='18' y1='6' x2='6' y2='18')
                    line(x1='6' y1='6' x2='18' y2='18')
            Swiper(
                :modules='[Navigation]'
                :navigation='true'
                :loop='images.length > 1'
                :slides-per-view='1'
                :initial-slide='initialSlide'
                @swiper='onSwiper'
            ).h-full
                SwiperSlide(v-for='(img, i) in images' :key='i').flex.items-center.justify-center.overflow-hidden
                    .spinner(v-if='!loadedSlides.has(i)')
                    .polaroid-frame
                        .image-wrapper(
                            @wheel='handleWheel'
                            @pointerdown='handlePointerDown'
                            @pointermove='handlePointerMove'
                            @dblclick='handleDoubleClick'
                            @touchstart='handleTouchStart'
                            @touchmove='handleTouchMove'
                            @touchend='handleTouchEnd'
                            :class='{ "cursor-grab": currentZoom > 1, "cursor-zoom-in": currentZoom === 1, "cursor-grabbing": isDragging }'
                        )
                            img(
                                :src='img.url.split("?")[0] + "?auto=format,compress&fit=max&h=4000"'
                                :alt='img.alt || ""'
                                loading='lazy'
                                @load='onImageLoad(i)'
                                :style='{ transform: `translate(${offsetX}px, ${offsetY}px) scale(${currentZoom})`, transition: isDragging ? "none" : "transform 0.15s ease-out" }'
                            ).user-select-none.select-none.pointer-events-none

                        .zoom-bar.mono
                            button.zoom-btn(@click='setZoom(currentZoom - 1)' aria-label='Zoom out')
                                svg(xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round')
                                    circle(cx='11' cy='11' r='7')
                                    line(x1='21' y1='21' x2='16.65' y2='16.65')
                                    line(x1='8' y1='11' x2='14' y2='11')
                            input.zoom-slider(
                                type='range' min='1' max='8' step='0.1'
                                v-model.number='zoomModel'
                                :style='{ "--fill": zoomFillPercent + "%" }'
                            )
                            button.zoom-btn(@click='setZoom(currentZoom + 1)' aria-label='Zoom in')
                                svg(xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round')
                                    circle(cx='11' cy='11' r='7')
                                    line(x1='21' y1='21' x2='16.65' y2='16.65')
                                    line(x1='11' y1='8' x2='11' y2='14')
                                    line(x1='8' y1='11' x2='14' y2='11')
</template>

<style lang="sass">
.post-gallery
    position: fixed
    inset: 0
    z-index: 60
    background: #000
    display: flex
    align-items: center
    justify-content: center

    .close-btn
        position: absolute
        top: 0.6rem
        right: 0.6rem
        z-index: 70
        color: white
        background: none
        border: none
        cursor: pointer
        padding: 0
        opacity: 0.7
        transition: opacity 0.2s
        &:hover
            opacity: 1

    .swiper
        width: 100%
        height: 100%

    .swiper-slide
        display: flex !important
        align-items: center !important
        justify-content: center !important
        padding: 2rem
        overflow: hidden

    .swiper-button-prev,
    .swiper-button-next
        color: white !important
        opacity: 0.7
        &:hover
            opacity: 1
        &::after
            font-size: 1.25rem
            @media (max-width: 768px)
                font-size: 1rem

    .spinner
        width: 24px
        height: 24px
        border: 2px solid rgba(255, 255, 255, 0.2)
        border-top-color: white
        border-radius: 50%
        animation: spin 0.6s linear infinite
        position: absolute

    // The white "photo card" that frames each image, like a physical print
    // with a wide bottom border for the zoom controls. Shrink-wraps to the
    // image's own rendered size (see the `img` max-height/width below)
    // rather than forcing every photo into the same fixed box, so a tall
    // portrait and a wide landscape each get a naturally-proportioned card.
    .polaroid-frame
        display: inline-flex
        flex-direction: column
        max-width: min(90vw, 640px)
        background: #fff
        padding: 1.5rem 1.5rem 0.75rem
        box-shadow: 0 1.5rem 4rem rgba(0, 0, 0, 0.5)
        border-radius: 2px

    .image-wrapper
        touch-action: none
        user-select: none
        -webkit-user-select: none
        display: flex
        overflow: hidden
        background: #15171d

        img
            display: block
            width: auto
            height: auto
            max-width: 100%
            // 84vh minus the frame's top/bottom padding and the zoom bar's
            // own height, so the whole card still fits the viewport.
            max-height: calc(84vh - 5.25rem)
            user-select: none

    .zoom-bar
        flex-shrink: 0
        display: flex
        align-items: center
        gap: 0.75rem
        padding: 0.85rem 0.25rem 0.15rem
        color: #0e0b0a

    .zoom-btn
        display: flex
        color: inherit
        background: none
        border: none
        padding: 0
        cursor: pointer
        opacity: 0.75
        transition: opacity 0.2s
        &:hover
            opacity: 1

    .zoom-slider
        flex: 1
        -webkit-appearance: none
        appearance: none
        height: 2px
        background: linear-gradient(to right, #0e0b0a var(--fill), #d8d6d2 var(--fill))
        cursor: pointer
        &::-webkit-slider-thumb
            -webkit-appearance: none
            width: 13px
            height: 13px
            border-radius: 50%
            background: #e0392b
            cursor: pointer
        &::-moz-range-track
            height: 2px
            background: #d8d6d2
        &::-moz-range-progress
            height: 2px
            background: #0e0b0a
        &::-moz-range-thumb
            width: 13px
            height: 13px
            border: none
            border-radius: 50%
            background: #e0392b
            cursor: pointer

@keyframes spin
    to
        transform: rotate(360deg)

.gallery-fade-enter-active,
.gallery-fade-leave-active
    transition: opacity 0.25s ease

.gallery-fade-enter-from,
.gallery-fade-leave-to
    opacity: 0
</style>
