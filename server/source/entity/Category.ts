import { Entity, PrimaryGeneratedColumn, Column, Index, OneToMany, BaseEntity } from 'typeorm';
import { Book } from './Book';

@Entity({ name: 'category' })
export class Category extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    @Index({ unique: true })
    id: number;

    @Column('varchar', { length: 60, nullable: false })
    name: string;

    @OneToMany(() => Book, (book) => book.category)
    books: Book[];
}
