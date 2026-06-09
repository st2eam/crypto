import { useState } from 'react'
import Settings from '@mui/icons-material/SettingsOutlined'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
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
        aria-label="打开设置"
      >
        <Settings />
      </Button>
      <Drawer
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: { minWidth: 300 },
        }}
      >
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Typography variant="h6" sx={{ fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.05em', fontSize: 18 }}>
            设置
          </Typography>
          <Divider />
          <TextField
            label="密钥"
            variant="outlined"
            value={secret.getValue()}
            onChange={e => secret.setValue(e.target.value)}
            fullWidth
          />
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
            密钥同时用作 AES 加密密码和密文识别前缀。解密时，系统会检测解密结果是否以此密钥开头来判断输入是明文还是密文。
          </Typography>
        </Box>
      </Drawer>
    </>
  )
}

export default SettingButton
