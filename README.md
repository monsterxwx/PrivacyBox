
---

# 📦 PrivacyBox - 隐私优先的极客工具箱

<p align="center">
  <img src="https://img.shields.io/badge/Vue-3.0+-4FC08D?style=flat-square&logo=vue.js" alt="Vue 3" />
  <img src="https://img.shields.io/badge/Vite-Rapid-646CFF?style=flat-square&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/Privacy-100%25-red?style=flat-square" alt="Privacy" />
</p>

> **你的数据，理应只属于你自己。**
> 
> Your data belongs to you, and only you.

**PrivacyBox** 是一个基于现代 Web 技术（Vue 3 + WebAssembly）构建的纯前端工具集合。与传统在线工具不同，本项目的核心理念是 **"Serverless & Local-First"** —— 所有文件处理逻辑（PDF合并、图片压缩、水印等）均在用户的浏览器本地完成，**绝不上传任何文件到服务器**。

安全、免费、极速、美观。

## ✨ 核心亮点 (Key Features)

- 🛡️ **极致隐私**：利用浏览器算力处理文件，断网可用，杜绝隐私泄露风险。
- ⚡ **极速体验**：基于 Vite 构建，无上传下载等待时间，大文件秒级处理。
- 🎨 **现代设计**：采用流光背景 + 磨砂玻璃 (Glassmorphism) 的 UI 设计语言。
- 📦 **纯前端架构**：无需后端数据库，部署简单（支持 GitHub Pages / Vercel）。

## 🛠️ 功能列表 (Tools)

### 📄 PDF 工具箱
- **PDF 合并**：将多个 PDF 文件按顺序合并。
- **PDF 拆分**：将 PDF 的每一页拆分为独立文件（ZIP 打包下载）。
- **图片转 PDF**：将 JPG/PNG 图片合并导出为 A4 格式 PDF。

### 🖼️ 图片影像处理
- **隐私水印卫士**：为证件/照片添加全屏防盗盲水印（支持调节密度、透明度、旋转）。
- **图片智能压缩**：基于 Canvas 算法，肉眼无损级压缩，支持批量打包。
- **格式转换工场**：WebP / PNG / JPEG 格式互转。
- **条形码生成器**：生成矢量条形码（Code128, EAN, UPC），支持 SVG/PNG 导出。

### 💻 开发者工具
- **JSON 格式化**：语法高亮、错误校验、压缩与美化。
- **(Coming Soon)**：正则测试、Diff 对比...

## 📸 预览 (Screenshots)

*(建议你在这里放 2-3 张截图，比如首页、水印工具页、图片压缩页)*

| 首页仪表盘 | 水印工具 | 图片压缩 |
|:---:|:---:|:---:|
| ![Home](https://via.placeholder.com/300x200?text=Home+Preview) | ![Watermark](https://via.placeholder.com/300x200?text=Watermark+Preview) | ![Compress](https://via.placeholder.com/300x200?text=Compress+Preview) |

## 🚀 快速开始 (Getting Started)

### 环境要求
- Node.js >= 16.0

### 本地运行

```bash
# 1. 克隆项目
git clone https://github.com/your-username/privacy-box.git

# 2. 进入目录
cd privacy-box

# 3. 安装依赖
npm install

# 4. 启动开发服务器
npm run dev
```

### 部署
由于是纯静态项目，你可以轻松部署到任何静态托管服务：

```bash
# 构建生产环境代码
npm run build
```
构建产物位于 `dist` 目录。

## ⚙️ 技术栈 (Tech Stack)

- **框架**: [Vue 3](https://vuejs.org/) (Composition API)
- **构建**: [Vite](https://vitejs.dev/)
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **核心库**:
  - `pdf-lib` / `jspdf`: PDF 生成与操作
  - `jsbarcode`: 条形码生成
  - `jszip`: 文件打包下载
  - `file-saver`: 文件保存

## 🤝 贡献指南 (Contributing)

非常欢迎各种形式的贡献！无论是新功能的 Idea、Bug 反馈还是 PR。

1. Fork 本仓库
2. 创建你的 Feature 分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 📝 待办事项 (Roadmap)

- [ ] 🌑 暗黑模式支持
- [ ] 📱 PWA 离线安装支持
- [ ] 🎥 视频转 GIF (FFmpeg.wasm)
- [ ] 🔍 图片 OCR 文字识别

## 📄 开源协议 (License)

本项目基于 [MIT License](LICENSE) 开源。

---

<p align="center">Made with ❤️ by <b>YourName</b></p>

---

