import { DynamicModule, Module } from '@nestjs/common';
import {
  AlgoliaModuleAsyncOptions,
  AlgoliaModuleOptions,
  AlgoliaIndexDefinition,
} from './interfaces';
import { createAlgoliaIndexProviders } from './algolia.providers';
import { AlgoliaCoreModule } from './algolia-core.module';

@Module({})
export class AlgoliaModule {
  static forRoot(options: AlgoliaModuleOptions): DynamicModule {
    return {
      module: AlgoliaModule,
      imports: [AlgoliaCoreModule.forRoot(options)],
    };
  }

  static forRootAsync(options: AlgoliaModuleAsyncOptions): DynamicModule {
    return {
      module: AlgoliaModule,
      imports: [AlgoliaCoreModule.forRootAsync(options)],
    };
  }

  static forFeature(indexData: AlgoliaIndexDefinition[]): DynamicModule {
    const providers = createAlgoliaIndexProviders(indexData);
    return {
      module: AlgoliaModule,
      exports: providers,
      providers,
    };
  }
}
