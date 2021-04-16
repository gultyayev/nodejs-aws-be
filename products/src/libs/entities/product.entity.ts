import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('products')
export class ProductEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false
    })
    title: string;

    @Column({
        type: 'varchar',
        length: 1000
    })
    description: string;

    @Column({
        type: 'integer',
    })
    price: number;

    @Column({
        type: 'varchar',
        length: 500
    })
    imgSrc: string;
}
