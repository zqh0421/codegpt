import { Layout, Modal, message } from 'antd';
import { useState } from 'react';
import './TopHeader.css'

const { Header } = Layout;

const TopHeader: React.FC = () => {
  const [currentToken, setCurrentToken] = useState(JSON.parse(localStorage.token))
  const [open, setOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)

  const handleOk = () => {
    setConfirmLoading(true)
    setTimeout(() => {
      setCurrentToken(null)
      localStorage.removeItem("token")
      message.success("You have successfully logged out.")
      window.location.reload()
    }, 1000)
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
      <div className="left">
          <p className='topTitle'><a href='https://github.com/zqh0421/codegpt_test/' target="_blank">CodeGPT</a></p>
        </div>
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