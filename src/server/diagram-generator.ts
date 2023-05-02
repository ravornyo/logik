import { GeneratorContext, IdCache, LangiumDiagramGenerator } from 'langium-sprotty';
import { SEdge, SLabel, SModelElement, SCompartment, SModelRoot, SNode, SPort } from 'sprotty-protocol';
import { AndLogic, Expression, OrLogic, Program, Variable, isAndLogic, isNotLogic, isOrLogic, NotLogic, isVariable } from './language/ast';

export class LogikDiagramGenerator extends LangiumDiagramGenerator {

    protected override generateRoot(args: GeneratorContext<Program>): SModelRoot | Promise<SModelRoot> {
        const { document, idCache } = args;
        const program: Program = document.parseResult.value;

        program.variables.forEach(variable => {
            if(variable.expression){
                this.flattenExpression(variable.expression);
            }
        });

        return this.generateProgramNode(program, idCache);
    }

    generateProgramNode(program: Program, idCache: IdCache): SModelRoot{
        program.variables.forEach(variable => {
            if(variable.expression){
                this.flattenExpression(variable.expression);
            }
        });
        const nodes: SModelElement[] = [];
        program.variables.forEach((expression: Expression) => {
            const children: SModelElement[] = [];
            this.createNode(children, expression, idCache, '');
            nodes.push(<SCompartment>{
                type: 'node:compartment',
                id: idCache.uniqueId('compartment'),
                resizeContainer: true,
                children,
                properties: {
                    'org.eclipse.elk.direction': 'RIGHT',
                    'org.eclipse.elk.spacing.nodeNode': '30.0',
                    'org.eclipse.elk.spacing.labelLabel': '10.0',
                    'org.eclipse.elk.spacing.labelNode': '10.0',
                    'org.eclipse.elk.nodeLabels.padding': '[top=10.0,left=10.0,bottom=10.0,right=10.0]',
                    'org.eclipse.elk.layered.layering.strategy': 'INTERACTIVE',
                    'org.eclipse.elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
                    'org.eclipse.elk.edgeRouting': 'ORTHOGONAL'
                }              
            });
        });

        return <SModelRoot>{
            type: 'graph',
            id: 'root',
            children: nodes
        };
    }

    private flattenExpression(expression: Expression){
        if(isAndLogic(expression) || isOrLogic(expression)){
            expression.inputs = expression.inputs.reduce<Expression[]>((accumulator:Expression[], input:Expression) => {
                (expression.$type === input.$type)? accumulator.push(...input.inputs): accumulator.push(input)
                return accumulator;
            }, [])
            expression.inputs.forEach((input:Expression) => this.flattenExpression(input))
        } 
    }

    private createNode(nodes:SModelElement[], expression:Expression, idCache:IdCache, parentId:string|undefined) {
        if(isVariable(expression)){
           return this.createVariableNode(nodes, expression, idCache, parentId);
        } else if(isAndLogic(expression)){
           return this.createAndNode(nodes, expression, idCache, parentId);
        } else if(isOrLogic(expression)){
           return this.createOrNode(nodes, expression, idCache, parentId);
        } else if(isNotLogic(expression)){       
            return this.createNotNode(nodes, expression, idCache, parentId);      
        } else {
            return [];
        }
    }
    
    private createVariableNode(nodes:SModelElement[], variable:Variable, idCache:IdCache, parentId:string|undefined){
        const nodeId = idCache.uniqueId(variable.name);
        const xPadding = 0;
        const yPadding = 0;
        const fontSize = 12;
        const width = Math.max(45, Math.round(this.measureText(variable.name, fontSize) + (2 * xPadding)));
        const height = fontSize + (2 * yPadding);

        nodes.push(<SNode>{
            id: nodeId,
            type: 'node:variable',
            size: { width, height },
            properties: {
                'portConstraints': 'FIXED_SIDE',
                'portAlignment': 'CENTER'
            },
            ports: [
                this.createPort((idCache.uniqueId(nodeId + '.port.' + (variable.expression? 'in': 'out'))), 1, (variable.expression? 'EAST': 'WEST'))
            ],
            children: [
                <SLabel>{
                    type: 'label:variable',
                    id: idCache.uniqueId(nodeId +'.label'),
                    text: variable.name
                }
            ]
        });
        if(parentId){
            const edgeId = idCache.uniqueId('conn');
            nodes.push(this.createEdge(edgeId, nodeId, (nodeId + '.port.out'), parentId, (parentId + '.port.in')))
        }
        if(variable.expression){
            this.createNode(nodes, variable.expression, idCache, nodeId);
        }
        return nodes;
    }
    
