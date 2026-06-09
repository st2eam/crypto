import React, { useState, useRef, useCallback } from 'react'
import {
  encryptFile,
  decryptFile,
  isEncryptedFile,
  downloadBlob,
  formatFileSize,
} from '@/utils/fileUtil'
import useSecret from '@/hooks/useSecret'
import FileOpen from '@mui/icons-material/FileOpen'
import Download from '@mui/icons-material/Download'
import CloudUpload from '@mui/icons-material/CloudUpload'
import LockReset from '@mui/icons-material/LockReset'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'

type Status = 'idle' | 'processing' | 'done' | 'error'

interface FileState {
  file: File
  status: Status
  resultBlob?: Blob
  resultName?: string
  errorMsg?: string
  isEncrypt: boolean
}

const FileCrypto: React.FC = () => {
  const secret = useSecret()
  const [fileState, setFileState] = useState<FileState | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback(
    async (file: File) => {
      const isEncrypt = !isEncryptedFile(file)
      setFileState({ file, status: 'processing', isEncrypt })
      try {
        if (isEncrypt) {
          const blob = await encryptFile(file, secret.getValue())
          setFileState(prev => ({
            ...prev!,
            status: 'done',
            resultBlob: blob,
            resultName: file.name + '.encrypted',
          }))
        } else {
          const { blob, name } = await decryptFile(file, secret.getValue())
          setFileState(prev => ({
            ...prev!,
            status: 'done',
            resultBlob: blob,
            resultName: name,
          }))
        }
      } catch (err: any) {
        setFileState(prev => ({
          ...prev!,
          status: 'error',
          errorMsg: err.message || '处理失败',
        }))
      }
    },
    [secret]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file) processFile(file)
    },
    [processFile]
  )

  const handleSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) processFile(file)
      // Reset so same file can be re-selected
      e.target.value = ''
    },
    [processFile]
  )

  const handleDownload = () => {
    if (fileState?.resultBlob && fileState?.resultName) {
      downloadBlob(fileState.resultBlob, fileState.resultName)
    }
  }

  const reset = () => {
    setFileState(null)
  }

  const isIdle = !fileState || fileState.status === 'idle'

  return (
    <div style={{ width: '100%' }}>
      {/* Drop zone */}
      <div
        onDragOver={e => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={e => {
          e.preventDefault()
          setDragOver(false)
        }}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? '#F59E0B' : '#E2E8F0'}`,
          borderRadius: 16,
          padding: '56px 24px',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: dragOver ? 'rgba(245,158,11,0.04)' : 'transparent',
          transition: 'border-color 0.2s, background-color 0.2s',
          marginBottom: 24,
        }}
      >
        <input
          ref={inputRef}
          type="file"
          onChange={handleSelect}
          style={{ display: 'none' }}
        />
        <CloudUpload
          sx={{
            fontSize: 48,
            color: dragOver ? '#F59E0B' : '#CBD5E1',
            mb: 1.5,
          }}
        />
        <div
          style={{
            fontFamily: 'Exo 2, sans-serif',
            fontSize: 15,
            color: '#64748B',
            marginBottom: 4,
          }}
        >
          拖拽文件到此处，或点击选择文件
        </div>
        <div
          style={{
            fontFamily: 'Exo 2, sans-serif',
            fontSize: 13,
            color: '#94A3B8',
          }}
        >
          普通文件自动加密，.encrypted 文件自动解密
        </div>
      </div>

      {/* File info & result */}
      {fileState && (
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: 12,
            padding: 20,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          {/* File name & size */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 16,
            }}
          >
            <FileOpen sx={{ color: '#94A3B8' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontFamily: 'Exo 2, sans-serif', fontWeight: 500, color: '#1E293B', wordBreak: 'break-all' }}>
                {fileState.file.name}
              </div>
              <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>
                {formatFileSize(fileState.file.size)}{' '}
                {fileState.isEncrypt ? '→ 加密' : '→ 解密'}
              </div>
            </div>

            {/* Status indicator */}
            {fileState.status === 'processing' && (
              <CircularProgress size={24} sx={{ color: '#F59E0B' }} />
            )}
            {fileState.status === 'done' && (
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={handleDownload}
                size="small"
                sx={{
                  bgcolor: '#F59E0B',
                  '&:hover': { bgcolor: '#D97706' },
                  fontFamily: 'Exo 2, sans-serif',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 2,
                }}
              >
                下载 {fileState.resultName}
              </Button>
            )}
          </div>

          {/* Error */}
          {fileState.status === 'error' && (
            <Alert
              severity="error"
              onClose={reset}
              sx={{ fontFamily: 'Exo 2, sans-serif' }}
            >
              {fileState.errorMsg}
            </Alert>
          )}

          {/* Retry / Reset */}
          {fileState.status === 'error' && (
            <Button
              startIcon={<LockReset />}
              onClick={reset}
              size="small"
              sx={{
                mt: 1,
                color: '#64748B',
                fontFamily: 'Exo 2, sans-serif',
                textTransform: 'none',
              }}
            >
              重新选择文件
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default FileCrypto
