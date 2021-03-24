jest.mock('@libs/lambda', () => {
    return {
        middyfy: e => e
    }
});

import {getProductsList} from "@functions/products/handler";
import products from '../../mocks/products.json';

describe('Get products list', () => {
    it('should return JSON with products', async () => {
        const expected = {
            body: JSON.stringify(products),
            statusCode: 200
        }
        const actual = await getProductsList({
            body: null
        } as any, {} as any, {} as any)

        expect(actual).toEqual(expect.objectContaining(expected))
    });
});
