import { Container, ContainerModule } from 'inversify';
import { configureModelElement, configureViewerOptions, edgeIntersectionModule, 
    loadDefaultModules, LogLevel, SEdge, SGraph, SGraphView, TYPES,
    SNode, SLabel, SLabelView, ConsoleLogger, SPort, CircularNodeView, SCompartment, PolylineEdgeView, SCompartmentView, selectFeature } from 'sprotty';

import { OrGateView, AndGateView, NotGateView, VariableNodeView } from './views';
import { LanguageDiagramServer } from './diagram-server';
import { LogikContextMenuItemProvider, LogikContextMenuService } from './menu';
import { PopupModelProvider } from './popup';
import { LogikSvgExporter } from './svg-exporter';

export default (containerId: string) => {

    require("sprotty/css/sprotty.css");

    const logicModule = new ContainerModule((bind, unbind, isBound, rebind) => {
        bind(TYPES.ModelSource).to(LanguageDiagramServer).inSingletonScope();
        bind(TYPES.IContextMenuService).to( LogikContextMenuService);
        bind(TYPES.IContextMenuItemProvider).to(LogikContextMenuItemProvider);
        rebind(TYPES.SvgExporter).to( LogikSvgExporter);
        bind(TYPES.IPopupModelProvider).to(PopupModelProvider);
        rebind(TYPES.ILogger).to(ConsoleLogger).inSingletonScope();
        rebind(TYPES.LogLevel).toConstantValue(LogLevel.warn);

        const context = { bind, unbind, isBound, rebind };
        configureModelElement(container, 'graph', SGraph, SGraphView, { enable: [selectFeature] });
        configureModelElement(container, 'node:orGate', SNode, OrGateView, { enable: [selectFeature] });
        configureModelElement(container, 'node:andGate', SNode, AndGateView, { enable: [selectFeature] });
        configureModelElement(container, 'node:notGate', SNode, NotGateView, { enable: [selectFeature] });
        configureModelElement(container, 'node:variable', SNode, VariableNodeView, { enable: [selectFeature] });
        configureModelElement(container, 'label:variable', SLabel, SLabelView, { enable: [selectFeature] });
        configureModelElement(container, 'edge:connection', SEdge, PolylineEdgeView, { enable: [selectFeature] });
        configureModelElement(container, 'port', SPort, CircularNodeView);
        configureModelElement(container, 'node:compartment', SCompartment, SCompartmentView, { enable: [selectFeature] });

        configureViewerOptions(context, {
            needsClientLayout: true,
            needsServerLayout: true,
            baseDiv: containerId
        });

    });

    const container = new Container();
    loadDefaultModules(container);
    container.load(edgeIntersectionModule)
    container.load(logicModule);
    return container;
}

