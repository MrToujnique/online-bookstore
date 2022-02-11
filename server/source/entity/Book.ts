import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Index,
    ManyToOne,
    ManyToMany,
    JoinTable,
    OneToMany,
    BaseEntity,
    JoinColumn,
    OneToOne
} from 'typeorm';
import { Category } from './Category';
import { Publisher } from './Publisher';
import { Author } from './Author';
import { Review } from './Review';

@Entity({ name: 'book' })
export class Book extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    @Index({unique: true })
    id: number;

    @Column('varchar', {length: 99, nullable: false })
    title: string;

    @Column('int')
    pages: number = 0;

    @Column('varchar', { length: 999, nullable: true })
    description: string = '';

    @Column('decimal')
    price: number = 0;

    @Column('varchar', { length: 500, nullable: true })
    photo: string = '';

    @Column('varchar', { length: 999, nullable: true })
    keywords: string = '';
    
    @Column('int', {nullable: true})
    countinstock: number = 0;

    @Column({ type: 'timestamp', default: 'now()' })
    addedAt: Date = new Date();

    @OneToMany(() => Review, (review) => review.book)
    reviews: Review[];

    @ManyToOne(() => Category, (category) => category.books)
    @JoinColumn({name: 'category_id'})
    category: Category;

    @ManyToOne(() => Publisher, (publisher) => publisher.books)
    @JoinColumn({name: 'publisher_id'})
    publisher: Publisher;

    @ManyToMany(type => Author, author => author.books, {cascade: true})
    @JoinTable()
    authors: Author[];
}
