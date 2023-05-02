import { injectable } from "inversify";
import { IPopupModelProvider } from 'sprotty';
import { RequestPopupModelAction, SModelElement, SModelRoot } from "sprotty-protocol";

@injectable()
export class PopupModelProvider implements IPopupModelProvider {
    getPopupModel(request: RequestPopupModelAction, element?: SModelElement | undefined): SModelRoot | undefined {
        return undefined;
    }
}