import { LayoutOptions } from 'elkjs';
import { DefaultLayoutConfigurator } from 'sprotty-elk/lib/elk-layout';
import { SGraph, SLabel, SModelIndex, SNode, SPort } from 'sprotty-protocol';


export class LogikLayoutConfigurator extends DefaultLayoutConfigurator {

    protected override graphOptions(sgraph: SGraph, index: SModelIndex): LayoutOptions {
        const properties = (sgraph as any).properties || {};
        return {
            'org.eclipse.elk.direction': 'BOTTOM',
            'org.eclipse.elk.spacing.nodeNode': '70.0',
            'org.eclipse.elk.spacing.labelLabel': '10.0',
            'org.eclipse.elk.spacing.labelNode': '10.0',
            'org.eclipse.elk.nodeLabels.padding': '[top=10.0,left=10.0,bottom=10.0,right=10.0]',
            //'org.eclipse.elk.edgeRouting': 'ORTHOGONAL',
            ...properties
        };
    }

    protected override nodeOptions(snode: SNode, index: SModelIndex): LayoutOptions {
        const properties = (snode as any).properties || {};
        return {
            'org.eclipse.elk.nodeLabels.placement': '[H_CENTER, V_CENTER, INSIDE]',
            'org.eclipse.elk.nodeLabels.padding': '[top=10.0,left=10.0,bottom=10.0,right=10.0]',
            'org.eclipse.elk.spacing.labelNode': '10.0',
            ...properties
        }
    }

    protected override labelOptions(slabel: SLabel, index: SModelIndex): LayoutOptions | undefined {
        const properties = (slabel as any).properties || {};
        return {
            'org.eclipse.elk.spacing.labelNode': '10.0',
            'org.eclipse.elk.spacing.labelLabel': '10.0',
            ...properties
        }
    }

    protected override portOptions(sport: SPort, index: SModelIndex): LayoutOptions {
        const properties = (sport as any).properties || {};
        return {
            'org.eclipse.elk.port.allowNonFlowPortsToSwitchSides': 'false',
            ...properties
        };
    }

}