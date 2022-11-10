import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Statistic {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'statistic_id'
  })
  id: number;

  @Column()
  car_id: number;

  @Column()
  sessions: number;

  @Column()
  rented_days: number;

  @Column()
  total_income: number;

  @Column()
  average_income: number;
}
