# nestjs-algoliasearch
Algolia search module for NestJS, using the official [algoliasearch](https://github.com/algolia/algoliasearch-client-javascript#readme) package

## Install

```bash
npm install nestjs-algoliasearch algoliasearch
```
or
```bash
yarn add nestjs-algoliasearch algoliasearch
```

## Getting started
 
### Register the module 

```typescript
// app.module.ts
import { AlgoliaModule } from 'nestjs-algoliasearch';

@Module({
  imports: [
    //...
    AlgoliaModule.forRoot({
      applicationId: 'ALGOLIA_APPLICATION_ID',
      apiKey: 'ALGOLIA_API_KEY',
    }),

    // Or async:
    AlgoliaModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('algolia'),
    }),
    //...
  ],
})
export class AppModule {}
```

### Register the indexes

```typescript
// todo.module.ts
import { AlgoliaModule } from 'nestjs-algoliasearch';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TodoEntity,
    ]),
    AlgoliaModule.forFeature([{
      name: TodoEntity, // Or a string, this will be the index name
      options: {/* custom Algolia client index settings */},
    }])
  ],
})
export class TodoModule {}
```
See the official [Algolia client documentatin](https://www.algolia.com/doc/api-reference/settings-api-parameters/) for a list of all available Index options

### Using the registered Index

The Index is injectable using the `@InjectIndex` decorator, the returned value is an `algoliasearch.SearchIndex`.

See the official [Algolia client documentation](https://www.algolia.com/doc/api-client/methods/search/) for a list of available methods 

```typescript
// todo.service.ts
import { InjectIndex } from 'nestjs-algoliasearch';
import { SearchIndex } from 'algoliasearch';

@Injectable()
export class TodoService {
  constructor(
    @InjectIndex(TodoEntity /* or the string used as "name" prop while registering the index */)
    private readonly todoIndex: SearchIndex,
  )
}
```
