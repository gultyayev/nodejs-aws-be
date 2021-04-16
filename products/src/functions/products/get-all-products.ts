import {ResponseBuilder, tryCatch} from '@libs/apiGateway';
import {middyfy} from '@libs/lambda';
import {Handler} from "aws-lambda";
import {DbConnection} from "@libs/db";
import {ProductDto} from "@libs/dtos/product.dto";

const getAll: Handler = (_, context) =>
    tryCatch(async () => {
        context.callbackWaitsForEmptyEventLoop = false
        const db = DbConnection.getInstance('getAllProducts');
        const connection = await db.connection;
        const allProducts: ProductDto[] = await connection.query('SELECT products.id id, title, description, price, img_src imgSrc, count FROM products RIGHT JOIN stocks ON stocks.product_id = products.id');

        console.log('Found products', allProducts)

        return new ResponseBuilder(allProducts).build()
    });

export const getProductsList = middyfy(getAll);
