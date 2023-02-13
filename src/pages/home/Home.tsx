import { useEffect, useState, useRef } from 'react'
import { Button, Modal,Select } from 'antd'
import type { FormInstance } from 'antd/es/form'
import TopHeader from '../../components/TopHeader/TopHeader'
import ConfigForm from '../../components/ConfigForm/ConfigForm'
import PromptEditor from '../../components/PromptEditor/PromptEditor'
import Display from '../../components/Display/Display'
import GetCodeForm from '../../components/GetCodeForm/GetCodeFrom'
import { request } from '../../api/request'
// import { getCode } from '../../api/getCode'
import { buildFileTree } from '../../api/getFileTreeFromGithub'
// import { IGetCodeProps } from "../../utils/interfaces";
import { GithubOutlined } from '@ant-design/icons'
import './Home.css'
import NewEditor from '../../components/PromptEditor/NewEditor'
import SideBar from '../../components/FileTree/FileTree'
import type { FileNode } from '../../api/getFileTreeFromGithub';
const { Option } = Select


export default function Home() {
  const [currentToken, setCurrentToken] = useState({
    api_key: ""
  })
  const [prompt, setPrompt] = useState<string>("")
  const [lang, setLang] = useState<string>("")
  const [result, setResult] = useState<string>("")
  const [editor, setEditor] = useState<any>()
  const [treeData, setTreeData] = useState<Array<FileNode>>(new Array<FileNode>())
  const [isEditVisible, setIsEditVisible] = useState<boolean>(false)
  const formRef = useRef<FormInstance>(null)
  const getCodeFormRef = useRef<FormInstance>(null)
  useEffect(() => {
    if (localStorage && localStorage.token) {
      setCurrentToken(JSON.parse(localStorage.token))
    }
  }, [localStorage?.token])

  const langOptions = [{
    value: "plaintext",
    label: 'Plain Text',
    default: 'Print "Hello World" using TypeScript and Go respectilvely.'
  },
  {
    value: "go",
    label: "Go",
    default: (
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
  }, {
    value: "typescript",
    label: "TypeScript",
    default: (
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
  },
  ]

  const edit = () => {
    setIsEditVisible(true)
    buildFileTree({
      token: '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',
      owner: 'zqh0421',
      repo: 'codegpt_test',
      filePath: '',
      branchName: 'vite-version'
    }).then(res => {
      if (res.length) {
        setTreeData(res)
        console.log(res)
      }
    }).catch(err => {
      console.error(err)
      console.error("ERROR: Configuration is wrong or API rate limit exceeded. Check out the GitHub API documentation for more details.")
    })
    
  }

  // const getCodeFormOk = () => {
  //   getCodeFormRef.current?.validateFields().then((value: IGetCodeProps) => {
  //     setIsEditVisible(false)
  //     getCodeFormRef.current?.resetFields()
  //     // getCode(value).then(code => {
  //     //   setPrompt(code || "")
  //     // })
      
  //   }).catch((err: any) => {
  //       console.error(err)
  //   })
  // }
  // useEffect(() => {
  //   console.log(prompt)
  // }, [prompt])
  useEffect(() => {
    if (localStorage?.token) {
      if (lang) {
        langOptions.forEach(langOption => {
          if (langOption.value===lang) {
            setPrompt(langOption.default)
          }
        })
      } else {
        langOptions.forEach(langOption => {
          if (langOption.value==="plaintext") {
            setLang("plaintext")
            setPrompt(langOption.default)
          }
        })
      }
    }
  }, [lang])

  const handleLangChange = (value: string) => {
    setLang(value)
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
      console.error(err)
    })
  }
  
  const getSelection = (editor: any) => {
    return {
      selection: editor.getSelection(),
      value: editor.getValue(editor.getSelection())
    }
  }

  const submitSelection = () => {
    console.log("select!!")
    const selection = getSelection(editor)
    const { value } = selection
    const { startLineNumber, startColumn, endLineNumber, endColumn } = selection.selection
    const splitted = value.split(/\r\n|\n|\r/)
    let selectedValue = ""
    if (startLineNumber != endLineNumber) {
      for (let i = startLineNumber - 1; i < endLineNumber; i++) {
        if (i === startLineNumber - 1) {
          selectedValue += splitted[i].slice(startColumn - 1) + '\n'
        } else if (i === endLineNumber - 1) {
          selectedValue += splitted[i].slice(0, endColumn - 1)
        } else {
          selectedValue += splitted[i] + '\n'
        }
      }
    } else {
      selectedValue = splitted[startLineNumber - 1].slice(startColumn - 1, endColumn - 1)
    }
    formRef.current?.validateFields().then((val: any) => {
      val = { ...val, prompt: selectedValue }
      const res = request(currentToken.api_key, val)
      .then(text => {
        setResult(text)
      })
      // formRef.current?.resetFields()
    }).catch((err: any) => {
      console.error(err)
    })
  }
  return (
    localStorage && localStorage.token && <div className='homePage'>
      <TopHeader/>
      <div className="main">
        <div className="leftContainer">
          <div className="editors">
            {/* <SideBar treeData={treeData} /> */}
            <PromptEditor {...{setPrompt, setEditor}} prompt={prompt} lang={lang} />
            {/* <NewEditor {...{setPrompt, setEditor}} prompt={prompt} lang={lang} /> */}
            <Display result={result} />            
          </div>
          <div className="mainPanel">
            <div className="buttonPanel">
              <Button onClick={submit}>Submit All</Button>
              <Button onClick={submitSelection}>Submit Selection</Button>
              <Button onClick={edit}>Get Code<GithubOutlined /></Button>
            </div>
            <div className="langPanel">
              <Select
                defaultValue="plaintext"
                onChange={handleLangChange}
                className="selectLang"
                style={{ textAlign: 'center' }}
              >
                {
                  langOptions.map(langOption => {
                    const { label, value } = langOption
                    return (<Option key={value} label={label} value={value}>{label}</Option>)
                  })
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
          // onOk={() => getCodeFormOk()}
      >
          <GetCodeForm ref={getCodeFormRef} />
      </Modal>
    </div>
  )
}