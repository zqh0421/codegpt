import React, { useEffect } from 'react'
import { Input } from 'antd'
import MonacoEditor, { EditorDidMount } from "react-monaco-editor";
import * as monaco from 'monaco-editor';
import { MonacoServices } from "monaco-languageclient";
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
// import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
// import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
// import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

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

const { TextArea } = Input

interface Props {
  prompt: string,
  setPrompt: Function;
  lang: string,
}


const PromptEditor: React.FC<Props> = (Props) => {
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
  
  const editorDidMount: EditorDidMount = (editor:any) => {
    MonacoServices.install(monaco as any);
    if (editor && editor.getModel()) {
      const editorModel = editor.getModel();
      if (editorModel) {
        editorModel.setValue('{\n    "sayHello": "hello"\n}');
      }
    }
    editor.focus();
  };
  const onChange = (value: string, event: monaco.editor.IModelContentChangedEvent) => {
    Props.setPrompt(value)
  };
  
  return (
    <>
      {/* <div className="box"> */}
        <MonacoEditor className="monacoEditor"
          value={Props.prompt}
          width="100%"
          height="80vh"
          language={Props.lang}
          theme="vs"
          options={MONACO_OPTIONS}
          onChange={onChange}
          editorDidMount={editorDidMount}
        />
    </>
  )
}

export default PromptEditor;