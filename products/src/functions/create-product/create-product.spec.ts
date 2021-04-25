import { getDbInstanceMock, mockMiddyfy } from "../../mocks/helpers";

mockMiddyfy();
const dbMock = getDbInstanceMock();
dbMock.mock();

import { createProduct } from "@functions/create-product/create-product";
import { ProductEntity } from "@libs/entities/product.entity";
import { StockEntity } from "@libs/entities/stock.entity";

describe("Create new product", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return error 400", async () => {
    const res = await createProduct(
      {
        body: {},
      } as any,
      {} as any,
      {} as any
    );

    expect(res).toEqual(
      expect.objectContaining({
        statusCode: 400,
      })
    );
  });

  it("should id of created product", async () => {
    dbMock.entityManager.save
      .mockResolvedValueOnce({ id: "id1" })
      .mockResolvedValueOnce({ id: "id2" });

    const res: any = await createProduct(
      {
        body: {
          count: 2,
          price: 24,
          title: "test",
        },
      } as any,
      {} as any,
      {} as any
    );

    expect(dbMock.transactionFn).toHaveBeenCalled();

    // Save product
    expect(dbMock.entityManager.create).toHaveBeenNthCalledWith(
      1,
      ProductEntity,
      {
        price: 24,
        title: "test",
      }
    );
    expect(dbMock.entityManager.save).toHaveBeenNthCalledWith(1, {
      price: 24,
      title: "test",
    });

    // Save stock
    expect(dbMock.entityManager.create).toHaveBeenNthCalledWith(
      2,
      StockEntity,
      {
        count: 2,
        product: {
          id: 'id1'
        },
      }
    );
    expect(dbMock.entityManager.save).toHaveBeenNthCalledWith(2, {
      count: 2,
      product: {
        id: 'id1'
      },
    });

    expect(res.statusCode).toEqual(201);
    expect(JSON.parse(res.body).id).toBe('id1');
  });
});
