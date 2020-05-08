export const getIndexToken = (indexName: string | Function) =>
  `${typeof indexName === 'string' ? indexName : indexName.name}algolaIndex`;
