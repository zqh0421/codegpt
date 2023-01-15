// 这里现在暂时是用的文本框呈现结果，后面为了显示代码样式会考虑做调整，现在先大致确认定位就可以
import React from 'react'
import { Input } from 'antd'

const { TextArea } = Input

const Display : React.FC = () => {
  return (
    <>
      <TextArea
        rows={4}
        placeholder="After your submit, the result will display here."
        style={{
          height: 120,
          resize: 'none'
        }}
      />
    </>
  )
}

export default Display