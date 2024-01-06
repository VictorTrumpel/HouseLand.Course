export class Node {
  readonly id: string;
  readonly children: Set<Node>;

  constructor(id: string) {
    this.id = id;
    this.children = new Set();
  }
}

export class Graph {
  readonly map: Map<string, Node> = new Map();

  constructor(houseMap?: Graph['map']) {
    if (houseMap) this.map = houseMap;
  }

  addChildren(node1: Node, node2: Node) {
    // сделал граф двунаправленным
    node1.children.add(node2);
    node2.children.add(node1);

    this.map.set(node1.id, node1);
    this.map.set(node2.id, node2);
  }

  getAllPaths(fromNode: Node, toNode: Node) {
    const record: Node[][] = [];
    this.dfsFindPaths(fromNode, toNode, new Set([fromNode]), record);
    return record;
  }

  private dfsFindPaths(
    fromNode: Node,
    toNode: Node,
    visitedNodes: Set<Node>,
    recordPaths: Node[][]
  ) {
    if (fromNode === toNode) {
      recordPaths.push([...visitedNodes]);
      visitedNodes.delete(fromNode);
      return;
    }

    const children = fromNode.children;

    for (const childNode of children) {
      const isChildNodeVisited = visitedNodes.has(childNode);

      if (isChildNodeVisited) continue;

      visitedNodes.add(childNode);

      this.dfsFindPaths(childNode, toNode, visitedNodes, recordPaths);
    }

    visitedNodes.delete(fromNode);
  }
}
