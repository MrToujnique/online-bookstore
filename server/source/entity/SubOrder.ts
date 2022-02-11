import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Index,
    OneToMany,
    ManyToOne,
    JoinColumn,
    OneToOne,
    BaseEntity
} from 'typeorm';
import { Book } from './Book';
import { Purchase } from './Purchase';

@Entity({ name: 'suborder' })
export class SubOrder extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    @Index({ unique: true })
    id: number;

    @ManyToOne(() => Purchase, (purchase) => purchase.subOrders)
    @JoinColumn({name: 'purchase_id'})
    purchase: Purchase;

    @ManyToOne(() => Book)
    @JoinColumn({name: 'book_id'})
    book: Book;

    @Column('smallint', { nullable: false, default: 0 })
    quantity: number;
}
