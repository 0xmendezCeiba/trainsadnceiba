import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Train' })
export class TrainEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  color: string;

  @Column()
  passengerLimit: number;

  @Column()
  createdAt: Date;

}
