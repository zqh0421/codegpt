import { useEffect, useState, useRef } from 'react'
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

interface IDefaultValues {
  plaintext: string,
  go: string,
  typescript: string,
}

export default function Home() {
  const [currentToken, setCurrentToken] = useState({
    api_key: ""
  })
  const [prompt, setPrompt] = useState<string>("")
  const [lang, setLang] = useState<string>("")
  const [result, setResult] = useState<string>("")
  const [submitBtn, setSubmitBtn] = useState<string>("Submit")
  const [submitFunc, setSubmitFunc] = useState<boolean>(false)
  const [isEditVisible, setIsEditVisible] = useState<boolean>(false)
  const formRef = useRef<FormInstance>(null)
  const getCodeFormRef = useRef<FormInstance>(null)
  useEffect(() => {
    if (localStorage && localStorage.token) {
      setCurrentToken(JSON.parse(localStorage.token))
      setPrompt(defaultValues[langOptions[0].value as keyof typeof defaultValues])
    }
  }, [])

  

  const langOptions = [{
    value: "plaintext",
    label: 'Plain Text'
  }, {
    value: "go",
    label: "Go"
  }, {
    value: "typescript",
    label: "TypeScript"
  }]

  const defaultValues: IDefaultValues = {
    "plaintext": (
      'Print "Hello World" using TypeScript and Go respectilvely.'
    ),"go": (
      'package main\n\n'+
      'import "fmt"\n\n'+
      'func fibonacci(n int) int {\n'+
      '    if n < 2 {\n'+
      '        return n\n'+
      '    }\n'+
      '    return fibonacci(n-2) + fibonacci(n-1)\n'+
      '}\n\n'+
      'func main() {\n'+
      '    var i int\n'+
      '    for i = 0; i < 10; i++ {\n'+
      '        fmt.Printf("%d\t", fibonacci(i))\n'+
      '    }\n'+
      '}'
    ),
    "typescript": (
      'const fibonacci = (n: number) => {\n'+
      '  if (n < 2) {\n'+
      '    return n\n'+
      '  }\n'+
      '  return fibonacci(n-2) + fibonacci(n-1)\n'+
      '}\n\n'+
      'for (let i: number = 0; i < 10; i++) {\n'+
      '  console.log(fibonacci(i))\n'+
      '}'
    )
  }

  const submit = () => {
    formRef.current?.validateFields().then((val: any) => {
      val = { ...val, prompt }
      const res = request(currentToken.api_key, val)
      .then(text => {
        setResult(text)
      })
      // formRef.current?.resetFields()
    }).catch((err: any) => {
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
    setLang(value)
    setPrompt(defaultValues[value as keyof typeof defaultValues])
    if (value === langOptions[0].value) {
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
    localStorage && localStorage.token && <div className='homePage'>
      <TopHeader/>
      <div className="main">
        <div className="leftContainer">
          <div className="editors">
            <PromptEditor {...{setPrompt}} prompt={prompt} lang={lang} />
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
                defaultValue={langOptions[0].value}
                onChange={handleLangChange}
                className="selectLang"
                options={langOptions}
                style={{ width: 120 }}
              />
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