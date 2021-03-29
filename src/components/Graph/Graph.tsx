import React, { useMemo, useState, useEffect } from 'react';
import { CommitDiagramCommand, Talk, ForkDiagramCommand, MergeDiagramCommand, UpdateDiagramCommand, CherrypickDiagramCommand, RebaseDiagramCommand, BranchDiagramCommand, NodeDiagramCommand, ConnectDiagramCommand, AnimatedDiagramCommand, EraseDiagramCommand, DisableDiagramCommand, ClearDiagramCommand, ScrollDiagramCommand, Color } from '../../model/Talk';
import * as styles from './Graph.module.scss';

type Branch = { branchID: string, color: Color, title: string, x: number }
type Node = { nodeID: string, branch: string, time: number, title: string, x: number, y: number, color: Color }
type Edge = { edgeID: string, node1: string, node2: string, isMerge: boolean, title: string, fromX: number, fromY: number, toX: number, toY: number, color: Color }

type DiagramStore = {
    branches: Branch[],
    nodes: Node[],
    edges: Edge[],
    ids: string[],
}

type GraphProps = {
    talkData: Talk;
    pageId: number;
};

export const Graph = (props: GraphProps) => {
    const { talkData, pageId } = props;

    const [stepID, setStepID] = useState(0);

    useEffect(() => {
        setStepID(0);
    }, [talkData, pageId]);

    const BRANCH_WIDTH = 70;
    const BRANCH_GAP = 10;
    const BRANCH_OPACITY = 0.1;
    const TIME_HEIGHT = 40;
    const PATH_LEAD = TIME_HEIGHT / 2;
    const DIAGRAM_MIN_HEIGHT = 500;
    const LINE_WIDTH = 3;
    const DOT_RADIUS = 7;
    const DOT_STROKE_WIDTH = 2;

    const diagramDirection = talkData.direction;
    const labelDirection = talkData.branchLabelDir;

    const [cache, setCache] = useState<{ [x: string]: DiagramStore }>({});

    const content = useMemo<React.SVGProps<SVGElement>[] | JSX.Element>(() => {
        const oldContent = cache['' + (pageId - 1)] ?? {
            branches: [] as Branch[],
            nodes: [] as Node[],
            edges: [] as Edge[],
            ids: [] as string[],
        };

        console.log('oldContent', oldContent);

        const diagram = talkData.slides[pageId]?.diagram ?? [];
        const diagramStore = {
            branches: [...oldContent.branches] as Branch[],
            nodes: [...oldContent.nodes] as Node[],
            edges: [...oldContent.edges] as Edge[],
            ids: [...oldContent.ids] as string[],
        };

        for (let i = 0; i < stepID; i++) {
            const cmd = diagram[i];
            // git operations
            if ((cmd as CommitDiagramCommand).commit) {
                const [node, newNodeID, title] = (cmd as CommitDiagramCommand).commit;
            }
            if ((cmd as CommitDiagramCommand).commit) {
                const [node, newNodeID, title] = (cmd as CommitDiagramCommand).commit;
                const commitOldNode = diagramStore.nodes.find(n => n.nodeID === node);
                if (!commitOldNode) throw new Error(`Command "commit": source node "${node}" not found.`);
                if (diagramStore.ids.includes(newNodeID)) throw new Error(`Duplicate id "${newNodeID}". Please use a unique ID for every branch, nodes, edges, etc.`);
                diagramStore.ids.push(newNodeID);

                const newNode: Node = { nodeID: newNodeID, branch: commitOldNode.branch, time: commitOldNode.time + 1, title, x: 0, y: 0, color: 'black' };
                diagramStore.nodes.push(newNode);
                const newEdge = { edgeID: `auto_edge: ${node}-${newNodeID}`, node1: node, node2: newNodeID, isMerge: false, title: '', fromX: 0, fromY: 0, toX: 0, toY: 0, color: 'black' };
                diagramStore.edges.push(newEdge);
            }
            if ((cmd as ForkDiagramCommand).fork) {
                const [fromNode, newNodeID, branch, time, title] = (cmd as ForkDiagramCommand).fork;
                const commitOldNode = diagramStore.nodes.find(n => n.nodeID === fromNode);
                if (!commitOldNode) throw new Error(`Command "fork": source node "${fromNode}" not found.`);
                if (diagramStore.ids.includes(newNodeID)) throw new Error(`Duplicate id "${newNodeID}". Please use a unique ID for every branch, nodes, edges, etc.`);
                diagramStore.ids.push(newNodeID);

                const newNode: Node = { nodeID: newNodeID, branch: branch, time, title, x: 0, y: 0, color: 'black' };
                diagramStore.nodes.push(newNode);
                const newEdge = { edgeID: `auto_edge: ${fromNode}-${newNodeID}`, node1: fromNode, node2: newNodeID, isMerge: false, title: '', fromX: 0, fromY: 0, toX: 0, toY: 0, color: 'black' };
                diagramStore.edges.push(newEdge);
            }
            if ((cmd as MergeDiagramCommand).merge) {
                const [fromNode, newNodeID, branch, time, title] = (cmd as MergeDiagramCommand).merge;
                const commitOldNode = diagramStore.nodes.find(n => n.nodeID === fromNode);
                if (!commitOldNode) throw new Error(`Command "merge": source node "${fromNode}" not found.`);
                const commitNewNode = diagramStore.nodes.find(n => n.nodeID === fromNode);
                if (!commitNewNode) throw new Error(`Command "merge": new node "${newNodeID}" conflicts with existing node "${newNodeID}". Must use a unique name`);

                const mergeParentNodes = diagramStore.nodes.filter(n => n.branch === branch);
                const mergeParentTime = mergeParentNodes.reduce((acc, n) => Math.max(acc, n.time), 0);
                const mergeParentNode = mergeParentNodes.find(n => n.time === mergeParentTime);
                if (!mergeParentNode) throw new Error(`Command "merge": new node "${newNodeID}" cannot find a parent node to merge into branch "${branch}"`);

                if (diagramStore.ids.includes(newNodeID)) throw new Error(`Duplicate id "${newNodeID}". Please use a unique ID for every branch, nodes, edges, etc.`);
                diagramStore.ids.push(newNodeID);

                const newNode: Node = { nodeID: newNodeID, branch: branch, time, title, x: 0, y: 0, color: 'black' };
                diagramStore.nodes.push(newNode);

                const newEdgeID = `auto_edge: ${fromNode}-${newNodeID}`;
                if (diagramStore.ids.includes(newEdgeID)) throw new Error(`Duplicate id "${newEdgeID}". Please use a unique ID for every branch, nodes, edges, etc.`);
                diagramStore.ids.push(newEdgeID);
                const newEdge = { edgeID: newEdgeID, node1: fromNode, node2: newNodeID, isMerge: true, title: '', fromX: 0, fromY: 0, toX: 0, toY: 0, color: 'black' };
                diagramStore.edges.push(newEdge);

                const newEdgeID2 = `auto_edge: ${mergeParentNode.nodeID}-${newNodeID}`;
                if (diagramStore.ids.includes(newEdgeID2)) throw new Error(`Duplicate id "${newEdgeID2}". Please use a unique ID for every branch, nodes, edges, etc.`);
                diagramStore.ids.push(newEdgeID2);
                const newEdge2 = { edgeID: newEdgeID2, node1: mergeParentNode.nodeID, node2: newNodeID, isMerge: true, title: '', fromX: 0, fromY: 0, toX: 0, toY: 0, color: 'black' };
                diagramStore.edges.push(newEdge2);
            }
            if ((cmd as UpdateDiagramCommand).update) {
                const [node, title] = (cmd as UpdateDiagramCommand).update;
            }
            if ((cmd as CherrypickDiagramCommand).cherrypick) {
                const [node, newNodeID, branch, time, title] = (cmd as CherrypickDiagramCommand).cherrypick;
            }
            if ((cmd as RebaseDiagramCommand).rebase) {
                const [oldBase, branch, ontoNewBase] = (cmd as RebaseDiagramCommand).rebase;
            }

            // controls
            if ((cmd as BranchDiagramCommand).branch) {
                const [branchID, afterBranch, color, title] = (cmd as BranchDiagramCommand).branch;
                if (diagramStore.ids.includes(branchID)) throw new Error(`Duplicate id "${branchID}". Please use a unique ID for every branch, nodes, edges, etc.`);
                diagramStore.ids.push(branchID);
                const newBranch: Branch = { branchID, color, title, x: 0 };
                const afterBranchIndex = (diagramStore.branches.findIndex(b => b.branchID === afterBranch) ?? -1) + 1;
                diagramStore.branches.splice(afterBranchIndex, 0, newBranch);
            }
            if ((cmd as NodeDiagramCommand).node) {
                const [nodeID, branch, time, title] = (cmd as NodeDiagramCommand).node;
                if (diagramStore.ids.includes(nodeID)) throw new Error(`Duplicate id "${nodeID}". Please use a unique ID for every branch, nodes, edges, etc.`);
                diagramStore.ids.push(nodeID);

                const newNode: Node = { nodeID, branch, time, title, x: 0, y: 0, color: 'black' };
                diagramStore.nodes.push(newNode);
            }
            if ((cmd as ConnectDiagramCommand).connect) {
                const [edgeID, node1, node2, isMerge, title = ''] = (cmd as ConnectDiagramCommand).connect;
                if (diagramStore.ids.includes(edgeID)) throw new Error(`Duplicate id "${edgeID}". Please use a unique ID for every branch, nodes, edges, etc.`);
                diagramStore.ids.push(edgeID);

                const newEdge = { edgeID, node1, node2, isMerge, title, fromX: 0, fromY: 0, toX: 0, toY: 0, color: 'black' };
                diagramStore.edges.push(newEdge);
            }
            if ((cmd as AnimatedDiagramCommand).animated) {
                const [value] = (cmd as AnimatedDiagramCommand).animated;
            }
            if ((cmd as EraseDiagramCommand).erase) {
                const [string] = (cmd as EraseDiagramCommand).erase;
            }
            if ((cmd as DisableDiagramCommand).disable) {
                const [string] = (cmd as DisableDiagramCommand).disable;
            }
            if ((cmd as ClearDiagramCommand).clear !== (void 0)) {

            }
            if ((cmd as ScrollDiagramCommand).scroll) {
                const [fromTime] = (cmd as ScrollDiagramCommand).scroll;
            }
            // throw new Error(`Unknown command: ${JSON.stringify(cmd)}`);
        }

        const totalTime = diagramStore.nodes.reduce((acc, node) => { return Math.max(acc, node.time) }, 0);

        const startX = (BRANCH_WIDTH + BRANCH_GAP) / 2;
        const startY = Math.max(DIAGRAM_MIN_HEIGHT - TIME_HEIGHT / 2, (totalTime + 2) * TIME_HEIGHT);

        diagramStore.branches = diagramStore.branches.map((b, i) => {
            const { branchID, color, title } = b;
            const branchX = startX + (BRANCH_WIDTH + BRANCH_GAP) * i;
            return { branchID, color, title, x: branchX };
        });
        diagramStore.nodes = diagramStore.nodes.map((n, i) => {
            const { nodeID, branch, time, title } = n;
            const nodeBranch = diagramStore.branches.find(b => b.branchID === branch);
            if (!nodeBranch) throw new Error(`Branch for node "${nodeID}" not found. expected "${branch}"`);
            const nodeX = nodeBranch.x;
            const nodeY = startY - TIME_HEIGHT * (time + 1);
            return { nodeID, branch, time, title, x: nodeX, y: nodeY, color: nodeBranch.color };
        });
        diagramStore.edges = diagramStore.edges.map((e, i) => {
            const { edgeID, node1, node2, title, isMerge } = e;
            const edgeNode1 = diagramStore.nodes.find(n => n.nodeID === node1);
            if (!edgeNode1) throw new Error(`Node1 for edge "${edgeID}" not found. expected "${node1}"`);
            const edgeNode2 = diagramStore.nodes.find(n => n.nodeID === node2);
            if (!edgeNode2) throw new Error(`Node2 for edge "${edgeID}" not found. expected "${node2}"`);

            const colorNode = (isMerge ? edgeNode1 : edgeNode2);
            const colorBranch = diagramStore.branches.find(b => b.branchID === colorNode.branch);
            if (!colorBranch) throw new Error(`Branch for colorNode "${colorNode.nodeID}" not found. expected "${colorNode.branch}"`);

            const fromX = edgeNode1.x;
            const fromY = edgeNode1.y;
            const toX = edgeNode2.x;
            const toY = edgeNode2.y;
            const color = colorBranch.color;
            return { edgeID, node1, node2, isMerge, title, fromX, fromY, toX, toY, color };
        });


        cache[pageId] = JSON.parse(JSON.stringify(diagramStore));
        setCache(cache);
        console.log('cache', cache[pageId]);

        console.log('newContent');
        const newContent = (
            <>
                <g id="branches">
                    {diagramStore.branches.map((b, i) => {
                        const { branchID, color, title, x } = b;
                        return (
                            <g data-type="branch" data-name={branchID} key={branchID}>
                                <line x1={x} y1={startY} x2={x} y2={0} stroke={color} strokeWidth={LINE_WIDTH} opacity={BRANCH_OPACITY} />
                                <rect x={x - BRANCH_WIDTH / 2} y={startY - TIME_HEIGHT / 2} width={BRANCH_WIDTH} height={TIME_HEIGHT} fill={color} />
                                <text x={x} y={startY} className={styles.branchTitleLabel}>{title}</text>
                            </g>
                        );
                    })}
                </g>
                <g id="edges">
                    {diagramStore.edges.map((e, i) => {
                        const { edgeID, node1, node2, title, fromX, fromY, toX, toY, color, isMerge } = e;

                        let line = <line x1={fromX} y1={fromY} x2={toX} y2={toY} stroke={color} strokeWidth={LINE_WIDTH} />
                        if (fromX !== toX) {
                            const dir = Math.sign(toX - fromX);
                            const pathStr = (isMerge ?
                                [
                                    `M`, `${fromX} ${fromY}`,
                                    (`L ${fromX},${toY + TIME_HEIGHT}`),
                                    `C`, [
                                        `${fromX},${toY + PATH_LEAD}`,
                                        `${fromX},${toY + PATH_LEAD}`,
                                        `${fromX + PATH_LEAD * dir},${toY + PATH_LEAD}`,
                                    ].join(' '),
                                    `L`, `${toX - PATH_LEAD * dir},${toY + PATH_LEAD}`,
                                    `C`, [
                                        `${toX},${toY + PATH_LEAD}`,
                                        `${toX},${toY + PATH_LEAD}`,
                                        `${toX},${toY}`,
                                    ].join(' '),
                                    (''),
                                ].join(' ')
                                :
                                [
                                    `M`, `${fromX} ${fromY}`,
                                    (''),
                                    `C`, [
                                        `${fromX},${fromY - PATH_LEAD}`,
                                        `${fromX},${fromY - PATH_LEAD}`,
                                        `${fromX + PATH_LEAD * dir},${fromY - PATH_LEAD}`,
                                    ].join(' '),
                                    `L`, `${toX - PATH_LEAD * dir},${fromY - PATH_LEAD}`,
                                    `C`, [
                                        `${toX},${fromY - PATH_LEAD}`,
                                        `${toX},${fromY - PATH_LEAD}`,
                                        `${toX},${fromY - TIME_HEIGHT}`,
                                    ].join(' '),
                                    (`L ${toX},${toY}`),
                                ].join(' ')
                            );
                            console.log(pathStr);
                            line = <path d={pathStr} stroke={color} strokeWidth={LINE_WIDTH} fill="#00000000" />
                        }
                        return (
                            <g data-type="edge" data-name={edgeID} key={edgeID}>
                                {line}
                                <text x={(fromX + toX) / 2} y={(fromY + toY) / 2} className={styles.edgeTitleLabel}>{title}</text>
                            </g>
                        );
                    })}
                </g>
                <g id="nodes">
                    {diagramStore.nodes.map((n, i) => {
                        const { nodeID, branch, time, title, x, y, color } = n;
                        return (
                            <g data-type="node" data-name={nodeID} key={nodeID}>
                                <circle cx={x} cy={y} r={DOT_RADIUS} stroke="white" strokeWidth={DOT_STROKE_WIDTH} fill={color} />
                                <text x={x} y={y} className={[styles.nodeTitleLabel, styles.border].join(' ')}>{title}</text>
                                <text x={x} y={y} className={styles.nodeTitleLabel}>{title}</text>
                            </g>
                        );
                    })}
                </g>
            </>
        );

        return newContent;
    }, [talkData, pageId, stepID]);

    return (
        <svg width={500} height={500}>
            {content}
        </svg>
    );
};