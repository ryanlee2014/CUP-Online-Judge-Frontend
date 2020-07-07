import { listen, MessageConnection } from "vscode-ws-jsonrpc";
import {
    MonacoLanguageClient, CloseAction, ErrorAction,
    MonacoServices, createConnection
} from "monaco-languageclient";
import * as monaco from "monaco-editor";
import ReconnectingWebSocket from "reconnecting-websocket";
import store from "@/store";
// create Monaco editor

// install Monaco language client services
export function createLanguageServer (editor: monaco.editor.IStandaloneCodeEditor, value: string, language: string) {
// create the web socket
    MonacoServices.install(editor, { rootUri: "file:///tmp/cupoj-language-server/intellisense/" });
    const url = `${store.getters.languageServerUrl}/language-server/${language}`;
    const webSocket = createWebSocket(url);
    // listen when the web socket is opened
    listen({
        webSocket,
        onConnection: connection => {
            // create and start the language client
            const languageClient = createLanguageClient(connection);
            const disposable = languageClient.start();
            connection.onClose(() => disposable.dispose());
        }
    });

    function createLanguageClient (connection: MessageConnection): MonacoLanguageClient {
        return new MonacoLanguageClient({
            name: `${language} Language Client`,
            clientOptions: {
                // use a language id as a document selector
                documentSelector: [language],
                // disable the default error handler
                errorHandler: {
                    error: () => ErrorAction.Continue,
                    closed: () => CloseAction.DoNotRestart
                }
            },
            // create a language client connection from the JSON RPC connection on demand
            connectionProvider: {
                get: (errorHandler, closeHandler) => {
                    return Promise.resolve(createConnection(connection, errorHandler, closeHandler));
                }
            }
        });
    }

    function createWebSocket (url: string): WebSocket {
        const socketOptions = {
            maxReconnectionDelay: 10000,
            minReconnectionDelay: 1000,
            reconnectionDelayGrowFactor: 1.3,
            connectionTimeout: 10000,
            maxRetries: Infinity,
            debug: false
        };
        return new ReconnectingWebSocket(url, [], socketOptions) as WebSocket;
    }
    return webSocket;
}
