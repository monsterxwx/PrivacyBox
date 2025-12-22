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
    },
    {
      path: '/temp-mail',
      name: 'temp-mail',
      component: () => import('@/views/TempMail.vue')
    },
    {
      path: '/secret-send',
      name: 'secret-send',
      component: () => import('@/views/SecretSend.vue')
    },
    {
      path: '/file-wormhole',
      name: 'file-wormhole',
      component: () => import('@/views/FileWormhole.vue')
    },
    {
      path: '/identity-safe',
      name: 'identity-safe',
      component: () => import('@/views/IdentitySafe/index.vue')
    },
    {
      path: '/grok-parser',
      name: 'grok-parser',
      component: () => import('@/views/GrokParser.vue'),
      meta: {
        title: 'Grok 链接修复'
      }
    },
    {
      path: '/belly-fatKiller',
      name: 'belly-fatKiller',
      component: () => import('@/views/BellyFatKiller.vue'),
      meta: {
        title: '健身计划'
      }
    },
    {
      path: '/svg-animation',
      name: 'svg-animation',
      component: () => import('@/views/SvgAnimation.vue'),
      meta: {
        title: 'SVG动画生成器'
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta?.title) {
    document.title = to.meta.title as string
  } else {
    // 默认标题
    document.title = 'PrivacyBox 工具箱'
  }
  next()
})

export default router
