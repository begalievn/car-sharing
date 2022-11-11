import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Car {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'car_id'
  })
  id: number;

  @Column({
    nullable: false,
    default: ''
  })
  brand: string

  @Column({
    nullable: false,
    default: ''
  })
  model: string;
}
