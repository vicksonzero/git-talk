
export type Talk = {
    title: string;
    descriptions: string;
    aliases: string[];
    relatedFlows: { name: string, link: string }[];
    direction: 'up' | 'down' | 'left' | 'right';
    laneLabel: 'start' | 'end';
    slides: Slide[];
}

export type Slide = {
    title: string;
    descriptions: string;
    diagram: DiagramCommand[];
}

export type DiagramCommand = GitDiagramCommand | ControlsDiagramCommand;

;

export type GitDiagramCommand = CommitDiagramCommand
    | ForkDiagramCommand
    | MergeDiagramCommand
    | UpdateDiagramCommand
    | CherrypickDiagramCommand
    | RebaseDiagramCommand
    ;


export type CommitDiagramCommand = {
    commit: [node: string, newNodeID: string, title: string]
}
export type ForkDiagramCommand = {
    fork: [fromNode: string, newNodeID: string, branch: string, time: number, title: string]
}
export type MergeDiagramCommand = {
    merge: [fromNode: string, newNodeID: string, branch: string, time: number, title: string]
}
export type UpdateDiagramCommand = {
    update: [node: string, title: string]
}
export type CherrypickDiagramCommand = {
    cherrypick: [node: string, newNodeID: string, branch: string, time: number, title: string]
}
export type RebaseDiagramCommand = {
    rebase: [oldBase: string, branch: string, ontoNewBase: string]
}

export type ControlsDiagramCommand = BranchDiagramCommand
    | NodeDiagramCommand
    | ConnectDiagramCommand
    | AnimatedDiagramCommand
    | EraseDiagramCommand
    | DisableDiagramCommand
    | ClearDiagramCommand
    | ScrollDiagramCommand
    ;

export type Color = string | number;

export type BranchDiagramCommand = {
    branch: [branchID: string, afterBranch: string, color: Color, title: string]
}
export type NodeDiagramCommand = {
    node: [nodeID: string, branch: string, time: number, title: string]
}
export type ConnectDiagramCommand = {
    connect: [edgeID: string, node1: string, node2: string, title: string?]
}
export type AnimatedDiagramCommand = {
    animated: [true | false | "pop"]
}
export type EraseDiagramCommand = {
    erase: [string]
}
export type DisableDiagramCommand = {
    disable: [string]
}
export type ClearDiagramCommand = {
    clear: null
}
export type ScrollDiagramCommand = {
    scroll: [fromTime: number]
}