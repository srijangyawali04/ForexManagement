import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn, BeforeInsert } from "typeorm";

@Entity("users")
export class User {
  @PrimaryColumn({ type:"varchar"})
  staff_code: string;
  
  @Column({ type: "varchar", length: 255 })
  password: string;

  @Column({ type: "varchar", length: 255 })
  staff_name: string;

  @Column({ type: "enum", enum: ["Deputy Director", "Assistant Director","Head Assistant", "Assistant", "Deputy Assistant"] })
  designation: string;
  
  @Column({ type: "enum", enum: ["Creator","Verifier"] })
  role: string;

  @Column({ type: "varchar", length: 100, unique: true })
  email: string;
  
  @Column({ type: "varchar", length: 100, unique: true })
  mobile_number: string;

  @Column({ type: "enum", enum: ["Enabled","Disabled"]})
  user_status: string;

  @Column({ type: "varchar", length: 255 })
  remarks: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
