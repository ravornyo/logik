import { injectable } from "inversify";
import { SModelRoot, SvgExporter } from "sprotty";

@injectable()
export class LogikSvgExporter extends SvgExporter {
    protected override createSvg(svgElementOrig: SVGSVGElement, root: SModelRoot): string {
        const serializer = new XMLSerializer();
        const svgCopy = serializer.serializeToString(svgElementOrig);
        const iframe: HTMLIFrameElement = document.createElement('iframe');
        document.body.appendChild(iframe);
        if (!iframe.contentWindow)
            throw new Error('IFrame has no contentWindow');
        const docCopy = iframe.contentWindow.document;
        docCopy.open();
        docCopy.write(svgCopy);
        docCopy.close();
        const svgElementNew = docCopy.getElementById(svgElementOrig.id)!;
        svgElementNew.removeAttribute('opacity');
        this.copyStyles(svgElementOrig, svgElementNew, ['width', 'height', 'opacity']);
        svgElementNew.setAttribute('version', '1.1');
        const bounds = this.getBounds(root);
        svgElementNew.setAttribute('viewBox', `${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}`);
        svgElementNew.removeAttribute('style');
        let svgCode = serializer.serializeToString(svgElementNew);
        document.body.removeChild(iframe);
        svgCode = svgCode.replaceAll('rgb(212, 212, 212', 'rgb(43, 43, 43');
        return svgCode;
    }
}