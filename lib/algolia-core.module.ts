import { DynamicModule, Global, Module, Provider, Type } from '@nestjs/common';
import algoliasearch from 'algoliasearch';
import {
  AlgoliaModuleOptions,
  AlgoliaModuleAsyncOptions,
  AlgoliaModuleOptionsFactory,
} from './interfaces';
import { ALGOLIA_CLIENT, ALGOLIA_MODULE_OPTIONS } from './algolia.constants';

@Global()
@Module({})
export class AlgoliaCoreModule {
  static forRoot(options: AlgoliaModuleOptions): DynamicModule {
    const algoliaOptions: Provider = {
      provide: ALGOLIA_MODULE_OPTIONS,
      useValue: options,
    };

    const connectionProvider: Provider = {
      provide: ALGOLIA_CLIENT,
      useFactory: async () => await this.createConnectionFactory(options),
    };

    return {
      module: AlgoliaCoreModule,
      providers: [algoliaOptions, connectionProvider],
      exports: [connectionProvider],
    };
  }

  static forRootAsync(options: AlgoliaModuleAsyncOptions): DynamicModule {
    const connectionProvider: Provider = {
      provide: ALGOLIA_CLIENT,
      useFactory: async (algoliaOptions: AlgoliaModuleOptions) =>
        await this.createConnectionFactory(algoliaOptions),
      inject: [ALGOLIA_MODULE_OPTIONS],
    };
    const asyncProviders = this.createAsyncProviders(options);

    return {
      module: AlgoliaCoreModule,
      imports: options.imports,
      providers: [...asyncProviders, connectionProvider],
      exports: [connectionProvider],
    };
  }

  private static createAsyncProviders(
    options: AlgoliaModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass as Type<AlgoliaModuleOptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: AlgoliaModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: ALGOLIA_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: ALGOLIA_MODULE_OPTIONS,
      useFactory: async (optionsFactory: AlgoliaModuleOptionsFactory) =>
        await optionsFactory.createAlgoliaOptions(),
      inject: [
        (options.useClass || options.useExisting) as Type<
          AlgoliaModuleOptionsFactory
        >,
      ],
    };
  }

  private static async createConnectionFactory(options: AlgoliaModuleOptions) {
    return algoliasearch(options.applicationId, options.apiKey);
  }
}
