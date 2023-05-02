
const css = `svg.sprotty-graph {
        margin-top: 15px;
        width: 100%;
        height: 100%;
        border-style: none;
        border-width: 0px;
        stroke: transparent;
        stroke-width: 0px;
        outline:none;
    }
    .sprotty-popup {
        background: none;
        border-radius: 0px;
        border: none;
        min-width: 24px;
    }
    .sprotty-popup svg {
        width: 24px;
        height: 24px;
    }
    .sprotty-node {
        stroke: #d4d4d4;
        stroke-width: 2px;
        fill: none;
    }
    
    .sprotty-label {
        fill: #d4d4d4;
        font-size: 12px;
    }
    .sprotty-label.selected {
        fill: #3794ff;
    }
    
    .sprotty-edge {
        fill: none;
        stroke: #d4d4d4;
        stroke-width: 2;
    }
    
    .intersection {
        fill: #d4d4d4;
    }
    
    .sprotty-node.mouseover {
        stroke: #3794ff;
    }
    
    .sprotty-node.selected {
        stroke: #3794ff;
    }
    .sprotty-edge.selected{
        stroke: #3794ff;
        stroke-width: 2;
    }
    .intersection.selected{
        fill: #3794ff;
    }
    .logik-context-menu {
        background-color:#3c3c3c;
        display: flex;
        flex-direction: column;
        position: fixed;
        box-shadow:0 2px 8px rgb(0,0,0,16%)
        border-radius: 5px;
        font-size: 12px;
    } 
    .logik-context-menu-item {   
        min-width: 160px;
        cursor: default;
    } 
    .logik-context-menu-item {
        color:#f0f0f0;
        padding: 5px 0px;
    }
    .logik-context-menu-item:last-child {
        padding-bottom: 10px;
    }
    .logik-context-menu-item.disabled-action {
        color: darkgray;
    }  
    .logik-context-menu-item:empty {
        padding: 0px;
        border-bottom: 1px solid #606060;
        margin-top: 5px;
        margin-bottom: 5px;
    }  
    .logik-context-menu-item:hover:not(.disabled-action) {
        color: #ffffff;
        background-color:#3794ff;
    }
    `
export function addDiagramStyles(idOfStyleElement: string) {
    const style = document.createElement('style');
    style.id = idOfStyleElement;
    style.innerHTML = css;
    document.head.appendChild(style);
}