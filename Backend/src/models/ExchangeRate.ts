import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity("exchange_rates")
export class ExchangeRate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10 })
  from_currency: string;

  @Column({ type: 'varchar', length: 255 })
  currency_name: string;

  @Column({ type: 'decimal', precision: 15, scale: 4 })
  buy_rate: number;

  @Column({ type: 'decimal', precision: 15, scale: 4 })
  sell_rate: number;

  @Column({ type: 'int' })
  unit: number; 

  @CreateDateColumn()
  fetchedAt: Date; 
}
