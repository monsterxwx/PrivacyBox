export const categories = [
  { id: 'all', label: '全部' },
  { id: 'tools', label: '实用工具' },
  { id: 'media', label: '多媒体处理' },
  { id: 'image', label: '图片处理' },
  { id: 'dev', label: '开发辅助' },
  { id: 'life', label: '生活娱乐' }
]

export const list = [
  {
    name: 'PDF 工具',
    desc: '合并、拆分、图片转 PDF 文件，支持批量操作。',
    icon: '📑',
    path: '/pdf-tools',
    category: 'tools',
    isNew: false
  },
  {
    name: '图片格式转换',
    desc: 'WebP, PNG, JPEG 互转，自定义压缩质量，支持批量处理。',
    icon: '🖼️',
    path: '/image-convert',
    category: 'image',
    isNew: false
  },
  {
    name: '图片智能压缩',
    desc: '肉眼无损的极致压缩。支持 JPG/PNG，一键瘦身 80%，节省带宽。',
    icon: '📉',
    path: '/image-compress',
    category: 'image',
    isNew: false
  },
  {
    name: 'JSON 格式化',
    desc: '美化 JSON 数据，校验语法，一键转换 TypeScript 接口。',
    icon: '🔧',
    path: '/json-formatter',
    category: 'dev',
    isNew: false
  },
  {
    name: '条形码生成',
    desc: '在线生成 Code128, EAN, UPC 等矢量条形码，支持导出 PNG/SVG。',
    icon: '📏',
    path: '/barcode-generator',
    category: 'tools',
    isNew: false
  },
  {
    name: '隐私水印卫士',
    desc: '身份证/证件照安全加水印，全屏防盗，纯本地处理无上传。',
    icon: '🛡️',
    path: '/watermark',
    category: 'image',
    isNew: false
  },
  {
    name: '文本对比 Diff',
    desc: '快速比对代码或文本差异，支持行级/字符级检测，自动高亮变更。',
    icon: '⚖️',
    path: '/diff',
    category: 'dev',
    isNew: false
  },
  {
    name: '二维码美化',
    desc: '生成个性化二维码，支持自定义颜色、嵌入 Logo 图标，高清导出。',
    icon: '🔳',
    path: '/qrcode',
    category: 'tools',
    isNew: false
  },
  {
    name: '极简屏幕录制',
    desc: '无需安装软件，支持系统声音+麦克风混录，画中画预览，本地导出。',
    icon: '📹',
    path: '/screen-recorder',
    category: 'media',
    isNew: false
  },
  {
    name: 'EXIF 隐私抹除',
    desc: '一键查看并移除照片中的 GPS 位置、设备信息等敏感元数据。',
    icon: '📷',
    path: '/exif',
    category: 'image',
    isNew: false
  },
  {
    name: '文件加密保险箱',
    desc: '银行级 AES 加密。在本地给文件上锁，密码不泄露，神仙也打不开。',
    icon: '🔐',
    path: '/encrypt',
    category: 'tools',
    isNew: false
  },
  {
    name: '长图拼接手',
    desc: '将多张图片无缝拼接成一张长图。支持聊天记录、电影台词拼接。',
    icon: '🎞️',
    path: '/stitch',
    category: 'image',
    isNew: false
  },
  {
    name: '视频转 GIF',
    desc: '硬核 FFmpeg 驱动。在线剪辑视频，调整帧率尺寸，生成高质量 GIF。',
    icon: '🎞️',
    path: '/video-gif',
    category: 'media',
    isNew: false
  },
  {
    name: '强密码生成器',
    desc: '本地生成高强度随机密码，支持易读模式与强度检测，绝不联网。',
    icon: '🔑',
    path: '/password-generator',
    category: 'dev',
    isNew: false
  },
  {
    name: 'Base64 全能转换',
    desc: '文本防乱码编码，图片转 CSS/HTML 代码，开发者的万能翻译机。',
    icon: '🔡',
    path: '/base64',
    category: 'dev',
    isNew: false
  },
  {
    name: 'Favicon 图标生成',
    desc: '一键生成网站全套图标 (favicon.ico, PWA)，支持预览与打包下载。',
    icon: '✨',
    path: '/favicon-generator',
    category: 'image',
    isNew: false
  },
  {
    name: 'Cron 表达式编辑器',
    desc: '可视化生成定时任务规则，支持实时中文语义翻译，不再死记硬背。',
    icon: '⏱️',
    path: '/cron',
    category: 'dev',
    isNew: false
  },
  {
    name: '图片取色板',
    desc: '上传照片，AI 自动提取 8 种灵感配色。一键复制 Hex/RGB，为你的设计注入灵魂。',
    icon: '🎨',
    path: '/image-palette',
    category: 'image',
    isNew: false
  },
  {
    name: '音频提取转换',
    desc: '视频转音频，或格式互转 (MP3/AAC/WAV)。支持比特率调节，纯本地处理。',
    icon: '🎵',
    path: '/audio-converter',
    category: 'media',
    isNew: false
  },
  {
    name: 'Excel/CSV 转换',
    desc: 'Excel/CSV 互转 JSON, XML, SQL。纯前端解析，安全处理敏感报表。',
    icon: '📊',
    path: '/data-converter',
    category: 'dev',
    isNew: false
  },
  {
    name: 'SVG 瘦身净化',
    desc: '移除冗余元数据与注释，压缩代码体积。让图标更轻、更规范。',
    icon: '🌪️',
    path: '/svg-optimizer',
    category: 'tools',
    isNew: false
  },
  {
    name: '本地 OCR 识别',
    desc: '浏览器本地提取图片文字，支持中/英/日文。隐私安全，文档绝不上传。',
    icon: '👁️',
    path: '/offline-ocr',
    category: 'image', // 或 'dev' / 'office'
    isNew: false
  },
  {
    name: '隐私涂抹卫士',
    desc: '截图安全打码工具。支持高斯模糊/马赛克/纯色，内置 OCR 自动识别并抹除文字。',
    icon: '🙈',
    path: '/image-redactor',
    category: 'image',
    isNew: false
  },
  {
    name: '批量文件重命名',
    desc: '拒绝重复劳动。支持序列编号、正则替换、添加时间戳，一键打包下载。',
    icon: '🏷️',
    path: '/batch-rename',
    category: 'tools', // 归类为实用工具
    isNew: false
  },
  {
    name: '在线提词器',
    desc: '主播必备。全屏滚动播放脚本，支持镜像翻转、语速调节，完全离线。',
    icon: '🎤',
    path: '/teleprompter',
    category: 'media',
    isNew: false
  },
  {
    name: '音频波形剪辑',
    desc: '可视化裁剪音频，支持淡入淡出。MP3/WAV 无损导出，本地极速处理。',
    icon: '🎵',
    path: '/audio-trimmer',
    category: 'media',
    isNew: false
  },
  {
    name: '专注白噪音台',
    desc: 'Web Audio 实时合成白/粉/布朗噪音，配合番茄钟。无音频文件，离线可用。',
    icon: '🌊',
    path: '/focus-station',
    category: 'life',
    isNew: false
  },
  {
    name: '文本多功能清洗机',
    desc: '文本去重、空行清理、格式化、邮箱/URL提取、自定义分割。',
    icon: '🧹',
    path: '/text-chef',
    category: 'dev', // 属于开发/办公分类
    isNew: false
  },
  {
    name: '智能证件照裁剪',
    desc: '标准一寸/二寸/签证照模板，300DPI 打印级输出，支持自动白底。',
    icon: '📸',
    path: '/id-photo-cropper',
    category: 'life', // 属于生活娱乐分类
    isNew: false
  },
  {
    name: 'LED 滚动弹幕',
    desc: '打Call/接机/摆摊神器。支持自定义颜色、速度、闪烁特效及 LED 仿真纹理。',
    icon: '📟',
    path: '/led-scroller',
    category: 'life',
    isNew: false
  },
  {
    name: '临时邮箱',
    desc: '一键生成匿名邮箱，实时接收邮件和附件，关闭页面数据彻底消失，隐私100%。',
    icon: '📧',
    path: '/temp-mail',
    category: 'tools',
    isNew: true
  },
  {
    name: '私密瞬传',
    desc: '端到端加密文件分享，一次下载自动销毁，跨设备安全传输。',
    icon: '🔒',
    path: '/secret-send',
    category: 'tools',
    isNew: true
  },
  {
    name: 'P2P 极速传送门',
    desc: '不限速、不限大小。设备间直接建立加密通道传输文件，无服务器中转。',
    icon: '⚡',
    path: '/file-wormhole',
    category: 'tools',
    isNew: true
  },
  {
    name: '虚拟身份 & 2FA',
    desc: '一键生成全套虚拟身份信息（身份证/银行卡/地址），内置本地 2FA 验证器，保护注册隐私。',
    icon: '🎭',
    path: '/identity-safe',
    category: 'tools',
    isNew: true
  }
]
