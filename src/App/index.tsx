import React, { useEffect, useRef, useState } from 'react'
import styles from './style.module.less'
import useSingleton from '@/hooks/useSingleton'
import useSecret from '@/hooks/useSecret'
import SwapHoriz from '@mui/icons-material/SwapHoriz'
import ContentCopy from '@mui/icons-material/ContentCopy'
import Clear from '@mui/icons-material/Clear'
import TextFields from '@mui/icons-material/TextFields'
import AttachFile from '@mui/icons-material/AttachFile'
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import SettingButton from '@/components/Setting'
import FileCrypto from '@/components/FileCrypto'

type Mode = 'text' | 'file'

const CryptoPanel: React.FC = () => {
  const singleton = useSingleton()
  const secret = useSecret()
  const inputRef = useRef<HTMLDivElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const isComposing = useRef(false)
  const prefix = secret.getValue()
  const [mode, setMode] = useState<Mode>('text')
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  })

  async function copyToClipboard() {
    if (!outputRef.current) {
      return
    }
    const htmlContent = Array.from(outputRef.current.childNodes)
      .map(node =>
        (node instanceof HTMLElement ? node.outerHTML : node.textContent) || ''
      )
      .join('')
    try {
      const clipboardItem = new ClipboardItem({
        'text/html': new Blob([htmlContent], { type: 'text/html' }),
        'text/plain': new Blob([outputRef.current.innerText], {
          type: 'text/plain',
        }),
      })
      await navigator.clipboard.write([clipboardItem])
      setToast({ open: true, message: '已复制到剪贴板', severity: 'success' })
    } catch (_error) {
      setToast({ open: true, message: '复制失败，请重试', severity: 'error' })
    }
  }

  useEffect(() => {
    if (!inputRef.current || !outputRef.current) {
      return
    }
    if (singleton.source === '' || singleton.source === '<br>') {
      singleton.setValue('')
      singleton.setSource('')
      singleton.setError(null)
      return
    }
    if (
      singleton
        .decrypt(singleton.source, secret.getValue())
        .startsWith(prefix)
    ) {
      const value = singleton
        .decrypt(singleton.source, secret.getValue())
        .slice(prefix.length)
      singleton.setValue(value)
    } else {
      singleton.setError(null)
      singleton.setValue(
        singleton.encrypt(prefix + singleton.source, secret.getValue())
      )
    }
  }, [singleton.source, prefix])

  useEffect(() => {
    if (!outputRef.current) {
      return
    }
    outputRef.current.innerHTML = singleton.value
  }, [singleton.value])

  const handleSwitch = () => {
    if (inputRef.current) {
      inputRef.current.innerHTML = singleton.value
    }
    singleton.setSource(singleton.value)
  }

  const clear = () => {
    singleton.setSource('')
    singleton.setError(null)
    if (inputRef.current) {
      inputRef.current.blur()
      inputRef.current.innerHTML = ''
    }
  }

  return (
    <div className={styles.container}>
      <Snackbar
        open={toast.open}
        autoHideDuration={2000}
        onClose={() => setToast(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity={toast.severity}
          variant="filled"
          onClose={() => setToast(prev => ({ ...prev, open: false }))}
          sx={{ minWidth: 200 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>

      {singleton.error && (
        <Alert
          severity="error"
          variant="filled"
          className={styles['error-alert']}
          onClose={() => singleton.setError(null)}
        >
          {singleton.error}
        </Alert>
      )}

      {/* Tab switcher */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${mode === 'text' ? styles['tab-active'] : ''}`}
          onClick={() => setMode('text')}
        >
          <TextFields sx={{ fontSize: 18 }} />
          文本加解密
        </button>
        <button
          className={`${styles.tab} ${mode === 'file' ? styles['tab-active'] : ''}`}
          onClick={() => setMode('file')}
        >
          <AttachFile sx={{ fontSize: 18 }} />
          文件加解密
        </button>
      </div>

      {mode === 'text' ? (
        <div className={styles.crypto}>
          <div
            className={`${styles['input-wrap']} ${
              singleton.source !== '' ? styles.active : ''
            }`}
          >
            <span className={styles.label} id="input-label">
              原始数据
            </span>
            <div
              className={styles['input-area']}
              contentEditable
              ref={inputRef}
              aria-labelledby="input-label"
              role="textbox"
              aria-multiline="true"
              onInput={e => {
                if (isComposing.current) {
                  return
                }
                singleton.setSource(e.currentTarget.innerHTML)
              }}
              onCompositionStart={() => {
                isComposing.current = true
              }}
              onCompositionUpdate={() => {
                isComposing.current = true
              }}
              onCompositionEnd={e => {
                isComposing.current = false
                singleton.setSource(e.currentTarget.innerHTML)
              }}
            />
            <div className={styles['btn-group']}>
              <Button
                className={`${styles['icon-btn']} ${
                  singleton.source ? styles['show-btn'] : ''
                }`}
                size="small"
                onClick={clear}
                aria-label="清除输入"
              >
                <Clear />
              </Button>
            </div>
          </div>

          <Button
            color="primary"
            aria-label="交换输入输出"
            onClick={handleSwitch}
            disabled={singleton.value === ''}
            className={styles['switch-btn']}
          >
            <SwapHoriz />
          </Button>

          <div
            className={`${styles['output-wrap']} ${
              singleton.value !== '' ? styles.active : ''
            }`}
          >
            <span className={styles.label} id="output-label">
              处理结果
            </span>
            <div
              ref={outputRef}
              className={styles['output-area']}
              aria-labelledby="output-label"
              role="textbox"
              aria-multiline="true"
              aria-readonly="true"
            />
            <div className={styles['btn-group']}>
              <SettingButton
                className={`${styles['icon-btn']} ${
                  singleton.source === 'setting' ? styles['show-btn'] : ''
                }`}
              />
              <Button
                className={`${styles['icon-btn']} ${
                  singleton.value ? styles['show-btn'] : ''
                }`}
                size="small"
                onClick={copyToClipboard}
                aria-label="复制结果"
              >
                <ContentCopy />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles['file-panel']}>
          <FileCrypto />
        </div>
      )}
    </div>
  )
}

export default CryptoPanel
