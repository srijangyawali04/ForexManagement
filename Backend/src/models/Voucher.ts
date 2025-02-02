import {
  Entity,
  Column,
  CreateDateColumn,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm';
import { Transactions } from './Transaction';

@Entity('voucher')
export class Voucher {
  @PrimaryColumn()
  voucher_number: number;

  // Define the OneToMany relationship to Transactions
  @OneToMany(() => Transactions, (transaction) => transaction.voucher)
  transactions: Transactions[];

  @Column({ type: 'varchar', nullable: false })
  fiscal_year: string = '2081/82';

  @CreateDateColumn()
  voucher_date: Date;

  @Column({ type: 'varchar', length: 255 })
  customer_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  voucher_staff_code: string;

  @Column({ type: 'varchar', length: 255 })
  passport_number: string;

  @Column({ type: 'varchar', length: 10 })
  mobile_number: string;

  @Column({ type: 'varchar', length: 255 })
  customer_address: string;

  @Column({ type: 'varchar' , nullable: true})
  itrs_code: string;

  @Column({ type: 'varchar', length: 255, nullable: true }) 
  visiting_country: string;

  @Column({ type: 'varchar', length: 255, nullable: true }) 
  purpose_of_visit: string;

  @Column({ type: 'varchar', length: 255, nullable: true }) 
  source_of_foreign_currency: string;

  @Column({ type: 'varchar', length: 100, nullable: true, default: null})
  travel_order_ref_number: string;

  @Column({ type: 'enum', enum: ['Pending', 'Verified','Canceled'] })
  voucher_status: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  createdBy: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  updatedBy: string;

  @UpdateDateColumn()
  updatedAt: Date;
  
  @Column({ type: 'varchar', nullable: true })
  ordered_by: string;
  
}
