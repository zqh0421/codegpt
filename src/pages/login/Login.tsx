import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button, Input } from 'antd'
import { KeyOutlined } from '@ant-design/icons'
import './Login.css'
import { verify } from '../../api/verify'

const { TextArea } = Input

interface FormValues {
  api_key: string
}

const Login: React.FC = () => {
  const navigate = useNavigate()
  const onFinish = (values : FormValues) => {
    localStorage.setItem("token",JSON.stringify(values)) // 保存API-key
    navigate('/') // 提交后跳转页面
  }

  return (
    <div style={{ background: 'rgb(35, 39, 65)', height: "100%" }}>
      <div className="formContainer">
        <div className="login-title">This is a test module.</div>
        <Form // 表单
          name="normal_login"
          className="login-form"
          onFinish={(val:FormValues) => onFinish(val)}
        >
          <Form.Item
            name="api_key"
            rules={[{ required: true, message: 'Please input your API-key!' }]}
          >
            <Input
              prefix={<KeyOutlined className="site-form-item-icon" />}
              size="large"
              type="password"
              placeholder="API-key"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button" size='large'>
              SUBMIT
            </Button>
          </Form.Item>
          <Form.Item>
            <TextArea
                rows={4}
                placeholder="Please write or copy your code here."
                style={{
                  height: 120,
                  resize: 'none'
                }}
              />
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Login