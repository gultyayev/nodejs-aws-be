import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {ProductEntity} from "@libs/entities/product.entity";

@Entity('stocks')
export class StockEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => ProductEntity)
    @JoinColumn({
        name: 'product_id',
        referencedColumnName: 'id'
    })
    product: ProductEntity;

    @Column({
        type: 'integer'
    })
    count: number;
}
