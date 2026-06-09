/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useState } from 'react'
import CryptoJS, { AES } from 'crypto-js'
import { ISingleton } from '@/interface'

export const SingletonContext = createContext<ISingleton>({
	value: '',
	setValue: () => {},
	source: '',
	setSource: () => {},
	encrypt: () => {
		return ''
	},
	decrypt: () => {
		return ''
	},
	error: null,
	setError: () => {},
})

// 创建单例对象的提供者
export const SingletonProvider = ({ children }: { children: ReactNode }) => {
	const [value, setValue] = useState('')
	const [source, setSource] = useState('')
	const [error, setError] = useState<string | null>(null)

	const encrypt = (value: string, secret_key: string) => {
		const res = AES.encrypt(value, secret_key).toString()
		return res
	}
	const decrypt = (value: string, secret_key: string) => {
		try {
			const bytes = AES.decrypt(value, secret_key)
			const originalText = bytes.toString(CryptoJS.enc.Utf8)
			if (!originalText) {
				setError('解密失败：密钥不正确或数据格式无效')
				return value
			}
			setError(null)
			return originalText
		} catch (_error) {
			setError('解密失败：密钥不正确或数据格式无效')
		}
		return value
	}
	const singleton = {
		value,
		setValue,
		source,
		setSource,
		encrypt,
		decrypt,
		error,
		setError,
	}

	return (
		<SingletonContext.Provider value={singleton}>
			{children}
		</SingletonContext.Provider>
	)
}
