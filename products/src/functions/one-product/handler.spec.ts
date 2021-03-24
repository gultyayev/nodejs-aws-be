jest.mock('@libs/lambda', () => {
    return {
        middyfy: e => e
    }
});

import {getProductsById} from "@functions/one-product/handler";
import products from '../../mocks/products.json';

describe('Get product by id', () => {
    it('should return JSON with product', async () => {
        const expected = {
            body: JSON.stringify(products[0]),
            statusCode: 200
        }
        const actual = await getProductsById({
            pathParameters: {
                id: '7567ec4b-b10c-48c5-9345-fc73c48a80aa'
            }
        } as any, {} as any, {} as any)

        expect(actual).toEqual(expect.objectContaining(expected))
    });

    it('should return 404', async () => {
        const expected = {
            statusCode: 404
        }
        const actual = await getProductsById({
            pathParameters: {
                id: '756'
            }
        } as any, {} as any, {} as any)

        expect(actual).toEqual(expect.objectContaining(expected))
    });
});
