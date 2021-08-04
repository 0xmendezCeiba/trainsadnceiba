import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Client' })
export class ClientEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    identityCode: string;
  
    @Column()
    fullName: string;
  
    @Column()
    balance: number;
  
    @Column()
    createdAt: Date;
}
