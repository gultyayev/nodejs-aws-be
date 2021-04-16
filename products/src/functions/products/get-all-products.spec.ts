import {getDbInstanceMock, mockMiddyfy} from "../../mocks/helpers";

mockMiddyfy();
const dbMock = getDbInstanceMock();
dbMock.mock();

import { getProductsList } from "@functions/products/get-all-products";
import products from "../../mocks/products.json";

describe("Get products list", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return JSON with products", async () => {
    dbMock.queryFn.mockResolvedValue(products);

    const expected = {
      body: JSON.stringify(products),
      statusCode: 200,
    };
    const actual = await getProductsList(
      {
        body: null,
      } as any,
      {} as any,
      {} as any
    );

    expect(dbMock.getInstanceFn).toHaveBeenCalledWith("getAllProducts");
    expect(dbMock.queryFn).toHaveBeenCalledWith(
      "SELECT products.id id, title, description, price, img_src imgSrc, count FROM products RIGHT JOIN stocks ON stocks.product_id = products.id"
    );

    expect(actual).toEqual(expect.objectContaining(expected));
  });
});
