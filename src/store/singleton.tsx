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
})

// 创建单例对象的提供者
export const SingletonProvider = ({ children }: { children: ReactNode }) => {
	const [value, setValue] = useState('')
	const [source, setSource] = useState('')

	const encrypt = (value: string, secret_key: string) => {
		const res = AES.encrypt(value, secret_key).toString()
		return res
	}
	const decrypt = (value: string, secret_key: string) => {
		try {
			const bytes = AES.decrypt(value, secret_key)
			const originalText = bytes.toString(CryptoJS.enc.Utf8)
			return originalText
		} catch (error) {
			// console.error('解密失败:', error)
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
	}

	return (
		<SingletonContext.Provider value={singleton}>
			{children}
		</SingletonContext.Provider>
	)
}
