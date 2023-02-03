import React, { useEffect, useState } from 'react'
import MonacoEditor, { EditorDidMount } from "react-monaco-editor";
import * as monaco from 'monaco-editor';
import { MonacoServices } from "monaco-languageclient";
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
// import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
// import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
// import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

import { io } from "socket.io-client"

self.MonacoEnvironment = {
  getWorker(_, label) {
    // if (label === 'json') {
    //   return new jsonWorker()
    // }
    // if (label === 'css' || label === 'scss' || label === 'less') {
    //   return new cssWorker()
    // }
    // if (label === 'html' || label === 'handlebars' || label === 'razor') {
    //   return new htmlWorker()
    // }
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker()
    }
    return new editorWorker()
  }
}

interface IPromptEditorProps {
  prompt: string,
  setPrompt: Function;
  lang: string
}

const PromptEditor: React.FC<IPromptEditorProps> = (Props) => {
  const { prompt, setPrompt, lang } = Props;
  let socket:any = null
  const MONACO_OPTIONS: monaco.editor.IEditorOptions = {
    autoIndent: "full",
    automaticLayout: true,
    contextmenu: true,
    fontFamily: "jetbrains mono",
    fontSize: 14,
    lineHeight: 20,
    hideCursorInOverviewRuler: true,
    matchBrackets: "always",
    quickSuggestions: true,
    formatOnPaste: true,
    formatOnType: true,
    minimap: {
      enabled: false,
    },
    readOnly: false,
    scrollbar: {
      horizontalSliderSize: 4,
      verticalSliderSize: 4,
    },
    bracketPairColorization: {
      enabled: true,
    },
  };
  
  const sendSocket = () => {
    if (lang == 'go') {
      if (!socket) {
        socket = io('http://localhost:7777')
      } 
      socket.emit('golang-lsp', {
        prompt, lang
      })

      socket.on('golang-lsp-response', (info: any) => {
        console.log(`Received ${info}`)
      })
    } else {
      // TODO: 切换语言时关闭go服务器
      console.log("not go")
      socket && socket.emit('disconnecting');
      socket = null
    }
  }

  useEffect(() => {
    sendSocket()
  }, [prompt])

  const editorDidMount: EditorDidMount = (editor:any) => {
    MonacoServices.install(monaco as any);
    if (editor && editor.getModel()) {
      editor.addCommand(monaco.KeyCode.KeyF, () => {
        console.log("fff")
      })
      const editorModel = editor.getModel();
      if (editorModel) {
        editorModel.setValue('{\n    "sayHello": "hello"\n}');
      }
    }
    editor.focus();
  };

  const onChange = (value: string, event: monaco.editor.IModelContentChangedEvent) => {
    setPrompt(value)
  };
  
  return (
    <>
        <MonacoEditor className="monacoEditor"
          value={prompt}
          width="100%"
          height="80vh"
          language={lang}
          theme="vs"
          options={MONACO_OPTIONS}
          onChange={onChange}
          editorDidMount={editorDidMount}
        />
    </>
  )
}

export default PromptEditor;