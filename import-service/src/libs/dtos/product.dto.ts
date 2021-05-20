import {IsInt, IsOptional, IsString, IsUUID, MaxLength, Min} from "class-validator";

export class ProductDto {
    @IsString()
    @IsUUID('4')
    @IsOptional()
    id?: string;

    @IsString()
    @MaxLength(255)
    title: string;

    @IsString()
    @MaxLength(1000)
    @IsOptional()
    description?: string;

    @IsInt()
    @Min(0)
    price: number;

    @IsString()
    @MaxLength(500)
    @IsOptional()
    imgSrc?: string;

    @IsInt()
    @Min(0)
    count: number;

    constructor(data: ProductDto) {
        this.id = data.id;
        this.title = data.title;
        this.description = data.description;
        this.price = data.price;
        this.imgSrc = data.imgSrc;
        this.count = data.count;
    }
}
