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

  @Column({ type: 'varchar', length: 10 })
  mobile_number: string;

  @Column({ type: 'varchar', length: 255 })
  customer_address: string;

  @Column({ type: 'int' })
  itrs_code: number;

  @Column({ type: 'varchar', length: 100, nullable: true, default: null})
  travel_order_ref_number: string;

  @Column({ type: 'enum', enum: ['Yes', 'No'], nullable: true, default: null})
  voucher_cancellation: string;

  @Column({ type: 'enum', enum: ['Pending', 'Verified'] })
  voucher_status: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  createdBy: string;

  // The user who verified the voucher
  @Column({ type: 'varchar', length: 255, nullable: true })
  verifiedBy: string;

  // Define the OneToMany relationship to Transactions
  @OneToMany(() => Transactions, (transaction) => transaction.voucher)
  transactions: Transactions[];
}
