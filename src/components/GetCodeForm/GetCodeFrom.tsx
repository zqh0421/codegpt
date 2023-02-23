// 这里是GitHub API传参表单
import React from 'react';
import { Form, Input } from "antd";
import type { FormInstance } from 'antd/es/form'

const GetCodeForm = React.forwardRef<FormInstance>((props, ref) => {
  return (
    <Form
      layout="vertical"
      ref={ref}
      initialValues={{
        "token": "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",
        "owner": "zqh0421",
        "repo": "codegpt",
        "filePath": "src/App.tsx",
        "branchName": ""
      }}
    >
      <Form.Item
        name="token"
        label="Token"
      >
        <Input required />
      </Form.Item>
      <Form.Item
        name="owner"
        label="Owner"
      >
        <Input required />
      </Form.Item>
      <Form.Item
        name="repo"
        label="Repo"
      >
        <Input required />
      </Form.Item>
      <Form.Item
        name="filePath"
        label="File Path"
      >
        <Input required />
      </Form.Item>
      <Form.Item
        name="branchName"
        label="BranchName"
      >
        <Input />
      </Form.Item>
    </Form>
  )
})

export default GetCodeForm