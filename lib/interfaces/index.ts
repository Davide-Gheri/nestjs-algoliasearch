import { ModuleMetadata, Provider, Type } from '@nestjs/common/interfaces';
import { Settings } from '@algolia/client-search';

export interface AlgoliaModuleOptions {
  applicationId: string;
  apiKey: string;
}

export interface AlgoliaModuleOptionsFactory {
  createAlgoliaOptions(): Promise<AlgoliaModuleOptions> | AlgoliaModuleOptions;
}

export interface AlgoliaModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<AlgoliaModuleOptionsFactory>;
  useClass?: Type<AlgoliaModuleOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<AlgoliaModuleOptions> | AlgoliaModuleOptions;
  inject?: any[];
  extraProviders?: Provider[];
}

export interface AlgoliaIndexDefinition {
  name: string | Function;
  options?: Settings;
}
