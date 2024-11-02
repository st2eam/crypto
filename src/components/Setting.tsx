import { useState } from 'react'
import Settings from '@mui/icons-material/SettingsOutlined'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import useSecret from '@/hooks/useSecret'

interface IProps {
	className?: string
}

const SettingButton = (props: IProps) => {
	const { className } = props
	const [open, setOpen] = useState(false)
	const secret = useSecret()
	const toggleDrawer = (newOpen: boolean) => () => {
		setOpen(newOpen)
	}
	return (
		<>
			<Button
				className={className}
				size="small"
				onClick={toggleDrawer(true)}
			>
				<Settings />
			</Button>
			<Drawer open={open} onClose={toggleDrawer(false)}>
				<Box component="section" sx={{ p: 2 }}>
					<TextField
						label="Secret Key"
						variant="outlined"
						value={secret.getValue()}
						onChange={e => secret.setValue(e.target.value)}
					/>
				</Box>
			</Drawer>
		</>
	)
}

export default SettingButton
