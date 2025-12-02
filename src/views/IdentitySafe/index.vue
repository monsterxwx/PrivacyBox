<template>
  <div class="min-h-screen bg-slate-50 relative overflow-hidden font-sans selection:bg-indigo-100">
    <!-- ================= 背景特效 ================= -->
    <div class="absolute inset-0 z-0 opacity-[0.4]" style="background-image: radial-gradient(#cbd5e1 1px, transparent 1px); background-size: 32px 32px;" />
    <div class="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-indigo-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob" />
    <div class="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000" />

    <!-- ================= 内容区域 ================= -->
    <div class="relative z-10 max-w-6xl mx-auto px-6 py-12">
      <!-- 头部 -->
      <div class="flex flex-col items-center mb-10 text-center">
        <RouterLink to="/" class="text-sm font-medium text-slate-500 hover:text-indigo-600 mb-4 inline-flex items-center gap-1 transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          ><path d="m15 18-6-6 6-6" /></svg>
          返回首页
        </RouterLink>
        <h1 class="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-600">虚拟身份 & 2FA 保险箱</span>
        </h1>
        <p class="text-slate-600 max-w-2xl">
          隐私注册必备工具。生成符合校验规则的虚拟身份信息，并提供纯本地的 2FA 动态验证码管理，摆脱对手机 App 的依赖。
        </p>
      </div>

      <!-- 顶部切换 Tabs -->
      <div class="flex justify-center mb-8">
        <div class="bg-white/80 backdrop-blur rounded-xl p-1 border border-slate-200 shadow-sm flex gap-1">
          <button
            @click="activeTab = 'identity'"
            class="px-6 py-2 rounded-lg text-sm font-bold transition-all"
            :class="activeTab === 'identity' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'"
          >
            👤 虚拟身份生成
          </button>
          <button
            @click="activeTab = '2fa'"
            class="px-6 py-2 rounded-lg text-sm font-bold transition-all"
            :class="activeTab === '2fa' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'"
          >
            🔐 2FA 令牌管理
          </button>
        </div>
      </div>

      <!-- ================= 模块一：虚拟身份生成 ================= -->
      <div v-if="activeTab === 'identity'" class="max-w-4xl mx-auto">
        <div class="grid md:grid-cols-12 gap-6">
          <!-- 左侧：控制面板 -->
          <div class="md:col-span-4 space-y-4">
            <div class="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6">
              <h3 class="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span class="w-1 h-5 bg-indigo-500 rounded-full" />
                生成设置
              </h3>

              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-bold text-slate-500 uppercase mb-1">地区 / 语言</label>
                  <select v-model="region" class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500">
                    <option value="CN">
                      🇨🇳 中国 (简体中文)
                    </option>
                    <option value="US">
                      🇺🇸 美国 (English)
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-500 uppercase mb-1">性别</label>
                  <div class="flex bg-slate-50 rounded-lg p-1 border border-slate-200">
                    <button @click="gender = 'male'" class="flex-1 py-1.5 rounded text-xs font-medium transition-all" :class="gender === 'male' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'">
                      男
                    </button>
                    <button @click="gender = 'female'" class="flex-1 py-1.5 rounded text-xs font-medium transition-all" :class="gender === 'female' ? 'bg-white shadow text-pink-500' : 'text-slate-500'">
                      女
                    </button>
                  </div>
                </div>

                <button
                  @click="generateIdentity"
                  class="w-full py-3 bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 16h5v5" /></svg>
                  重新生成
                </button>
              </div>
            </div>

            <!-- 友情提示 -->
            <div class="bg-amber-50 rounded-2xl p-4 border border-amber-100 text-xs text-amber-700 leading-relaxed">
              <strong>⚠️ 免责声明：</strong>
              <br>本工具生成的数据（如身份证、银行卡号）仅符合算法校验规则（Luhn算法等），<span class="font-bold underline">并非真实有效数据</span>。仅供软件测试、隐私保护注册使用，严禁用于非法用途。
            </div>
          </div>

          <!-- 右侧：展示卡片 -->
          <div class="md:col-span-8 space-y-4">
            <!-- 个人信息卡片 -->
            <div class="bg-white/90 backdrop-blur rounded-2xl shadow-lg border border-white/50 overflow-hidden relative group">
              <div class="h-24 bg-gradient-to-r from-indigo-500 to-purple-600" />
              <div class="px-6 pb-6 pt-0 relative">
                <div class="w-20 h-20 bg-white rounded-full border-4 border-white shadow-md absolute -top-10 left-6 flex items-center justify-center text-4xl overflow-hidden">
                  {{ gender === 'male' ? '👨🏻' : '👩🏻' }}
                </div>

                <div class="ml-24 pt-2 flex justify-between items-start">
                  <div>
                    <h2 class="text-2xl font-bold text-slate-800">
                      {{ identity.name }}
                    </h2>
                    <p class="text-sm text-slate-500">
                      {{ identity.birthday }} · {{ identity.age }}岁 · {{ identity.constellation }}
                    </p>
                  </div>
                  <button @click="copyAll" class="text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-500 px-3 py-1.5 rounded-lg transition-colors border border-slate-200">
                    复制全部
                  </button>
                </div>

                <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                  <InfoItem label="身份证号 (虚拟)" :value="identity.idCard" />
                  <InfoItem label="手机号码 (虚拟)" :value="identity.phone" />
                  <InfoItem label="电子邮箱 (推荐)" :value="identity.email" />
                  <InfoItem label="用户名" :value="identity.username" />
                  <InfoItem label="强密码" :value="identity.password" />
                  <InfoItem label="信用卡 (Luhn校验)" :value="identity.creditCard" />
                </div>

                <div class="mt-6 pt-4 border-t border-slate-100">
                  <div class="text-xs font-bold text-slate-400 uppercase mb-1">
                    完整地址
                  </div>
                  <div class="text-slate-700 font-medium break-words">
                    {{ identity.address }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 外部短信资源导航 -->
            <div class="bg-indigo-50/50 rounded-2xl p-5 border border-indigo-100">
              <h4 class="font-bold text-indigo-900 text-sm mb-3 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                ><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                需要真实短信验证码？
              </h4>
              <p class="text-xs text-indigo-700/80 mb-3 leading-relaxed">
                由于电信风控原因，纯前端无法提供稳定的免费接码服务。如果您需要注册 Telegram/TikTok，建议尝试以下精选站点（请勿用于重要账号）：
              </p>
              <div class="flex flex-wrap gap-2">
                <a href="https://sms-activate.org/" target="_blank" class="px-3 py-1.5 bg-white text-xs font-medium text-indigo-600 rounded-lg shadow-sm border border-indigo-100 hover:bg-indigo-500 hover:text-white transition-colors">SMS-Activate (推荐/付费)</a>
                <a href="https://receive-sms-free.cc/" target="_blank" class="px-3 py-1.5 bg-white text-xs font-medium text-slate-600 rounded-lg shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors">Receive-SMS-Free (免费/公用)</a>
                <a href="https://quackr.io/" target="_blank" class="px-3 py-1.5 bg-white text-xs font-medium text-slate-600 rounded-lg shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors">Quackr (免费)</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ================= 模块二：2FA 令牌管理 ================= -->
      <div v-else class="max-w-2xl mx-auto">
        <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden min-h-[500px] flex flex-col">
          <!-- 头部操作栏 -->
          <div class="p-5 border-b border-slate-100 flex justify-between items-center bg-white/50">
            <h3 class="font-bold text-slate-700">
              我的令牌 ({{ tokens.length }})
            </h3>
            <button
              @click="showAddModal = true"
              class="px-4 py-2 bg-indigo-500 text-white text-sm font-bold rounded-lg shadow-md hover:bg-indigo-600 transition-all flex items-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              ><line
                x1="12"
                y1="5"
                x2="12"
                y2="19"
              /><line
                x1="5"
                y1="12"
                x2="19"
                y2="12"
              /></svg>
              添加账号
            </button>
          </div>

          <!-- 列表区域 -->
          <div class="flex-1 overflow-y-auto p-4 space-y-3 relative">
            <div v-if="tokens.length === 0" class="absolute inset-0 flex flex-col items-center justify-center text-slate-400 opacity-60">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1"
              ><rect
                x="3"
                y="11"
                width="18"
                height="11"
                rx="2"
                ry="2"
              /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              <p class="mt-4 text-sm">
                暂无令牌，点击右上角添加
              </p>
            </div>

            <div
              v-for="(token, index) in tokens"
              :key="index"
              class="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex justify-between items-center group hover:border-indigo-200 transition-all"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-slate-100 text-slate-500 font-bold flex items-center justify-center text-lg uppercase select-none">
                  {{ token.issuer ? token.issuer[0] : '?' }}
                </div>
                <div>
                  <div class="text-xs text-slate-400 font-medium">
                    {{ token.issuer || 'Unknown' }}
                  </div>
                  <div class="text-sm font-bold text-slate-800">
                    {{ token.account }}
                  </div>
                </div>
              </div>

              <div class="flex flex-col items-end">
                <div
                  class="text-2xl font-mono font-black tracking-widest text-indigo-600 cursor-pointer hover:scale-105 transition-transform"
                  @click="copyCode(generateTokenCode(token.secret))"
                >
                  {{ formatCode(generateTokenCode(token.secret)) }}
                </div>
                <div class="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                  <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  {{ timeLeft }}s 刷新
                </div>
              </div>

              <!-- 删除按钮 (Hover显示) -->
              <button
                @click="removeToken(index)"
                class="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all p-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                ><line
                  x1="18"
                  y1="6"
                  x2="6"
                  y2="18"
                /><line
                  x1="6"
                  y1="6"
                  x2="18"
                  y2="18"
                /></svg>
              </button>
            </div>
          </div>

          <div class="p-3 bg-slate-50 border-t border-slate-200 text-xs text-center text-slate-400">
            数据仅保存在浏览器本地 localStorage，清除缓存会丢失数据。
          </div>
        </div>
      </div>

      <!-- 添加 2FA 弹窗 -->
      <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 key-animae">
          <h3 class="text-lg font-bold text-slate-800 mb-4">
            添加新的 2FA 密钥
          </h3>
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-500 mb-1">服务商 (Issuer)</label>
              <input
                v-model="newToken.issuer"
                type="text"
                placeholder="例如: Google, GitHub"
                class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-indigo-500 outline-none"
              >
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 mb-1">账号 (Account)</label>
              <input
                v-model="newToken.account"
                type="text"
                placeholder="例如: user@example.com"
                class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-indigo-500 outline-none"
              >
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 mb-1">密钥 (Secret Key)</label>
              <input
                v-model="newToken.secret"
                type="text"
                placeholder="Base32 格式密钥"
                class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-indigo-500 outline-none font-mono uppercase"
              >
            </div>
          </div>
          <div class="flex gap-2 mt-6">
            <button @click="showAddModal = false" class="flex-1 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-lg">
              取消
            </button>
            <button @click="addToken" class="flex-1 py-2 text-sm font-bold bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 shadow-lg shadow-indigo-500/30">
              确认添加
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import * as OTPAuth from 'otpauth'
import InfoItem from './InfoItem.vue'

// === Tab 切换 ===
const activeTab = ref('identity') // 'identity' | '2fa'

// ================= 模块一：虚拟身份逻辑 =================
const region = ref('CN')
const gender = ref('male')
const identity = reactive({
  name: '',
  age: 0,
  birthday: '',
  constellation: '',
  idCard: '',
  phone: '',
  email: '',
  address: '',
  username: '',
  password: '',
  creditCard: ''
})

// 简单工具库 (模拟 Mock.js 功能，为了减少依赖手写)
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const randomPick = (arr) => arr[randomInt(0, arr.length - 1)]

const surnamesCN = '李王张刘陈杨黄赵周吴徐孙胡朱高林何郭马罗梁宋郑谢韩唐冯于董萧程曹袁邓许傅沈曾彭吕苏卢蒋蔡贾丁魏薛叶阎余潘杜戴夏钟汪田任姜范方石姚谭廖邹熊金陆'
const namesMaleCN = '伟刚勇毅俊峰强军平保东文辉力明永健世广志义兴良海山仁波宁贵福生龙元全国胜学祥才发武新利清飞彬富顺信子杰涛昌成康星光天达安岩中茂进林有坚和彪博诚先敬震振壮会思群豪心邦承乐绍功松善厚庆磊民友裕河哲江超浩亮政谦亨奇固之轮翰朗伯宏言若鸣朋斌梁栋维启克伦翔旭鹏泽晨辰士以建家致树炎德行时泰盛雄琛钧冠策腾楠榕风航弘'
const namesFemaleCN = '秀娟英华慧巧美娜静淑惠珠翠雅芝玉萍红娥玲芬芳燕彩春菊兰凤洁梅琳素云莲真环雪荣爱妹霞香月莺媛艳瑞凡佳嘉琼勤珍贞莉桂娣叶璧璐娅琦晶妍茜秋珊莎锦黛青倩婷姣婉娴瑾颖露瑶怡婵雁蓓纨仪荷丹蓉眉君琴蕊薇菁梦岚苑婕馨瑗琰韵融园艺咏卿聪澜纯毓悦昭冰爽琬茗羽希宁欣飘育滢馥筠柔竹霭凝晓欢霄枫芸菲寒伊亚宜可姬舒影荔枝思丽'

const generateIdentity = () => {
  // 1. 基础信息
  const isMale = gender.value === 'male'
  const surname = randomPick(surnamesCN.split(''))
  const name = isMale
    ? randomPick(namesMaleCN.split('')) + (Math.random() > 0.5 ? randomPick(namesMaleCN.split('')) : '')
    : randomPick(namesFemaleCN.split('')) + (Math.random() > 0.5 ? randomPick(namesFemaleCN.split('')) : '')
  identity.name = surname + name

  // 2. 年龄生日
  const year = randomInt(1970, 2003)
  const month = randomInt(1, 12)
  const day = randomInt(1, 28)
  const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
  identity.birthday = dateStr
  identity.age = new Date().getFullYear() - year

  // 星座
  const constellations = ['魔羯', '水瓶', '双鱼', '白羊', '金牛', '双子', '巨蟹', '狮子', '处女', '天秤', '天蝎', '射手', '魔羯']
  identity.constellation = constellations[month - (day < 19 ? 1 : 0)] + '座'

  // 3. 身份证 (简化版，仅校验位正确)
  const areaCode = '110101' // 北京东城
  const rawId = areaCode + dateStr.replace(/-/g, '') + randomInt(10, 99) + (isMale ? '1' : '2')
  let sum = 0
  const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  const codes = '10X98765432'
  for (let i = 0; i < 17; i++) sum += parseInt(rawId[i]) * weights[i]
  identity.idCard = rawId + codes[sum % 11]

  // 4. 手机号
  const prefixes = ['135', '136', '137', '138', '139', '150', '151', '158', '159', '180', '186', '189']
  identity.phone = randomPick(prefixes) + randomInt(10000000, 99999999).toString()

  // 5. 其他
  const domain = ['gmail.com', 'outlook.com', 'qq.com', '163.com']
  const pinyin = 'user' + randomInt(100, 999)
  identity.email = `${pinyin}@${randomPick(domain)}`
  identity.username = `${pinyin}_${randomInt(10, 99)}`
  identity.password = Math.random().toString(36).slice(-10) + 'A!'
  identity.address = `北京市朝阳区${randomInt(1, 99)}号院 ${randomInt(1, 10)}号楼 ${randomInt(101, 1602)}室`

  // 6. 信用卡 (Luhn 算法生成)
  const card = '4' + randomInt(10000000000000, 99999999999999).toString()
  let luhnSum = 0
  let isEven = false
  for (let n = card.length - 1; n >= 0; n--) {
    let digit = parseInt(card.charAt(n), 10)
    if (isEven) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    luhnSum += digit
    isEven = !isEven
  }
  const checkDigit = (10 - (luhnSum % 10)) % 10
  identity.creditCard = card + checkDigit
}

const copyAll = () => {
  const text = Object.entries(identity).map(([k, v]) => `${k}: ${v}`).join('\n')
  navigator.clipboard.writeText(text)
  alert('已复制所有信息')
}

// ================= 模块二：2FA 逻辑 =================
const tokens = ref([])
const showAddModal = ref(false)
const newToken = reactive({ issuer: '', account: '', secret: '' })
const timeLeft = ref(30)
let timer = null

// 从 LocalStorage 加载
const loadTokens = () => {
  const data = localStorage.getItem('privacy_box_2fa')
  if (data) {
    try {
      tokens.value = JSON.parse(data)
    } catch (e) { console.error(e) }
  }
}

const saveTokens = () => {
  localStorage.setItem('privacy_box_2fa', JSON.stringify(tokens.value))
}

const addToken = () => {
  if (!newToken.secret) return alert('密钥不能为空')
  // 简单清理空格
  newToken.secret = newToken.secret.replace(/\s/g, '').toUpperCase()
  tokens.value.push({ ...newToken })
  saveTokens()
  newToken.issuer = ''
  newToken.account = ''
  newToken.secret = ''
  showAddModal.value = false
}

const removeToken = (index) => {
  if (confirm('确定要删除这个令牌吗？')) {
    tokens.value.splice(index, 1)
    saveTokens()
  }
}

// 生成 TOTP
const generateTokenCode = (secret) => {
  if (!secret) return '000000'
  try {
    const totp = new OTPAuth.TOTP({
      secret: OTPAuth.Secret.fromBase32(secret),
      algorithm: 'SHA1',
      digits: 6,
      period: 30
    })
    return totp.generate()
  } catch (e) {
    return 'ERROR'
  }
}

const formatCode = (code) => {
  if (!code || code.length !== 6) return code
  return code.slice(0, 3) + ' ' + code.slice(3)
}

const copyCode = (code) => {
  navigator.clipboard.writeText(code)
}

// 倒计时逻辑
const startTimer = () => {
  const update = () => {
    const epoch = Math.floor(Date.now() / 1000)
    timeLeft.value = 30 - (epoch % 30)
  }
  update()
  timer = setInterval(update, 1000)
}

onMounted(() => {
  generateIdentity()
  loadTokens()
  startTimer()
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
@keyframes blob {
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0, 0) scale(1); }
}
.animate-blob { animation: blob 7s infinite; }
.animation-delay-2000 { animation-delay: 2s; }

@keyframes keyblob {
  0% { transform: scale(0.5); }
  100% { transform: scale(1); }
}
.key-animae { animation: keyblob 1s ; }
</style>
