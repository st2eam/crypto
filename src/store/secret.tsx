/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useState } from 'react'
import { ISecret } from '@/interface'
import { getPrefix, setPrefix } from '@/utils/prefixUtil'

export const SecretContext = createContext<ISecret>({
	setValue: () => {},
	getValue: () => {
		return ''
	},
})
// 创建单例对象的提供者
export const SecretProvider = ({ children }: { children: ReactNode }) => {
	const [secret, setSecret] = useState(() => getPrefix())

	const setValue = (value: string) => {
		setSecret(value)
		setPrefix(value)
	}

	const getValue = () => {
		return secret
	}

	const singleton = {
		setValue,
		getValue,
	}

	return (
		<SecretContext.Provider value={singleton}>
			{children}
		</SecretContext.Provider>
	)
}
