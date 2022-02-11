import { Entity, PrimaryGeneratedColumn, Column, Index, OneToMany, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';
import { Purchase } from './Purchase';
import { Users } from './Users';

@Entity({ name: 'customer' })
export class Customer extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    @Index({ unique: true })
    id: number;

    @Column('varchar', {name: "full_name", length: 60, nullable: true })
    fullName: string = '';

    @Column('varchar', { length: 60, nullable: true })
    address: string = '';

    @Column('varchar', { length: 50, nullable: false })
    city: string = '';

    @Column('varchar', {name: "postal_code", length: 6, nullable: false })
    postalCode: string = '';

    @OneToMany(() => Purchase, (purchase) => purchase.customer)
    purchases: Purchase[];

    @ManyToOne(() => Users, (users) => users.customers)
    @JoinColumn({name: 'user_id'})
    users: Users;
}
