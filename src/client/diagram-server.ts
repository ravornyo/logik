import { injectable } from "inversify";
import { MonacoLanguageClient } from "monaco-languageclient";
import { DiagramServerProxy } from "sprotty";
import { ActionMessage } from "sprotty-protocol";

const DIAGRAM_ENDPOINT_NOTIFICATION = 'diagram/accept';
const DID_CLOSE_NOTIFICATION = 'diagram/didClose';

@injectable()
export class LanguageDiagramServer extends DiagramServerProxy {

    protected languageClient?:MonacoLanguageClient;

    bind(languageClient?:MonacoLanguageClient) {
        languageClient?.onNotification(DIAGRAM_ENDPOINT_NOTIFICATION, (message: ActionMessage) => {
            this.messageReceived(message);
        });
        this.languageClient = languageClient;
    }

    disconnect() {
        if (this.languageClient !== undefined) {
            this.languageClient.sendNotification(DID_CLOSE_NOTIFICATION, this.clientId);
        }
    }

    protected sendMessage(message: ActionMessage): void {
        if (this.languageClient !== undefined) {
            this.languageClient.sendNotification(DIAGRAM_ENDPOINT_NOTIFICATION, message);
        }
    }

}