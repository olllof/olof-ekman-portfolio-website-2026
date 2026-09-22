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
    currentZoom.value = Math.max(1, Math.min(5, currentZoom.value * delta))

    // Reset offset when fully zoomed out
    if (currentZoom.value <= 1) {
        offsetX.value = 0
        offsetY.value = 0
    }
}

const handlePointerDown = (e) => {
    if (currentZoom.value > 1) {
        isDragging.value = true
        dragStartX.value = e.clientX
        dragStartY.value = e.clientY
    }
}

const handlePointerMove = (e) => {
    if (!isDragging.value || currentZoom.value <= 1) return

    const deltaX = e.clientX - dragStartX.value
    const deltaY = e.clientY - dragStartY.value

    offsetX.value = Math.max(-300, Math.min(300, offsetX.value + deltaX))
    offsetY.value = Math.max(-300, Math.min(300, offsetY.value + deltaY))

    dragStartX.value = e.clientX
    dragStartY.value = e.clientY
}

const handlePointerUp = () => {
    isDragging.value = false
}

const handleDoubleClick = () => {
    if (currentZoom.value > 1) {
        resetZoom()
    } else {
        currentZoom.value = 2.5
    }
}

const handleTouchStart = (e) => {
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
        currentZoom.value = Math.max(1, Math.min(5, currentZoom.value * ratio))
        lastTouchDistance.value = currentDistance

        // Reset offset when fully zoomed out
        if (currentZoom.value <= 1) {
            offsetX.value = 0
            offsetY.value = 0
        }
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
                    .image-wrapper(
                        @wheel='handleWheel'
                        @pointerdown='handlePointerDown'
                        @pointermove='handlePointerMove'
                        @dblclick='handleDoubleClick'
                        @touchstart='handleTouchStart'
                        @touchmove='handleTouchMove'
                        @touchend='handleTouchEnd'
                    ).w-full.h-full.flex.items-center.justify-center.overflow-hidden(
                        :class='{ "cursor-grab": currentZoom > 1, "cursor-zoom-in": currentZoom === 1, "cursor-grabbing": isDragging }'
                    )
                        img(
                            :src='img.url.split("?")[0] + "?auto=format,compress&fit=max&h=4000"'
                            :alt='img.alt || ""'
                            loading='lazy'
                            @load='onImageLoad(i)'
                            :style='{ transform: `scale(${currentZoom}) translate(${offsetX}px, ${offsetY}px)`, transition: isDragging ? "none" : "transform 0.15s ease-out" }'
                        ).max-h-full.max-w-full.object-contain.user-select-none.select-none.pointer-events-none
</template>

<style lang="sass">
.post-gallery
    position: fixed
    inset: 0
    z-index: 60
    background: rgba(0, 0, 0, 0.95)
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

    .image-wrapper
        touch-action: none
        user-select: none
        -webkit-user-select: none

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

    img
        user-select: none

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
