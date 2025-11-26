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
    }
  ]
})

// router.beforeEach(async (to) => {
//    return true
// })

export default router
