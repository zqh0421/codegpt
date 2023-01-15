import { Layout, Modal, message } from 'antd';
import { useState } from 'react';
import { useNavigate } from "react-router"
import './TopHeader.css'

const { Header } = Layout;

const TopHeader: React.FC = () => {
  const [currentToken, setCurrentToken] = useState(JSON.parse(localStorage.token))
  const [open, setOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  let navigate = useNavigate()

  const handleOk = () => {
    setConfirmLoading(true)
    setTimeout(() => {
      setCurrentToken(null)
      localStorage.removeItem("token")
      message.success("You have successfully logged out.")
      navigate('/login')
      setConfirmLoading(false)
    }, 2000)
  }
  
  const handleCancel = () => {
    setOpen(false)
  }
  
  const onLogOut = () => {
    setOpen(true)
  }

  return (
    <>
      <Header className="header">
        <div className="right">
          <p className='info'>Welcome! The last 4 digits of of your API-KEY: {currentToken.api_key.substring(currentToken.api_key.length-4)}</p>
          <p className='logOut' onClick={onLogOut}>Log Out</p>
        </div>
      </Header>
      <Modal
        title="Title"
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={confirmLoading}
      >
        <p>Your API-KEY will be deleted from localStorage</p>
      </Modal>
    </>
  )
}

export default TopHeader