    private createOrNode(nodes:SModelElement[], orLogic: OrLogic, idCache:IdCache, parentId:string|undefined) {
        const nodeId = idCache.uniqueId('or');
        nodes.push(<SNode>{
            id: nodeId,
            type: 'node:orGate',
            size: {
                width: 30,
                height: 25
            },
            properties: {
                'portConstraints': 'FIXED_SIDE',
                'portAlignment': 'CENTER'
            },
            ports: [
                this.createPort(idCache.uniqueId(nodeId + '.port.in'), 1, 'EAST'),
                this.createPort(idCache.uniqueId(nodeId + '.port.out'), 2, 'WEST')
            ]
        });
        if(parentId){
            const edgeId = idCache.uniqueId('conn');
            nodes.push(this.createEdge(edgeId, nodeId, (nodeId + '.port.out'), parentId, (parentId + '.port.in')))
        }
        orLogic.inputs.forEach((input: Expression) => this.createNode(nodes, input, idCache, nodeId))
        return nodes;
    }
    
    private createAndNode(nodes:SModelElement[], orLogic: AndLogic, idCache:IdCache, parentId:string|undefined) {
        const nodeId = idCache.uniqueId('and');
        nodes.push(<SNode>{
            id: nodeId,
            type: 'node:andGate',
            size: {
                width: 30,
                height: 25
            },
            properties: {
                'portConstraints': 'FIXED_SIDE',
                'portAlignment': 'CENTER'
            },
            ports: [
                this.createPort(idCache.uniqueId(nodeId + '.port.in'), 1, 'EAST'),
                this.createPort(idCache.uniqueId(nodeId + '.port.out'), 2, 'WEST')
            ]
        });
        if(parentId){
            const edgeId = idCache.uniqueId('edge');
            nodes.push(this.createEdge(edgeId, nodeId, (nodeId + '.port.out'), parentId, (parentId + '.port.in')))
        }
        orLogic.inputs.forEach((input:Expression) => this.createNode(nodes, input, idCache, nodeId))
        return nodes;
    }
    
    private createNotNode(nodes:SModelElement[], notLogic:NotLogic, idCache:IdCache, parentId:string|undefined) {
        const nodeId = idCache.uniqueId('not');
        nodes.push(<SNode>{
            id: nodeId,
            type: 'node:notGate',
            size: {
                width: 30,
                height: 20
            },
            properties: {
                'portConstraints': 'FIXED_SIDE',
                'portAlignment': 'CENTER'
            },
            ports: [
                this.createPort(idCache.uniqueId(nodeId + '.port.in'), 1, 'EAST'),
                this.createPort(idCache.uniqueId(nodeId + '.port.in'), 2, 'WEST')
            ]
        });
        if(parentId){
            const edgeId = idCache.uniqueId('edge');
            nodes.push(this.createEdge(edgeId, nodeId, (nodeId + '.port.out'), parentId, (parentId + '.port.in')))
        }
        if(notLogic.input){
            this.createNode(nodes, notLogic.input, idCache, nodeId);
        }
    }

    private createPort(id:string, index:number, side:string):SPort{
        return <SPort>{
            type: 'port',
            id,
            width: 2,
            height: 2,
            properties: {
                'port.side': side,
                'port.index': index,
                'allowNonFlowPortsToSwitchSides': true
            }
        }
    }

    private createEdge(id:string, source:string, sourcePort:string, target:string, targetPort:string): SEdge{
        return <SEdge>{ type: 'edge:connection', id, source, sourceId:source, sourcePort, target, targetId:target, targetPort }
    }

    widths = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.2796875,0.2765625,
        0.3546875,0.5546875,0.5546875,0.8890625,0.665625,0.190625,0.3328125,0.3328125,0.3890625,
        0.5828125,0.2765625,0.3328125,0.2765625,0.3015625,0.5546875,0.5546875,0.5546875,0.5546875,
        0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.5546875,0.2765625,0.2765625,0.584375,
        0.5828125,0.584375,0.5546875,1.0140625,0.665625,0.665625,0.721875,0.721875,0.665625,0.609375,
        0.7765625,0.721875,0.2765625,0.5,0.665625,0.5546875,0.8328125,0.721875,0.7765625,0.665625,
        0.7765625,0.721875,0.665625,0.609375,0.721875,0.665625,0.94375,0.665625,0.665625,0.609375,
        0.2765625,0.3546875,0.2765625,0.4765625,0.5546875,0.3328125,0.5546875,0.5546875,0.5,0.5546875,
        0.5546875,0.2765625,0.5546875,0.5546875,0.221875,0.240625,0.5,0.221875,0.8328125,0.5546875,
        0.5546875,0.5546875,0.5546875,0.3328125,0.5,0.2765625,0.5546875,0.5,0.721875,0.5,0.5,0.5,
        0.3546875,0.259375,0.353125,0.5890625]
    avg = 0.5279276315789471;

    private measureText(str:string, fontSize:number) {
        return Array.from(str).reduce( (acc, cur) => acc + (this.widths[cur.charCodeAt(0)] ?? this.avg), 0
    ) * fontSize
}

}