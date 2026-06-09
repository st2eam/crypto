import CryptoJS, { AES } from 'crypto-js'

interface EncryptedPayload {
  name: string
  type: string
  size: number
  data: string
}

/** File → Base64 string (strips data:xxx;base64, prefix) */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      resolve(result.split(',')[1])
    }
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsDataURL(file)
  })
}

/** Base64 string → Blob */
function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteChars = atob(base64)
  const chunks: Uint8Array[] = []
  for (let offset = 0; offset < byteChars.length; offset += 1024) {
    const slice = byteChars.slice(offset, offset + 1024)
    const nums = new Uint8Array(slice.length)
    for (let i = 0; i < slice.length; i++) {
      nums[i] = slice.charCodeAt(i)
    }
    chunks.push(nums)
  }
  return new Blob(chunks, { type: mimeType })
}

/** 加密文件 → 返回 Blob（.encrypted 格式，JSON 内含密文和元数据） */
export async function encryptFile(file: File, key: string): Promise<Blob> {
  const base64 = await fileToBase64(file)
  const encrypted = AES.encrypt(base64, key).toString()
  const payload: EncryptedPayload = {
    name: file.name,
    type: file.type,
    size: file.size,
    data: encrypted,
  }
  return new Blob([JSON.stringify(payload)], { type: 'application/octet-stream' })
}

/** 解密 .encrypted 文件 → 返回原始 Blob + 文件名 + MIME 类型 */
export async function decryptFile(
  file: File,
  key: string
): Promise<{ blob: Blob; name: string; type: string }> {
  const text = await file.text()
  let payload: EncryptedPayload
  try {
    payload = JSON.parse(text)
  } catch {
    throw new Error('文件格式无效：不是有效的加密文件')
  }
  if (!payload.name || !payload.data) {
    throw new Error('文件格式无效：缺少必要字段')
  }
  const bytes = AES.decrypt(payload.data, key)
  const base64 = bytes.toString(CryptoJS.enc.Utf8)
  if (!base64) {
    throw new Error('解密失败：密钥不正确或文件已损坏')
  }
  const blob = base64ToBlob(base64, payload.type)
  return { blob, name: payload.name, type: payload.type }
}

/** 根据扩展名判断是否为加密文件 */
export function isEncryptedFile(file: File): boolean {
  return file.name.endsWith('.encrypted')
}

/** 触发浏览器下载 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/** 格式化文件大小为可读字符串 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
