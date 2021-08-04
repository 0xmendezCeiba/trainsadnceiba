import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'PassengerBoarding' })
export class PassengerBoardingEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  clientId: number;

  @Column()
  routeAssignId: number;

  @Column()
  createdAt: Date;

}
