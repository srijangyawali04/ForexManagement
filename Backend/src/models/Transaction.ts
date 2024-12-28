import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Voucher } from './Voucher';
import { User } from './User';

@Entity('transactions')
export class Transactions {
  @PrimaryGeneratedColumn()
  transaction_id: number;

  // Define a ManyToOne relationship to the Voucher entity
  @ManyToOne(() => Voucher, (voucher) => voucher.transactions, { nullable: false })
  voucher: Voucher;

  @Column({ type: 'varchar', length: 50 })
  currency_name: string;

  @Column({ type: 'varchar', length: 3 })
  currency_iso_code: string;

  @Column({ type: 'varchar', length: 10 })
  currency_code: string;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  exchange_rate: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  fc_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  commission: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  total_NPR: number;

  @ManyToOne(() => User, (user) => user.staff_code, { nullable: false })
  created_by: User;

  @ManyToOne(() => User, (user) => user.staff_code, { nullable: false })
  verified_by: User;
}
