import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'RouteAssign' })
export class RouteAssignEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  trainId: number;

  @Column()
  startAt: Date;

  @Column()
  endAt: Date;

  @Column()
  passengerPrice: number;

  @Column()
  roadCode: string;

  @Column()
  createdAt: Date;

}
