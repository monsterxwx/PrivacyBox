import { nextTick } from 'vue'

const modelTokenMap = {
  mita: {
    url: 'https://metaso.cn/api/v1/chat/completions',
    token: 'Bearer mk-A20C35399148D55F4D07B5E42E53565A',
    data: (text, options) => {
      const { deepThink } = options
      return {
        model: deepThink ? 'ds-r1' : 'fast_thinking',
        stream: true,
        messages: [{ role: 'user', content: text }]
      }
    }
  },
  'hunyuan-turbo': {
    url: 'https://api.hunyuan.cloud.tencent.com/v1/chat/completions',
    token: 'Bearer sk-V7fvIXNVENUSw6YJGzotycNxaMX7AYbj0tYlwkIHYS7txRgo',
    data: (text) => {
      return {
        model: 'hunyuan-turbo-latest',
        stream: true,
        messages: [{ role: 'user', content: text }],
        enable_enhancement: true
      }
    }
  },
  kimi: {
    url: 'https://api.moonshot.cn/v1/chat/completions',
    token: 'Bearer sk-y67lAVcxp7fCakUgbrftUREpMnFRZGb5S4M4D2tA07qdkwru',
    data: (text, options) => {
      const { deepThink } = options
      return {
        model: deepThink ? 'kimi-thinking-preview' : 'kimi-k2-0905-preview',
        stream: true,
        messages: [{ role: 'user', content: text }],
        temperature: 0.6
      }
    }
  },
  qwen: {
    url: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
    token: 'Bearer sk-46ce67987dcb475ca8e0e5b17eab3551',
    data: (text, options) => {
      const { deepThink } = options
      return {
        model: 'qwen-plus',
        stream: true,
        enable_thinking: deepThink || false,
        messages: [{ role: 'user', content: text }],
        stream_options: { include_usage: true } // 返回token消耗量，免费100万token
      }
    }
  },
  doubao: {
    url: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
    token: 'Bearer e53d18e5-3157-47f2-8ab7-cfb7a4475033',
    data: (text, options) => {
      const { deepThink } = options
      return {
        model: deepThink ? 'doubao-seed-1-6-thinking-250715' : 'doubao-seed-1-6-flash-250828',
        stream: true,
        messages: [{ role: 'user', content: text }]
      }
    }
  },
  'deepseek-r1': {
    url: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
    token: 'Bearer e53d18e5-3157-47f2-8ab7-cfb7a4475033',
    data: (text, options) => {
      return {
        model: 'deepseek-r1-250528',
        stream: true,
        messages: [{ role: 'user', content: text }]
      }
    }
  },
  GLM: {
    url: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    token: 'Bearer 841c061d0cc8497cb51adb559b06da67.rEnPiBDBg8oahmA5',
    data: (text, options) => {
      return {
        model: 'glm-4.6',
        stream: true,
        messages: [{ role: 'user', content: text }],
        temperature: 0.6
      }
    }
  }
}

export const streamRequest = async (text, messages, options = {}) => {
  const { deepThink = false, modelType, scrollFunc } = options
  const res = await fetch(modelTokenMap[modelType].url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: modelTokenMap[modelType].token
    },
    body: JSON.stringify(modelTokenMap[modelType].data(text, options))
  })
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`)
  }
  const reader = res.body.getReader()
  const decoder = new TextDecoder('utf-8')
  let done = false
  let buffer = ''

  while (!done) {
    const { value, done: isDone } = await reader.read()
    done = isDone
    if (value) {
      buffer += decoder.decode(value, { stream: true })

      // 按行分割处理SSE数据
      const lines = buffer.split('\n')
      buffer = lines.pop() || '' // 保留最后一行不完整的数据

      for (const line of lines) {
        if (line.startsWith('data:')) {
          const dataStr = line.slice(5).trim()

          if (dataStr === '[DONE]') {
            done = true
            break
          }

          const data = JSON.parse(dataStr)

          // 提取content内容
          if (data.choices && data.choices[0] && data.choices[0].delta) {
            const delta = data.choices[0].delta
            const currentMsg = messages.value[messages.value.length - 1]

            // 处理 citations（引用信息）
            if (delta.citations) {
              currentMsg.citations = delta.citations
            }

            // 处理思考过程
            if (delta.reasoning_content) {
              currentMsg.think += delta.reasoning_content
              if (scrollFunc) {
                nextTick(() => scrollFunc())
              }
            }

            // 处理 content 内容
            if (delta.content) {
              if (currentMsg.isThinkExpanded) {
                currentMsg.isThinkExpanded = false
              }
              currentMsg.content += delta.content
              if (scrollFunc) {
                nextTick(() => scrollFunc())
              }
            }

            // 处理 highlights（高亮信息）
            if (delta.highlights) {
              currentMsg.highlights = delta.highlights
            }
          }
        }
      }
    }
  }
  messages.value[messages.value.length - 1].isDone = done
  console.log(' messages.value', messages.value)
}
