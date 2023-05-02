/** @jsx svg */
import "reflect-metadata";
import { injectable } from "inversify";
import { VNode } from 'snabbdom';
import { IViewArgs, Point, PolylineEdgeView, RenderingContext, SEdge, SNode, SPort, ShapeView, isIntersectingRoutedPoint, svg } from 'sprotty';

@injectable()
export class OrGateView extends ShapeView {
    render(node: Readonly<SNode>, context: RenderingContext, args?: IViewArgs | undefined): VNode | undefined {
        return <g class-sprotty-node={node instanceof SNode} class-sprotty-port={node instanceof SPort}
        class-mouseover={node.hoverFeedback} class-selected={node.selected}>
                    <path d="M0,0 A30 25 0 0 1 0,25 A30 25 0 0 0 30,12.5 A30 25 0 0 0 0,0" />  
                    {context.renderChildren(node)}           
                </g>;
    }
}

@injectable()
export class AndGateView extends ShapeView {
    render(node: Readonly<SNode>, context: RenderingContext, args?: IViewArgs | undefined): VNode | undefined {
        return <g class-sprotty-node={node instanceof SNode} class-sprotty-port={node instanceof SPort}
        class-mouseover={node.hoverFeedback} class-selected={node.selected}>
                    <path d="M0,0 L0,25 L15,25 A15 12.5 0 0 0 15,0 Z" /> 
                    {context.renderChildren(node)}           
                </g>;
    }
}

@injectable()
export class NotGateView extends ShapeView {
    render(node: Readonly<SNode>, context: RenderingContext, args?: IViewArgs | undefined): VNode | undefined {
        return <g class-sprotty-node={node instanceof SNode} class-sprotty-port={node instanceof SPort}
        class-mouseover={node.hoverFeedback} class-selected={node.selected}>
                    <path d="M0,0 L0,20 L20,10 Z" />  
                    <circle cx="24" cy="10" r="3"/> 
                    {context.renderChildren(node)}           
                </g>;
    }
}

@injectable()
export class VariableNodeView extends ShapeView {
    render(node: Readonly<SNode>, context: RenderingContext, args?: IViewArgs): VNode | undefined {
        return <g>
            <rect class-sprotty-node={node instanceof SNode} class-sprotty-port={node instanceof SPort}
                  class-mouseover={node.hoverFeedback} class-selected={node.selected}
                  x="0" y="0" width={Math.max(node.size.width, 0)} height={Math.max(node.size.height, 0)} rx="5" ></rect>
            {context.renderChildren(node)}
        </g>;
    }
}

export class LogicConnectionView extends PolylineEdgeView {

    protected override renderLine(edge: SEdge, segments: Point[], context: RenderingContext, args?: IViewArgs): VNode {
        let path = '';
        const g: VNode[] = [];
        for (let i = 0; i < segments.length; i++) {
            const p = segments[i];
            if (i === 0) {
                path = `M ${p.x},${p.y}`;
            }
            
            if (i !== 0) {
                path += ` L ${p.x},${p.y}`;
            }
            if (isIntersectingRoutedPoint(p)) {
                p.intersections.forEach(intersection => {
                    const pt = intersection.intersectionPoint;
                    g.push(<circle 
                        class-intersection={true} 
                        class-mouseover={edge.hoverFeedback} 
                        class-selected={edge.selected} 
                        cx={pt.x} cy={pt.y} r={2} 
                    />);
                })
                
            }
        }
        if (g.length > 0) {
            return <g class-sprotty-edge={edge instanceof SEdge} class-mouseover={edge.hoverFeedback} class-selected={edge.selected}>
                <path d={path} />
                {g.map(node => node)}            
            </g>
        } else {
            return <path d={path} />;
        }      
    }
}