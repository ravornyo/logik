import { buildWorkerDefinition } from 'monaco-editor-workers';
buildWorkerDefinition('./monaco-editor-workers/workers', new URL('', window.location.href).href, false);

import 'reflect-metadata';

import { MonacoEditorLanguageClientWrapper } from 'monaco-editor-wrapper';
import { IActionDispatcher, TYPES, createRandomId } from 'sprotty';
import createContainer from './di.config';
import languageDef from './logik.monarch';
import { LanguageDiagramServer } from './diagram-server';
import sampleCode from './sample';
import { FitToScreenAction, RequestModelAction } from 'sprotty-protocol';
import { addDiagramStyles } from './diagram-css';

MonacoEditorLanguageClientWrapper.addMonacoStyles('monaco-editor-styles');
addDiagramStyles('diagram-styles');

// Create Sprotty viewer
const clientId = 'sprotty-canvas';
const sprottyContainer = createContainer(clientId);
const diagramServer = sprottyContainer.get<LanguageDiagramServer>(TYPES.ModelSource);
diagramServer.clientId = clientId;
const dispatcher = sprottyContainer.get<IActionDispatcher>(TYPES.IActionDispatcher);

function createLanguageClient():MonacoEditorLanguageClientWrapper {
    const client = new MonacoEditorLanguageClientWrapper(createRandomId(24));   
    const editorConfig = client.getEditorConfig();
    editorConfig.setMainLanguageId('logik');
    editorConfig.setMonarchTokensProvider(languageDef);

    //Setup default code
    let mainCode = sampleCode;
    /*
    if (window.localStorage) {
        const storedCode = window.localStorage.getItem('mainCode');
        if (storedCode !== null) {
            mainCode = storedCode;
        }
    }*/
    editorConfig.setMainCode(mainCode);
    editorConfig.setTheme('vs-dark')
    // use monaco-languageclient with web worker
    editorConfig.setUseLanguageClient(true);
    editorConfig.setUseWebSocket(false);

    // load worker
    const workerURL = new URL('./server.js', window.location.href).href;
    const lsWorker = new Worker(workerURL, {
        type: 'module',
        name: 'Logik Language Server'
    });

    client.setWorker(lsWorker);
    return client;
}

document.addEventListener("DOMContentLoaded", (event) => {
    const client = createLanguageClient();
    if (client.isStarted()) {
        alert('Editor was already started!');
        return;
    }
    client.startEditor(document.getElementById('monaco-editor-root') as HTMLElement)
        .then(async (s: unknown) => {
            diagramServer.bind(client.getLanguageClient());
            const sourceUri = client.getEditor()?.getModel()?.uri.toString();
            const setModel = await dispatcher.request(RequestModelAction.create({
                sourceUri: sourceUri? sourceUri: '',
            }));
            await dispatcher.dispatch(setModel);
            await dispatcher.dispatch(FitToScreenAction.create([]));
        })
        .catch((e: Error) => console.log(e));
});