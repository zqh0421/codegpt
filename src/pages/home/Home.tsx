import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from 'antd'
import TopHeader from '../../components/TopHeader/TopHeader'
import ConfigForm from '../../components/ConfigForm/ConfigForm'
import PromptEditor from '../../components/PromptEditor/PromptEditor'
import Display from '../../components/Display/Display'

export default function Home() {
  const [currentToken, setCurrentToken] = useState()
  let navigate = useNavigate()
  useEffect(() => {
    if (!localStorage.token) {
      navigate('/login')
    } else {
      setCurrentToken(JSON.parse(localStorage.token))
    }
  }, [])
  return (
    <div>
      <TopHeader/>
      <ConfigForm />
      <PromptEditor />
      <Display />
      <Button>Submit</Button>
    </div>
  )
}
