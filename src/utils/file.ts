export const downloadFile = (src:string, fileName = 'excel.xls') => {
  const a = document.createElement('a')
  a.download = fileName
  a.style.display = 'none'
  a.href = src
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

export const downloadBlob = (blobData, fileName = 'excel.xls') => {
  const blob = new Blob([blobData])
  const a = document.createElement('a')
  a.download = fileName
  a.style.display = 'none'
  a.href = URL.createObjectURL(blob)
  document.body.appendChild(a)
  a.click()
  URL.revokeObjectURL(a.href)
  document.body.removeChild(a)
}

export const blobToBase64 = blob => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onloadend = function () {
      resolve(reader.result)
    }
    reader.onerror = function () {
      reject(reader)
    }
  })
}

export const blobToJson = blob => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsText(blob, 'utf-8')
    reader.onload = () => {
      resolve(JSON.parse(reader.result))
    }
  })
}
