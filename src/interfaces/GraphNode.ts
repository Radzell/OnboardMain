import CSS from 'csstype';

export interface GraphNode {
    id: string,
    position: {
        x: number,
        y: number,
    },
    data: any,
    type?: string,
    style?: CSS.Properties,
    className?: string,
    targetPosition?: string,
    sourcePosition?: string,
    isHidden?: boolean,
    draggable?: boolean,
    connectable? :boolean,
    selectable?: boolean,
    dragHandle?: string
}