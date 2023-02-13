import React, { useState } from 'react';
import { LaptopOutlined, NotificationOutlined, UserOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Button, Layout, theme } from 'antd'
import { Tree } from 'antd';
import type { DirectoryTreeProps } from 'antd/es/tree';
import type { FileNode } from '../../api/getFileTreeFromGithub'
const { DirectoryTree } = Tree;
import './FileTree.css'

export interface IFileTreeProps {
  treeData: Array<FileNode>
}

const { Sider } = Layout;

const FileTree: React.FC<IFileTreeProps> = (Props: IFileTreeProps) => {
  const [files, setFiles] = useState<Array<FileNode>>(new Array<FileNode>())
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const onSelect: DirectoryTreeProps['onSelect'] = (keys, info) => {
    console.log('Trigger Select', keys, info);
  };

  const onExpand: DirectoryTreeProps['onExpand'] = (keys, info) => {
    console.log('Trigger Expand', keys, info);
  };
  
  React.useEffect(() => {
    console.log(Props.treeData)
    setFiles(Props.treeData)
    // if (Props?.treeData?.children?.length)
    //   console.log(Props.treeData.children[0])
  }, [Props.treeData])

  React.useEffect(() => {
    console.log(files)
    console.log(files?.length)
  }, [files])
 
  return (
    <Layout style={{ padding: '24px 0', background: colorBgContainer }}>
      <Button
        type="primary"
        onClick={toggleCollapsed}
        style={{
          marginBottom: 16, 
          borderRadius: 0,
          position: 'sticky',
          left: '20px',
          top: '100px'
        }}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      <Sider
        style={{ background: colorBgContainer }}
        width={200}
        collapsed={collapsed}
        collapsedWidth={0}
      >
        <DirectoryTree
          defaultExpandAll
          onSelect={onSelect}
          onExpand={onExpand}
          treeData={files}
        />
      </Sider>
    </Layout>
  );
};

export default FileTree;
