// 这里现在暂时是用的文本框呈现结果，后面为了显示代码样式会考虑做调整，现在先大致确认定位就可以
import React from 'react'
import { Input } from 'antd'
import './Display.css'
const { TextArea } = Input

interface Props {
  result: string
}

const Display : React.FC<Props> = (Props) => {
  return (
    <div className='displayArea'>
      <TextArea
        value={Props.result}
        placeholder="After your submit, the result will be displayed here."
        style={{
          height: "100%",
          resize: 'none'
        }}
        spellCheck={false}
      />
    </div>
  )
}

export default Display