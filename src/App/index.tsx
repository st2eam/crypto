/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from 'react'
import styles from './style.module.less'
import useSingleton from '@/hooks/useSingleton'
import useSecret from '@/hooks/useSecret'
import SwapHoriz from '@mui/icons-material/SwapHoriz'
import ContentCopy from '@mui/icons-material/ContentCopy'
import Clear from '@mui/icons-material/Clear'
import Button from '@mui/material/Button'
import SettingButton from '@/components/Setting'

const ChatInput: React.FC = () => {
	const singleton = useSingleton()
	const secret = useSecret()
	const inputRef = useRef<HTMLDivElement>(null)
	const outputRef = useRef<HTMLDivElement>(null)
	const isComposing = useRef(false)
	const prefix = secret.getValue()

	async function copyToClipboard() {
		if (!outputRef.current) {
			return
		}
		const htmlContent = Array.from(outputRef.current.childNodes)
			.map(
				node =>
					(node instanceof HTMLElement
						? node.outerHTML
						: node.textContent) || ''
			)
			.join('')
		try {
			// 创建包含 HTML 内容的 ClipboardItem
			const clipboardItem = new ClipboardItem({
				'text/html': new Blob([htmlContent], { type: 'text/html' }),
				'text/plain': new Blob([outputRef.current.innerText], {
					type: 'text/plain',
				}),
			})

			// 写入剪贴板
			await navigator.clipboard.write([clipboardItem])
		} catch (error) {
			console.error('复制子节点 HTML 到剪贴板失败:', error)
		}
	}

	useEffect(() => {
		if (!inputRef.current || !outputRef.current) {
			return
		}
		if (singleton.source === '' || singleton.source === '<br>') {
			singleton.setValue('')
			singleton.setSource('')
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
			singleton.setValue(
				singleton.encrypt(prefix + singleton.source, secret.getValue())
			)
		}
	}, [singleton.source, prefix, inputRef])

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
		if (inputRef.current) {
			inputRef.current.innerHTML = ''
		}
		singleton.setValue('')
	}

	return (
		<div className={styles.crypto}>
			<div
				className={`${styles['input-wrap']} ${
					singleton.source !== '' ? styles.active : ''
				}`}
			>
				<span className={styles.label}>原始数据</span>
				<div
					className={styles['input-area']}
					contentEditable
					ref={inputRef}
					onInput={e => {
						if (isComposing.current) {
							return
						}
						singleton.setSource(e.currentTarget.innerHTML)
					}}
					onCompositionUpdate={() => {
						isComposing.current = true
					}}
					onCompositionEnd={e => {
						isComposing.current = false
						singleton.setSource(e.currentTarget.innerHTML)
					}}
				></div>
				<div className={styles['btn-group']}>
					<Button
						className={`${styles['icon-btn']} ${
							singleton.value ? styles['show-btn'] : ''
						}`}
						size="small"
						onClick={clear}
					>
						<Clear />
					</Button>
				</div>
			</div>
			<Button
				color="primary"
				aria-label="switch"
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
				<span className={styles.label}>分析结果</span>
				<div ref={outputRef} className={styles['output-area']}></div>
				<div className={styles['btn-group']}>
					<SettingButton
						className={`${styles['icon-btn']} ${
							singleton.source === 'setting'
								? styles['show-btn']
								: ''
						}`}
					/>
					<Button
						className={`${styles['icon-btn']} ${
							singleton.source ? styles['show-btn'] : ''
						}`}
						size="small"
						onClick={copyToClipboard}
					>
						<ContentCopy />
					</Button>
				</div>
			</div>
		</div>
	)
}

export default ChatInput
