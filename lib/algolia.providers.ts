import { Provider } from '@nestjs/common';
import { SearchClient } from 'algoliasearch';
import { AlgoliaIndexDefinition } from './interfaces';
import { ALGOLIA_CLIENT } from './algolia.constants';
import { getIndexToken } from './utils';

export const createAlgoliaIndexProviders = (
  indexData: AlgoliaIndexDefinition[],
): Provider[] => {
  return indexData.map((idx) => ({
    provide: getIndexToken(idx.name),
    inject: [ALGOLIA_CLIENT],
    useFactory: async (client: SearchClient) => {
      const indexName = typeof idx.name === 'string' ? idx.name : idx.name.name;
      const index = client.initIndex(indexName);
      if (idx.options) {
        await index.setSettings(idx.options);
      }
      return index;
    },
  }));
};
