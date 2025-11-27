import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/home.vue')
    },
    {
      path: '/image-convert',
      name: 'image-convert',
      component: () => import('@/views/ImageConvert.vue')
    },
    {
      path: '/image-compress',
      name: 'image-compress',
      component: () => import('@/views/ImageCompress.vue')
    },
    {
      path: '/json-formatter',
      name: 'json-formatter',
      component: () => import('@/views/JsonFormatter.vue')
    },
    {
      path: '/pdf-tools',
      name: 'pdf-tools',
      component: () => import('@/views/PdfTools.vue')
    },
    {
      path: '/barcode-generator',
      name: 'barcode-generator',
      component: () => import('@/views/BarcodeGenerator.vue')
    },
    {
      path: '/watermark',
      name: 'watermark',
      component: () => import('@/views/Watermark.vue')
    },
    {
      path: '/diff',
      name: 'diff',
      component: () => import('@/views/DiffChecker.vue')
    },
    {
      path: '/qrcode',
      name: 'qrcode',
      component: () => import('@/views/QrGenerator.vue')
    },
    {
      path: '/screen-recorder',
      name: 'screen-recorder',
      component: () => import('@/views/ScreenRecorder.vue')
    },
    {
      path: '/exif',
      name: 'exif',
      component: () => import('@/views/ExifCleaner.vue')
    },
    {
      path: '/encrypt',
      name: 'encrypt',
      component: () => import('@/views/FileEncrypt.vue')
    },
    {
      path: '/stitch',
      name: 'stitch',
      component: () => import('@/views/ImageStitcher.vue')
    },
    {
      path: '/video-gif',
      name: 'video-gif',
      component: () => import('@/views/VideoToGif.vue')
    },
    {
      path: '/password-generator',
      name: 'password-generator',
      component: () => import('@/views/PasswordGenerator.vue')
    },
    {
      path: '/base64',
      name: 'base64',
      component: () => import('@/views/Base64Studio.vue')
    },
    {
      path: '/favicon-generator',
      name: 'favicon-generator',
      component: () => import('@/views/FaviconGenerator.vue')
    },
    {
      path: '/cron',
      name: 'cron',
      component: () => import('@/views/CronEditor.vue')
    },
    {
      path: '/image-palette',
      name: 'image-palette',
      component: () => import('@/views/ImagePalette.vue')
    },
    {
      path: '/audio-converter',
      name: 'audio-converter',
      component: () => import('@/views/AudioConverter.vue')
    },
    {
      path: '/data-converter',
      name: 'data-converter',
      component: () => import('@/views/DataConverter.vue')
    },
    {
      path: '/svg-optimizer',
      name: 'svg-optimizer',
      component: () => import('@/views/SvgOptimizer.vue')
    },
    {
      path: '/offline-ocr',
      name: 'offline-ocr',
      component: () => import('@/views/OfflineOcr.vue')
    },
    {
      path: '/image-redactor',
      name: 'image-redactor',
      component: () => import('@/views/ImageRedactor.vue')
    },
    {
      path: '/batch-rename',
      name: 'batch-rename',
      component: () => import('@/views/BatchRenamer.vue')
    },
    {
      path: '/teleprompter',
      name: 'teleprompter',
      component: () => import('@/views/Teleprompter.vue')
    },
    {
      path: '/audio-trimmer',
      name: 'audio-trimmer',
      component: () => import('@/views/AudioTrimmer.vue')
    },
    {
      path: '/focus-station',
      name: 'focus-station',
      component: () => import('@/views/FocusStation.vue')
    },
    {
      path: '/text-chef',
      name: 'text-chef',
      component: () => import('@/views/TextChef.vue')
    },
    {
      path: '/id-photo-cropper',
      name: 'id-photo-cropper',
      component: () => import('@/views/IdPhotoCropper.vue')
    },
    {
      path: '/led-scroller',
      name: 'led-scroller',
      component: () => import('@/views/LedScroller.vue')
    }
  ]
})

export default router
