import React, { useEffect } from 'react'
import { Input } from 'antd'
import MonacoEditor, { EditorDidMount } from "react-monaco-editor";
import * as monaco from 'monaco-editor';
import { MonacoServices } from "monaco-languageclient";

self.MonacoEnvironment = {
	getWorker: function (workerId, label) {
		const getWorkerModule = (moduleUrl: any, label: any) => {
			return new Worker(self.MonacoEnvironment.getWorkerUrl(moduleUrl), {
				name: label,
				type: 'module'
			});
		};

		switch (label) {
			case 'json':
				return getWorkerModule('/monaco-editor/esm/vs/language/json/json.worker?worker', label);
			case 'css':
			case 'scss':
			case 'less':
				return getWorkerModule('/monaco-editor/esm/vs/language/css/css.worker?worker', label);
			case 'html':
			case 'handlebars':
			case 'razor':
				return getWorkerModule('/monaco-editor/esm/vs/language/html/html.worker?worker', label);
			case 'typescript':
			case 'javascript':
				return getWorkerModule('/monaco-editor/esm/vs/language/typescript/ts.worker?worker', label);
			default:
				return getWorkerModule('/monaco-editor/esm/vs/editor/editor.worker?worker', label);
		}
	}
};
const { TextArea } = Input

interface Props {
  prompt: string,
  setPrompt: Function;
  lang: string,
}

const PromptEditor: React.FC<Props> = (Props) => {

  const defaultValue : string = ("var fibonacci = function(){\n"+
  "  var memo = [0,1];\n"+
  "  var fib = function(n){\n"+
  "    var result = memo[n];\n"+
  "    if(typeof result !== 'number'){\n"+
  "      result = fib(n-1)+fib(n-2);\n"+
  "      memo[n] = result;\n"+
  "    }\n"+
  "   return result\n"+
  "  };\n"+
  "  return fib;\n"+
  "}()");
  
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