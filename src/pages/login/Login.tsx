import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button, Input, Popover } from 'antd'
import { KeyOutlined, InfoCircleOutlined } from '@ant-design/icons'
import './Login.css'
// import { verify } from '../../api/verify'

interface FormValues {
  api_key: string
}

const Login: React.FC = () => {
  const navigate = useNavigate()
  const onFinish = (values : FormValues) => {
    localStorage.setItem("token",JSON.stringify(values)) // 保存API-key
    navigate('/') // 提交后跳转页面
  }
  useEffect(() => {
    if (localStorage && localStorage.token) {
      navigate('/')
    }
  }, [])
  return (
    <div style={{ background: 'rgb(35, 39, 65)', height: "100%" }}>
      <div className="formContainer">
        <div className="login-title">Welcome to CodeGPT (test)</div>
        <Form // 表单
          name="normal_login"
          className="login-form"
          onFinish={(val:FormValues) => onFinish(val)}
        >
          <Form.Item
            name="api_key"
            rules={[{ required: true, message: 'Please input your API-key!' }]}
            className='login-form'
          >
            <Input
              prefix={<KeyOutlined className="site-form-item-icon" />}
              suffix={
                <Popover
                  title={
                    <div>Learn more about API-KEY: <a href="https://platform.openai.com/docs/api-reference/authentication." target="_blank">CLICK HERE</a>.</div>
                  }
                  content={
                    <div>
                      <div>You can submit anything if you just want</div>
                      <div>to visit the website without using its</div>
                      <div>functions.</div>
                    </div>
                  }
                >
                  <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                </Popover>
              }
              size="large"
              type="password"
              placeholder="API-key"
              className='login-form-input'
            />
            
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button" size='large'>
              SUBMIT
            </Button>
            {/* Learn more about ChatGPT.
      Learn more about OpenAI.
      How can I get API-KEY?
      Without an available API-KEY, you can enter anything and submit to visit the home page but cannot access OpenAI API. */}
          </Form.Item>
        </Form>
      </div>
      <div className="footer">
        <p><a href='https://openai.com/' target="_blank">OpenAI</a> | <a href='https://openai.com/blog/chatgpt/' target="_blank">ChatGPT</a></p>
      </div>
    </div>
  )
}

export default Login