import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router'
import { Button, Modal,Select } from 'antd'
import type { FormInstance } from 'antd/es/form'
import TopHeader from '../../components/TopHeader/TopHeader'
import ConfigForm from '../../components/ConfigForm/ConfigForm'
import PromptEditor from '../../components/PromptEditor/PromptEditor'
import Display from '../../components/Display/Display'
import GetCodeForm from '../../components/GetCodeForm/GetCodeFrom'
import { request } from '../../api/request'
import getCode from '../../api/getCode'
import { IGetCodeProps } from "../../utils/interfaces";
import { GithubOutlined } from '@ant-design/icons'
import './Home.css'

const { Option } = Select

export default function Home() {
  const [currentToken, setCurrentToken] = useState({
    api_key: ""
  })
  const [prompt, setPrompt] = useState<string>("")
  const [result, setResult] = useState<string>("")
  const [submitBtn, setSubmitBtn] = useState<string>("Submit")
  const [submitFunc, setSubmitFunc] = useState<boolean>(false)
  const [isEditVisible, setIsEditVisible] = useState<boolean>(false)
  const formRef = useRef<FormInstance>(null)
  const getCodeFormRef = useRef<FormInstance>(null)
  let navigate = useNavigate()
  useEffect(() => {
    if (!localStorage.token) {
      navigate('/login')
    } else {
      setCurrentToken(JSON.parse(localStorage.token))
    }
  }, [])

  const langOptions = [
    'Plain Text',
    'Go',
  ]

  const submit = () => {
    formRef.current?.validateFields().then(val => {
      val = { ...val, prompt }
      const res = request(currentToken.api_key, val)
      .then(text => {
        setResult(text)
      })
      // formRef.current?.resetFields()
    }).catch(err => {
      console.log(err)
    })
  }

  const edit = () => {
    setIsEditVisible(true)
  }

  const getCodeFormOk = () => {
    getCodeFormRef.current?.validateFields().then((value: IGetCodeProps) => {
      setIsEditVisible(false)
      getCodeFormRef.current?.resetFields()
      getCode(value).then(code => {
        setPrompt(code)
      })
      
    }).catch((err: any) => {
        console.log(err)
    })
  }

  const handleLangChange = (value: string) => {
    if (value === langOptions[0]) {
      console.log(value)
      setSubmitFunc(false)
      setSubmitBtn("Submit")
    } else {
      setSubmitFunc(true)
      setSubmitBtn("Submit All Code")
    }
  }
  const submitSelectedFunc = () => {
    console.log('click')
  }

  return (
    <div className='homePage'>
      <TopHeader/>
      <div className="main">
        <div className="leftContainer">
          <div className="editors">
            <PromptEditor {...{setPrompt}} prompt={prompt} />
            <Display result={result} />
          </div>
          <div className="mainPanel">
            <div className="buttonPanel">
              <Button onClick={submit}>{submitBtn}</Button>
              <Button disabled={!submitFunc} onClick={submitSelectedFunc}>Submit Selected Func</Button>
              <Button onClick={edit}>Get Code<GithubOutlined /></Button>
            </div>
            <div className="langPanel">
              <Select
                defaultValue={langOptions[0]}
                onChange={handleLangChange}
              >
                {
                  langOptions.map(item => 
                    <Option value={item} key={item}>{item}</Option>
                  )
                }
              </Select>
            </div>
          </div>
          
        </div>
        <div className="rightContainer">
          <ConfigForm ref={formRef} />
        </div>
      </div>
      <Modal
          open={isEditVisible}
          title="GET CODE FROM GITHUB"
          okText="GET CODE"
          cancelText="CANCEL"
          onCancel={()=>{
              setIsEditVisible(false)
          }}
          onOk={() => getCodeFormOk()}
      >
          <GetCodeForm ref={getCodeFormRef} />
      </Modal>
    </div>
  )
}