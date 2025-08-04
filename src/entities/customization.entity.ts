import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('customizations')
export class Customization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  color: string;

  @Column({ nullable: true })
  customText: string;

  @Column({ nullable: true })
  customImageUrl: string;

  @Column({ default: 1 })
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  customizationPrice: number;

  @ManyToOne(() => Product, product => product.id)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  productId: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
} 