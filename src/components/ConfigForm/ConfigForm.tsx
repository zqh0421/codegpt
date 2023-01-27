// 这里是参数配置表单
import React from 'react';
import { Form, Select, Slider } from "antd";
import type { FormInstance } from 'antd/es/form'

const { Option } = Select

const ConfigForm = React.forwardRef<FormInstance>((props, ref) => {
  const modelOptions = [
    "text-davinci-003",
    "text-davinci-002",
  ]
  const commandOptions = [
    "Ask CodeGPT",
    "Explain",
    "Refactor",
    "Optimize",
    "Find Problems",
    "Documentation",
  ]
  return (
    <Form
      layout="vertical"
      ref={ref}
      initialValues={{
        "command": commandOptions[0],
        "model": modelOptions[0],
        "temperature": 0.7,
        "maximum_length": 256,
      }}
    >
      <Form.Item
        name="command"
        label="Command"
      >
        <Select>
          {
            commandOptions.map(item => 
              <Option value={item} key={item}>{item}</Option>
            )
          }
        </Select>
      </Form.Item>
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
        name="temperature"
        label="Temperature"
      >
        <Slider
          min={0}
          max={1}
          step={0.01}
        />
      </Form.Item>
      <Form.Item
        name="maximum_length"
        label="Maximum length"
      >
        <Slider
          min={1}
          max={4000}
        />
      </Form.Item>
    </Form>
  )
})

export default ConfigForm