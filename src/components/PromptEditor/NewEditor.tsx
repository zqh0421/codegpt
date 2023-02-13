import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
// import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
// import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
// import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import {
  MonacoLanguageClient,
  MonacoServices,
  CloseAction,
  ErrorAction,
  MessageTransports,
} from "monaco-languageclient";
import {
  toSocket,
  WebSocketMessageReader,
  WebSocketMessageWriter,
} from "vscode-ws-jsonrpc";
import { StandaloneServices } from "vscode/services";
import getMessageServiceOverride from "vscode/service-override/messages";
import { buildWorkerDefinition } from "monaco-editor-workers";
import normalizeUrl from "normalize-url";
import "./PromptEditor.css";
import "./types";

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
    if (label === "typescript" || label === "javascript") {
      return new tsWorker();
    }
    return new editorWorker();
  },
};

interface IPromptEditorProps {
  prompt: string;
  setPrompt: Function;
  setEditor: Function;
  lang: string;
}

function MonacoEditor(Props: IPromptEditorProps) {
  let init = false;
  let cureditor: any;
  const { prompt, setPrompt, lang } = Props;
  const className = "monacoEditor";
  const width = "100%";
  const height = "100%";
  const theme = "vs";
  const onChange = (
    value: string,
    event: monaco.editor.IModelContentChangedEvent
  ) => {
    setPrompt(value);
  };

  function createLanguageClient(
    transports: MessageTransports
  ): MonacoLanguageClient {
    return new MonacoLanguageClient({
      name: "Monaco language client",
      clientOptions: {
        documentSelector: ["go"],
        errorHandler: {
          error: () => ({ action: ErrorAction.Continue }),
          closed: () => ({ action: CloseAction.DoNotRestart }),
        },
      },
      connectionProvider: {
        get: () => {
          return Promise.resolve(transports);
        },
      },
    });
  }

  function createUrl(hostname: string, port: number, path: string): string {
    const protocol = location.protocol === "https:" ? "wss" : "ws";
    return normalizeUrl(`${protocol}://${hostname}:${port}${path}`);
  }

  const options: monaco.editor.IEditorOptions = {
    autoIndent: "full",
    automaticLayout: true,
    contextmenu: true,
    fontFamily: "jetbrains mono",
    fontSize: 10,
    lineHeight: 16,
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
  const containerElement = useRef<HTMLDivElement | null>(null);

  const editor = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const _subscription = useRef<monaco.IDisposable | null>(null);

  const __prevent_trigger_change_event = useRef<boolean | null>(null);

  function processSize(size: number | string) {
    return !/^\d+$/.test(size as string) ? size : `${size}px`;
  }

  const fixedWidth = processSize(width);

  const fixedHeight = processSize(height);

  const style = useMemo(
    () => ({
      width: fixedWidth,
      height: fixedHeight,
    }),
    [fixedWidth, fixedHeight]
  );

  const handleEditorWillMount = () => {
    const finalOptions = () => {
      StandaloneServices.initialize({
        ...getMessageServiceOverride(document.body),
      });
      // buildWorkerDefinition('dist', new URL('', window.location.href).href, false);
    };
    return finalOptions || {};
  };

  const handleEditorDidMount = () => {
    // install Monaco language client services
    MonacoServices.install(monaco as any);
    // hardcoded socket URL
    const url = createUrl("localhost", 8999, "/server"); ///47.93.8.246
    console.log(url);
    const webSocket = new WebSocket(url);

    // listen when the web socket is opened
    let pingIntervel: any
    webSocket.onopen = () => {
      const socket = toSocket(webSocket);
      const reader = new WebSocketMessageReader(socket);
      const writer = new WebSocketMessageWriter(socket);
      const languageClient = createLanguageClient({
        reader,
        writer,
      });
      if (!init) {
        languageClient.start();
        // console.log("test")
        init = true;
      }
      reader.onClose(() => languageClient.stop());
      pingIntervel = window.setInterval(() => {
        socket.send("ping")
        console.log("pong")
      }, 5000)
    };
    cureditor = editor;
    _subscription.current = cureditor.current.onDidChangeModelContent(
      (event: any) => {
        if (!__prevent_trigger_change_event.current) {
          onChange(cureditor.current.getValue(), event);
        }
      }
    );
  };

  const initMonaco = () => {
    if (containerElement.current) {
      // Before initializing monaco editor
      monaco.editor.getModels().forEach((model: monaco.editor.ITextModel) => {
        model.dispose()
      })
      const model = monaco.editor.createModel(
        prompt !== null ? prompt : "",
        lang,
        monaco.Uri.parse("file://model/code.go")
      )
      const finalOptions = { ...options, ...handleEditorWillMount() };
      editor.current = monaco.editor.create(
        containerElement.current,
        {
          // value: prompt !== null ? prompt : "",
          // language: lang,
          model,
          ...(className ? { extraEditorClassName: className } : {}),
          ...finalOptions,
          ...(theme ? { theme } : {}),
        }
      );
      // editor.current?.setModel(model)
      // After initializing monaco editor
      handleEditorDidMount();
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(initMonaco, []);

  useEffect(() => {
    if (editor.current) {
      if (prompt === editor.current.getValue()) {
        return;
      }

      const model = editor.current.getModel();
      __prevent_trigger_change_event.current = true;
      editor.current.pushUndoStop();
      // pushEditOperations says it expects a cursorComputer, but doesn't seem to need one.
      model && model.pushEditOperations(
        [],
        [
          {
            range: model.getFullModelRange(),
            text: prompt,
          },
        ],
        () => []
      );
      editor.current.pushUndoStop();
      __prevent_trigger_change_event.current = false;
    }
  }, [prompt]);

  useEffect(() => {
    if (editor.current) {
        const model = editor.current.getModel();
        // monaco.editor.getModels().forEach((model: monaco.editor.ITextModel) => {
        //   model.dispose()
        // })
        // const model = monaco.editor.createModel(
        //   prompt,
        //   lang,
        //   lang==='go' ? monaco.Uri.parse("file://model/code.go") : monaco.Uri.parse("inmemory://model/2")
        // )
        // editor.current?.setModel(model)
        model && monaco.editor.setModelLanguage(model, lang);      
    }
  }, [lang]);

  useEffect(() => {
    if (editor.current) {
      // Don't pass in the model on update because monaco crashes if we pass the model
      // a second time. See https://github.com/microsoft/monaco-editor/issues/2027
      // const { model: _model, ...optionsWithoutModel } = options;
      // editor.current.updateOptions({
      //   ...(className ? { extraEditorClassName: className } : {}),
      //   ...optionsWithoutModel,
      // });
    }
  }, [className, options]);

  useEffect(() => {
    if (editor.current) {
      editor.current.layout();
    }
  }, [width, height]);

  useEffect(() => {
    monaco.editor.setTheme(theme);
  }, [theme]);

  useEffect(
    () => () => {
      if (editor.current) {
        // handleEditorWillUnmount();
        editor.current.dispose();
        const model = editor.current.getModel();
        if (model) {
          model.dispose();
        }
      }
      if (_subscription.current) {
        _subscription.current.dispose();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  return (
    <div className="promptEditorContainer" >
      <div
        ref={containerElement}
        style={style}
        className="react-monaco-editor-container"
      />
    </div>
  );
}

export default MonacoEditor;
