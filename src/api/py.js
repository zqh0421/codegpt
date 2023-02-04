import express from 'express'
import { Server } from 'socket.io'
import url from 'url'
import { WebSocketMessageReader, WebSocketMessageWriter } from 'vscode-ws-jsonrpc';
import { createServerProcess, createConnection, forward } from 'vscode-ws-jsonrpc/server';
import { Message } from 'vscode-languageserver';
import * as lsp from 'vscode-languageserver';

const PORT = 8999;
const SOCKETPATH = '/index.html/monacoServer';
const app = express();

const launch = (socket) => {
  const reader = new WebSocketMessageReader(socket);
  const writer = new WebSocketMessageWriter(socket);
  console.log('connection established');
  const socketConnection = createConnection(reader, writer, () =>
    socket.dispose()
  );
  const serverConnection = createServerProcess(
    'JSON',
    '/home/piotr/sandbox/example/pyls/venv/bin/pylsp' // path to python-lsp-server called with pylsp command
  );
  forward(socketConnection, serverConnection, (message) => {
    console.log('server forward');
    if (Message.isRequestMessage(message)) {
      if (message.method === lsp.InitializeRequest.type.method) {
        const initializeParams = message.params;
        initializeParams.processId = process.pid;
      }
    }
    return message;
  });
}


const wss = new Server({
  noServer: true,
  perMessageDeflate: false,
});

const server = app.listen(PORT, function () {
  console.log(`App listening on port ${PORT}`);
});

server.on('upgrade', (request, socket, head) => {
  console.log('server on upgrade');
  const pathname = request.url ? url.parse(request.url).pathname : undefined;
  console.log({ pathname });
  if (pathname === SOCKETPATH) {
    wss.handleUpgrade(request, socket, head, (webSocket) => {
      const socket2 = {
        send: (content) =>
          webSocket.send(content, (error) => {
            if (error) {
              throw error;
            }
          }),
        onMessage: (cb) => webSocket.on('message', cb),
        onError: (cb) => webSocket.on('error', cb),
        onClose: (cb) => webSocket.on('close', cb),
        dispose: () => webSocket.close(),
      };
      console.log({ state: webSocket.readyState, open: webSocket.OPEN });
      // launch the server when the web socket is opened
      if (webSocket.readyState === webSocket.OPEN) {
        launch(socket2);
      } else {
        webSocket.on('open', () => launch(socket));
      }
    });
  }
});
