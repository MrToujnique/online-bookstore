import { Entity, PrimaryGeneratedColumn, Column, Index, OneToMany, OneToOne, ManyToOne, BaseEntity, JoinColumn } from 'typeorm';
import { SubOrder } from './SubOrder';
import { Customer } from './Customer';

@Entity({ name: 'purchase' })
export class Purchase extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    @Index({ unique: true })
    id: number;

    @Column({ type: 'timestamp', default: 'now()' })
    issuedAt: Date = new Date();

    @Column({name: 'is_paid', type: 'boolean', nullable: false, default: false})
    isPaid: boolean = false;

    @Column({name: 'is_delivered', type: 'boolean', nullable: false, default: false})
    isDelivered: boolean = false;

    @Column({name: 'paid_at', type: 'timestamp', nullable: true})
    paidAt: Date = new Date();

    @Column({name: 'delivered_at', type: 'timestamp', nullable: true})
    deliveredAt: Date = new Date();

    @Column({name: "items_price", type: 'decimal'})
    itemsPrice: number = 0;

    @Column({name: "shipping_price", type: 'decimal'})
    shippingPrice: number = 0;

    @Column({name: "total_price", type: 'decimal'})
    totalPrice: number = 0;

    @Column({name: "payment_method", type: 'varchar'})
    paymentMethod: string = "";

    @Column({name: 'quantity_sum', type: 'smallint', nullable: true})
    quantitySum: number = 0;

    @ManyToOne(() => Customer, (customer) => customer.purchases)
    @JoinColumn({name: 'customer_id'})
    customer: Customer;

    @OneToMany(() => SubOrder, (subOrder) => subOrder.purchase)
    subOrders: SubOrder[];
}
