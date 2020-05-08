import { Inject } from '@nestjs/common';
import { ALGOLIA_CLIENT } from '../algolia.constants';
import { getIndexToken } from '../utils';

export const InjectClient = () => Inject(ALGOLIA_CLIENT);

export const InjectIndex = (indexName: string | Function) =>
  Inject(getIndexToken(indexName));
