import { ColumnNumericTransformer } from 'src/commom/utils/ColumnNumericTransformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('hangTags')
export class HangTag {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  tag: string;

  @Column()
  name: string;

  @Column({ type: 'int' })
  status: number;

  @Column()
  source: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
