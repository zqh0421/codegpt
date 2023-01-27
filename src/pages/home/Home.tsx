import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router'
import { Button, Modal } from 'antd'
import type { FormInstance } from 'antd/es/form'
import TopHeader from '../../components/TopHeader/TopHeader'
import ConfigForm from '../../components/ConfigForm/ConfigForm'
import PromptEditor from '../../components/PromptEditor/PromptEditor'
import Display from '../../components/Display/Display'
import GetCodeForm from '../../components/GetCodeForm/GetCodeFrom'
import { request } from '../../api/request'
import getCode from '../../api/getCode'
import { IGetCodeProps } from "../../utils/interfaces";

export default function Home() {
  const [currentToken, setCurrentToken] = useState({
    api_key: ""
  })
  const [prompt, setPrompt] = useState<string>("")
  const [result, setResult] = useState<string>("")
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

  return (
    <div>
      <TopHeader/>
      <ConfigForm ref={formRef}/>
      <PromptEditor {...{setPrompt}} prompt={prompt} />
      <Display result={result} />
      <Button onClick={submit}>Submit</Button>
      <Button onClick={edit}>GetCodeFromGithub</Button>
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