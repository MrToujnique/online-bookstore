import { Entity, PrimaryGeneratedColumn, Column, Index, OneToMany, BaseEntity } from 'typeorm';
import { Book } from './Book';

@Entity({ name: 'publisher' })
export class Publisher extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    @Index({ unique: true })
    id: number;

    @Column('varchar', { length: 60, nullable: false })
    name: string;

    @OneToMany(() => Book, (book) => book.publisher)
    books: Book[];
}
