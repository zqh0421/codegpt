// 后面预备添加拖拽文件上传文本，但是需要对文件文本进行分析，所以暂时就没有加这个模块了，计划先把基本的做完

import React from 'react'
import { Input } from 'antd'

const { TextArea } = Input

interface Props {
  setPrompt: Function;
}

const PromptEditor: React.FC<Props> = (Props) => {
  const changePrompt = (value : string) => {
    Props.setPrompt(value)
  }
  
  return (
    <>
      <TextArea
        defaultValue={"test."}
        rows={4}
        placeholder="Please write or copy your code here."
        style={{
          height: 120,
          resize: 'none'
        }}
        onChange={info => changePrompt(info.target.value)}
      />
    </>
  )
}

export default PromptEditor