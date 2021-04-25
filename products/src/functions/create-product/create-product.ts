import {ResponseBuilder, tryCatch} from '@libs/apiGateway';
import {middyfy} from '@libs/lambda';
import {Handler} from "aws-lambda";
import {DbConnection} from "@libs/db";
import {ProductDto} from "@libs/dtos/product.dto";
import {ProductEntity} from "@libs/entities/product.entity";
import {StockEntity} from "@libs/entities/stock.entity";
import {validateDto} from "@libs/validator";

const create: Handler = (event, context) => {
    return tryCatch(async () => {
        context.callbackWaitsForEmptyEventLoop = false
        console.log('Create product received an event', event);
        const body: ProductDto = event.body;

        const validationRes = await validateDto(new ProductDto(body));

        if (validationRes) {
            return validationRes;
        }

        const db = DbConnection.getInstance('createProduct');
        const connection = await db.connection;

        return await connection.transaction(async entityManager => {
            const {count, ...product} = body;

            console.log('Data', {count, product})

            const newProduct = entityManager.create(ProductEntity, product)
            const createdProduct = await entityManager.save(newProduct)
            console.log({createdProduct})

            const newStock = entityManager.create(StockEntity, {
                product: createdProduct,
                count: count
            })
            await entityManager.save(newStock)

            return new ResponseBuilder({id: createdProduct.id}).setStatusCode(201).build()
        })
    });
}

export const createProduct = middyfy(create);
