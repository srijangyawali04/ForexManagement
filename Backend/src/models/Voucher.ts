import {
  Entity,
  Column,
  CreateDateColumn,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Transactions } from './Transaction';

@Entity('voucher')
export class Voucher {
  @PrimaryColumn()
  voucher_number: number;

  @CreateDateColumn()
  voucher_date: Date;

  @Column({ type: 'varchar', length: 255 })
  customer_name: string;

  @Column({ type: 'varchar', length: 255 })
  passport_number: string;

  @Column({ type: 'varchar', length: 10, unique: true })
  mobile_number: string;

  @Column({ type: 'varchar', length: 255 })
  customer_address: string;

  @Column({ type: 'int' })
  itrs_code: number;

  @Column({ type: 'varchar', length: 100 })
  travel_order_ref_number: string;

  @Column({ type: 'enum', enum: ['Yes', 'No'] })
  voucher_cancellation: string;

  // Define the OneToMany relationship to Transactions
  @OneToMany(() => Transactions, (transaction) => transaction.voucher)
  transactions: Transactions[];
}
