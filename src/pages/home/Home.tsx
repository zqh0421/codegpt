import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router'
import { Button } from 'antd'
import type { FormInstance } from 'antd/es/form'
import TopHeader from '../../components/TopHeader/TopHeader'
import ConfigForm from '../../components/ConfigForm/ConfigForm'
import PromptEditor from '../../components/PromptEditor/PromptEditor'
import Display from '../../components/Display/Display'
import { request } from '../../api/request'
export default function Home() {
  const [currentToken, setCurrentToken] = useState({
    api_key: ""
  })
  const [prompt, setPrompt] = useState<string>("")
  const [result, setResult] = useState<string>("")
  const formRef = useRef<FormInstance>(null)
  let navigate = useNavigate()
  useEffect(() => {
    if (!localStorage.token) {
      navigate('/login')
    } else {
      setCurrentToken(JSON.parse(localStorage.token))
    }
    // console.log(formRef.current)
  }, [])

  const submit = () => {
    formRef.current?.validateFields().then(val => {
      val = { ...val, prompt }
      console.log(val.prompt)
      const res = request(currentToken.api_key, val)
      .then(text => {
        setResult(text)
      })
      // formRef.current?.resetFields()
    }).catch(err => {
      console.log(err)
    })
  }
  return (
    <div className="homePage">
      <TopHeader />
      <div className="configForm">
        <div className="subConfigForm">
          <ConfigForm ref={formRef}/>
        </div>
      </div>
      <PromptEditor result={result}/>
      <Display />
      <Button onclick={submit}>Submit</Button>
    </div>
  )
  
//   return (
//     <div>
//       <TopHeader/>
//       <ConfigForm ref={formRef}/>
//       <PromptEditor {...{setPrompt}} />
//       <Display result={result} />
//       <Button onClick={submit}>Submit</Button>
//     </div>
//   )
}
