import {getDbInstanceMock, mockMiddyfy} from "../../mocks/helpers";

mockMiddyfy();
const dbMock = getDbInstanceMock();
dbMock.mock();

import {getProductsById} from "@functions/one-product/get-product";
import products from '../../mocks/products.json';

describe('Get product by id', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return JSON with product', async () => {
        dbMock.queryFn.mockResolvedValue(products)

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
        expect(dbMock.queryFn).toHaveBeenCalledWith('SELECT id, title, description, price, img_src imgSrc, count FROM products RIGHT JOIN stocks ON stocks.product_id = products.id WHERE id = $1', [
            '7567ec4b-b10c-48c5-9345-fc73c48a80aa'
        ])
    });

    it('should return 404', async () => {
        dbMock.queryFn.mockResolvedValue([])

        const expected = {
            statusCode: 404
        }
        const actual = await getProductsById({
            pathParameters: {
                id: '7567ec4b-b10c-48c5-9345-fc73c48a8099'
            }
        } as any, {} as any, {} as any)

        expect(actual).toEqual(expect.objectContaining(expected))
    });

    it('should return 400', async () => {
        const expected = {
            statusCode: 400,
            body: JSON.stringify({
                error: 'Not UUID'
            })
        }
        const actual = await getProductsById({
            pathParameters: {
                id: '756'
            }
        } as any, {} as any, {} as any)

        expect(actual).toEqual(expect.objectContaining(expected))
    });
});
