// 后面预备添加拖拽文件上传文本，但是需要对文件文本进行分析，所以暂时就没有加这个模块了，计划先把基本的做完

import React, { useEffect } from 'react'
import { Input } from 'antd'

const { TextArea } = Input

interface Props {
  prompt: string,
  setPrompt: Function;
}

const PromptEditor: React.FC<Props> = (Props) => {
  const changePrompt = (value : string) => {
    console.trace()
    Props.setPrompt(value)
  }
  const defaultValue : string = ("var fibonacci = function(){\n"+
  "  var memo = [0,1];\n"+
  "  var fib = function(n){\n"+
  "    var result = memo[n];\n"+
  "    if(typeof result !== 'number'){\n"+
  "      result = fib(n-1)+fib(n-2);\n"+
  "      memo[n] = result;\n"+
  "    }\n"+
  "   return result\n"+
  "  };\n"+
  "  return fib;\n"+
  "}()");
  
  useEffect(() => {
    Props.setPrompt(defaultValue)
  }, [])
  
  return (
    <>
      <TextArea
        defaultValue={defaultValue}
        maxLength={4000}
        placeholder="Please write or copy your code here."
        style={{
          height: 500,
          resize: 'none'
        }}
        value={Props.prompt}
        onChange={info => changePrompt(info.target.value)}

      />
    </>
  )
}

export default PromptEditor