import { inject, injectable } from "inversify";
import { Anchor, EMPTY_ROOT, GetSelectionAction, IActionDispatcher, IContextMenuItemProvider, IContextMenuService, LabeledAction, MenuItem, RequestExportSvgAction, SelectionResult, SModelRoot, TYPES, ViewerOptions } from "sprotty";
import { CenterAction, FitToScreenAction, Point, SetPopupModelAction } from "sprotty-protocol";

@injectable()
export class LogikContextMenuService implements IContextMenuService {

    @inject(TYPES.IActionDispatcher) 
    protected actionDispatcher!: IActionDispatcher;
    @inject(TYPES.ViewerOptions)
    protected viewerOptions!: ViewerOptions;

    show(items: MenuItem[], anchor: Anchor, onHide?: (() => void) | undefined): void {
        this.actionDispatcher.dispatch(SetPopupModelAction.create(EMPTY_ROOT))
        const container = document.getElementById(this.viewerOptions.baseDiv);
        let menuNode: HTMLDivElement;
        const hideMenu = () => {
            container?.removeChild(menuNode);
            if (onHide) {
                onHide()
            }
        }
        menuNode = this.createMenu(items, hideMenu);
        menuNode.style.top = (anchor.y - 5) + 'px'
        menuNode.style.left = (anchor.x - 5) + 'px'

        container?.appendChild(menuNode);
        menuNode.onmouseleave = (e: MouseEvent) => hideMenu();
    }

    protected createMenu(items: MenuItem[], closeCallback: () => void): HTMLDivElement {
        const menuNode = document.createElement('div');
        menuNode.id = 'logik-context-menu';
        menuNode.classList.add('logik-context-menu');
        items.forEach((item, index) => {
            const menuItem = document.createElement('div');
            menuItem.id = 'logik-context-menu-item-' + index;
            menuItem.classList.add('logik-context-menu-item');
            const itemEnabled = item.isEnabled ? item.isEnabled() : true;
            if (!itemEnabled)
                menuItem.classList.add('disabled-action');
            menuItem.textContent = item.label;
            menuItem.onclick = (e: MouseEvent) => {
                closeCallback();
                if (itemEnabled && item.actions.length > 0) {
                    this.actionDispatcher.dispatchAll(item.actions);
                }
            }
            menuNode.appendChild(menuItem);
        });
        return menuNode;
    }
}

@injectable()
export class LogikContextMenuItemProvider implements IContextMenuItemProvider {

    @inject(TYPES.IActionDispatcher)
    protected actionDispatcher!: IActionDispatcher;

    async getItems(root: Readonly<SModelRoot>, lastMousePosition?: Point | undefined): Promise<LabeledAction[]> {
            const selectionResult = await this.actionDispatcher.request<SelectionResult>(GetSelectionAction.create())
            return [
                new LabeledAction('Fit Diagram to Screen', [FitToScreenAction.create(root.children.map(child => child.id))]),
                new LabeledAction('Center Selection', [CenterAction.create(selectionResult.selectedElementsIDs)]),
                new LabeledAction('', []),
                new LabeledAction('Export SVG', [RequestExportSvgAction.create()])
            ];
    }

}