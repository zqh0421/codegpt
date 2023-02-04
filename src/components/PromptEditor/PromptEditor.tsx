import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react'
import MonacoEditor, { EditorDidMount, EditorWillMount } from "react-monaco-editor";
import * as monaco from 'monaco-editor';
import { listen } from 'vscode-ws-jsonrpc'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
// import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
// import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
// import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import {
  MonacoLanguageClient,
  MonacoServices,
  CloseAction,
  ErrorAction,
  MessageTransports
} from 'monaco-languageclient';import { toSocket, WebSocketMessageReader, WebSocketMessageWriter } from 'vscode-ws-jsonrpc';
import { StandaloneServices } from 'vscode/services';
import getMessageServiceOverride from 'vscode/service-override/messages';
import { buildWorkerDefinition } from 'monaco-editor-workers';
import normalizeUrl from 'normalize-url';

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
  setPrompt: Function,
  setEditor: Function,
  lang: string,
}

const PromptEditor: React.FC<IPromptEditorProps> = forwardRef((Props, ref) => {
  let cureditor: any
  const { prompt, setPrompt, lang } = Props;
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
  
  // const sendSocket = () => {
  //   if (lang == 'go') {
  //     if (!socket) {
  //       socket = io('http://localhost:7777')
  //     } 
  //     socket.emit('golang-lsp', {
  //       prompt, lang
  //     })

  //     socket.on('golang-lsp-response', (info: any) => {
  //       console.log(`Received ${info}`)
  //     })
  //   } else {
  //     // TODO: 切换语言时关闭go服务器
  //     console.log("not go")
  //     socket && socket.emit('disconnecting');
  //     socket = null
  //   }
  // }

  // useEffect(() => {
  //   sendSocket()
  // }, [prompt])
  useEffect(() => {
    Props.setEditor(cureditor)
  }, [cureditor])

  function createLanguageClient(transports: MessageTransports): MonacoLanguageClient {
    return new MonacoLanguageClient({
      name: 'Monaco language client',
      clientOptions: {
        documentSelector: ['go'],
        errorHandler: {
          error: () => ({ action: ErrorAction.Continue }),
          closed: () => ({ action: CloseAction.DoNotRestart })
        },
      },
      connectionProvider: {
        get: () => {
          return Promise.resolve(transports);
        },
      },
    });
  }

  const editorWillMount: EditorWillMount = (editor: any) => {
    StandaloneServices.initialize({
      ...getMessageServiceOverride(document.body)
    });
    // buildWorkerDefinition('dist', new URL('', window.location.href).href, false);
  }

  const editorDidMount: EditorDidMount = (editor:any) => {
    // install Monaco language client services
    MonacoServices.install(monaco as any);
    // hardcoded socket URL
    const url = createUrl('localhost', 8999, '/index.html/sampleServer');
    const webSocket = new WebSocket(url);

    // listen when the web socket is opened
    webSocket.onopen = () => {
      const socket = toSocket(webSocket)
      const reader = new WebSocketMessageReader(socket)
      const writer = new WebSocketMessageWriter(socket)
      const languageClient = createLanguageClient({
          reader,
          writer
      });
      languageClient.start();
      reader.onClose(() => languageClient.stop());
    };
    cureditor = editor
    //   const editorModel = editor.getModel();
    //   if (editorModel) {
    //     editorModel.setValue('{\n    "sayHello": "hello"\n}');
    //   }
    // }
    // editor.focus();
    // editor.onMouseLeave(function (e: any) {
    //   console.log({
    //     selection: editor.getSelection(),
    //     selectedValue: editor.getValue(editor.getSelection())
    //   })
    // })
  };

  const onChange = (value: string, event: monaco.editor.IModelContentChangedEvent) => {
    setPrompt(value)
  };

  function createUrl(hostname: string, port: number, path: string): string {
    const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
    return normalizeUrl(`${protocol}://${hostname}:${port}${path}`);
  }
  
  useImperativeHandle(ref, () => ({
      getSelection(editor: any) {
        return {
          selection: editor.getSelection(),
          value: editor.getValue(editor.getSelection())
        }
      },
    })
  )
  return (
    <>
      <MonacoEditor
        className="monacoEditor"
        value={prompt}
        width="100%"
        height="80vh"
        language={lang}
        theme="vs"
        options={MONACO_OPTIONS}
        onChange={onChange}
        editorDidMount={editorDidMount}
        editorWillMount={editorWillMount}
      />
    </>
  )
})

export default PromptEditor;