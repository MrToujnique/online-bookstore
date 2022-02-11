import { Entity, PrimaryGeneratedColumn, Column, Index, ManyToOne, BaseEntity, OneToOne, JoinColumn } from 'typeorm';
import { Book } from './Book';
import { Users } from './Users';

@Entity({ name: 'review' })
export class Review extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    @Index({ unique: true })
    id: number;

    @Column('smallint')
    rating: number = 0;

    @Column({ length: 99, type: 'varchar', nullable: true })
    name: string = '';

    @Column('varchar', { length: 1000, nullable: true })
    content: string = '';

    @Column({name: 'created_at', type: 'timestamp', nullable: true})
    createdAt: Date = new Date();

    @ManyToOne(() => Book, (book) => book.reviews)
    @JoinColumn({name: 'book_id'})
    book: Book;

    @ManyToOne(() => Users)
    @JoinColumn({name: 'user_id'})
    users: Users;
}
