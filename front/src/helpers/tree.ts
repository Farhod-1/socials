export type INode<T> = {
  children?: INode<T>[]
} & T

type SortFn<T> = (a: INode<T>, b: INode<T>) => number

function findChildrenOfNode<T>(
  parent: INode<T>,
  nodes: INode<T>[],
  parentKey = 'parent',
  ownKey = '_id',
  sortFn?: SortFn<T>
) {
  return (
    nodes
      // @ts-ignore
      .filter((n) => n[parentKey] === parent[ownKey])
      .map((node) => {
        return {
          ...node,
          children: makeTreeForParent(nodes, parentKey, ownKey, node, sortFn)
        }
      })
  )
}

export function makeTreeForParent<T>(
  nodes: INode<T>[],
  parentKey = 'parent',
  ownKey = '_id',
  parent: INode<T> | undefined = undefined,
  sortFn?: SortFn<T>
): T[] {
  const tree = nodes.reduce((tree, node) => {
    // @ts-ignore
    if (node[parentKey] == parent?.[ownKey]) {
      const children = findChildrenOfNode<T>(node, nodes, parentKey, ownKey, sortFn)
      tree.push({
        ...node,
        children: sortFn ? children.sort(sortFn) : children
      })
    }

    return tree
  }, [] as INode<T>[])

  return sortFn ? tree.sort(sortFn) : tree
}
