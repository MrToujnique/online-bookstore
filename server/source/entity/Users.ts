import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { BaseEntity, Column, Entity, Index, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { UserRole } from '../enums/UserRole';
import { Customer } from './Customer';

@Entity({ name: 'users' })
export class Users extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    @Index({ unique: true })
    id: number;

    @Column('varchar', { nullable: false, default: '' })
    @Length(2, 30, { message: 'Imie musi miec wiecej niz 2 ale nie wiecej niz 30 znakow.' })
    @IsNotEmpty({ message: 'Imie jest wymagane.' })
    first_name!: string;

    @Column('varchar', { nullable: false, default: '' })
    @Length(2, 50, { message: 'Nazwisko musi miec wiecej niz 2 ale nie wiecej niz 50 znakow.' })
    @IsNotEmpty({ message: 'Nazwisko jest wymagane.' })
    last_name!: string;

    @Column('varchar', { length: 50, unique: true, nullable: false, default: '' })
    @IsEmail({}, { message: 'Nieprawidlowy email.' })
    @IsNotEmpty({ message: 'Email jest wymagany.' })
    email!: string;

    @Column('varchar', { nullable: false, default: '' })
    @Length(8, 32, { message: 'Haslo musi miec co najmniej 6 znakow, ale nie wiecej niz 30.' })
    @IsNotEmpty({ message: 'Haslo jest wymagane.' })
    password!: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER
    })
    role: UserRole;

    @Column({ type: 'timestamp', default: 'now()' })
    createdAt: Date = new Date();

    @OneToMany(() => Customer, (customer) => customer.users)
    customers: Customer[];
}
