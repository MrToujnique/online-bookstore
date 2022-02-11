import { Entity, PrimaryGeneratedColumn, Column, Index, BaseEntity, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Book } from './Book';

@Entity({ name: 'author' })
export class Author extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    @Index({ unique: true })
    id: number;

    @Column('varchar', {name: 'first_name', length: 30, nullable: true})
    firstName: string = '';

    @Column('varchar', {name: 'last_name', length: 30, nullable: true})
    lastName: string = '';

    @ManyToMany(type => Book, (book) => book.authors)
    @JoinTable()
    books: Book[];
}
