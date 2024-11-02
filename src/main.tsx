import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import './index.css'
import App from './App'
import { SingletonProvider } from '@/store/singleton'
import { SecretProvider } from '@/store/secret'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<SecretProvider>
			<SingletonProvider>
				<App />
			</SingletonProvider>
		</SecretProvider>
	</StrictMode>
)
