import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';


export enum ProductCategory {
  TSHIRTS = 'camisetas',
  MUGS = 'tazas',
  NOTEBOOKS = 'libretas'
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  basePrice: number;

  @Column({
    type: 'varchar',
    enum: ProductCategory,
    default: ProductCategory.TSHIRTS
  })
  category: ProductCategory;

  @Column()
  imageUrl: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  
} 