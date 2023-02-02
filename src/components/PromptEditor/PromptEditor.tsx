import React, { useEffect } from 'react'
import { Input } from 'antd'
import MonacoEditor, { EditorDidMount } from "react-monaco-editor";
import * as monaco from 'monaco-editor';
import { MonacoServices } from "monaco-languageclient";
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') {
      return new jsonWorker()
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker()
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker()
    }
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

  const defaultValue : string = (
    'package main\n\n'+
    'import "fmt"\n\n'+
    'func fibonacci(n int) int {\n'+
    '    if n < 2 {\n'+
    '        return n\n'+
    '    }\n'+
    '    return fibonacci(n-2) + fibonacci(n-1)\n'+
    '}\n\n'+
    'func main() {\n'+
    '    var i int\n'+
    '    for i = 0; i < 10; i++ {\n'+
    '        fmt.Printf("%d\t", fibonacci(i))\n'+
    '    }\n'+
    '}'
  );
  
  useEffect(() => {
    Props.setPrompt(defaultValue)
  }, [])
  const MONACO_OPTIONS: monaco.editor.IEditorConstructionOptions = {
    autoIndent: "full",
    automaticLayout: true,
    contextmenu: true,
    fontFamily: "jetbrains mono",
    fontSize: 16,
    lineHeight: 24,
    hideCursorInOverviewRuler: true,
    matchBrackets: "always",
    minimap: {
        enabled: false,
    },
    readOnly: false,
    scrollbar: {
        horizontalSliderSize: 4,
        verticalSliderSize: 4,
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
    const changePrompt = (value : string) => {
      Props.setPrompt(value)
    }
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
      {/* </div> */}
      {/* <TextArea
        defaultValue={defaultValue}
        maxLength={4000}
        placeholder="Please write or copy your code here."
        style={{
          height: 500,
          resize: 'none'
        }}
        value={Props.prompt}
        onChange={info => changePrompt(info.target.value)}

      /> */}
    </>
  )
}

export default PromptEditor;