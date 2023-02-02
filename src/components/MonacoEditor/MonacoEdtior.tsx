import React from "react";
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

const Editor = () => {
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
        verticalSliderSize: 18,
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

    const onChange = (newCode: string, event: monaco.editor.IModelContentChangedEvent) => {
        console.log('onChange', newCode);
    };

    return (
      <MonacoEditor
          width="100%"
          height="80vh"
          language="go"
          theme="vs"
          options={MONACO_OPTIONS}
          onChange={onChange}
          editorDidMount={editorDidMount}
      />
    );
}

export default Editor;