import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Rent {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'rent_id'
  })
  id: number

  @Column({
    nullable: false,
    name: 'customer_id'
  })
  customer_id: number;

  @Column({
    name: 'car_id'
  })
  car_id: number;

  @Column({
    type: 'timestamptz',
    name: 'from_date'
  })
  from_date: Date;

  @Column({
    type: 'timestamptz',
    name: 'till_date'
  })
  till_date: Date;

  @Column()
  price: number;
}
