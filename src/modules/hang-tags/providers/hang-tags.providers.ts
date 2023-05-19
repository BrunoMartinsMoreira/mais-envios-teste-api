import { IProvider } from 'src/commom/types/IProvider';
import { HangTag } from '../entities/hang-tag.entity';
import { DATA_SOURCE } from 'src/config/datasource.provider';

export const HANG_TAGS_REPOSITORY = 'HANG_TAGS_REPOSITORY';

export const hangTagsProviders: IProvider<HangTag>[] = [
  {
    provide: HANG_TAGS_REPOSITORY,
    useFactory: (dataSource) => dataSource.getRepository(HangTag),
    inject: [DATA_SOURCE],
  },
];
