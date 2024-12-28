import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from "typeorm";

@Entity("voucher")
export class Voucher {
  @PrimaryGeneratedColumn()
  voucher_number: number;
  
  @CreateDateColumn()
  voucher_date: Date;

  @Column({ type: "varchar", length: 255 })
  customer_name: string;

  @Column({ type: "varchar", length: 255 })
  passport_number: string;
  
  @Column({ type: "varchar", length: 10, unique: true })
  mobile_number: string;
  
  @Column({ type: "varchar", length: 255 })
  customer_address: string;  
  
  @Column({ type: "int"})
  itrs_code: number;

  @Column({type:"varchar", length:100})
  travel_order_ref_number: number;

  @Column({type:"enum",enum:["Yes","No"]})
  voucher_cancellation:string;
}
