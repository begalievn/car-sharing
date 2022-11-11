import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'customer_id'
  })
  id: number;

  @Column({
    nullable: false,
    unique: true
  })
  passport_number: number;

  @Column({
    nullable: false,
    unique: true
  })
  username: string;

  @Column({
    nullable: false
  })
  name: string;

  @Column({
    nullable: false
  })
  surname: string;

  @Column({
    nullable: false
  })
  age: number;
}
