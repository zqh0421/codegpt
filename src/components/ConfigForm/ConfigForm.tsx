// 这里是参数配置表单
import React from 'react';
import { Form,  Select, Slider, InputNumber, Col, Row } from "antd";
const { Option } = Select

const ConfigForm : React.FC = () => {
  const modelOptions = [
    "text-davinci-003",
    "text-davinci-002",
  ]
  return (
    <Form
      layout="vertical"
      disabled
    >
      <Form.Item
        name="model"
        label="Model"
      >
        <Select>
          {
            modelOptions.map(item => 
              <Option value={item} key={item}>{item}</Option>
            )
          }
        </Select>
      </Form.Item>
      <Form.Item
        name="Temperature"
        label="Temperature"
      >
        <Slider
          min={0}
          max={1}
          step={0.01}
        />
      </Form.Item>
      <Form.Item
        name="Maximum length"
        label="Maximum length"
      >
        <Slider
          min={1}
          max={4000}
        />
      </Form.Item>
    </Form>
  )
}

export default ConfigForm