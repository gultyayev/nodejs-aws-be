import notificationService from "@services/notification.service";
import { batchHandler } from "./catalog-batch-process";

jest.mock("@libs/apiGateway", () => ({
  tryCatch: (e) => e(),
}));

const mockData = [
  {
    body: "1",
  },
  {
    body: "2",
  },
  {
    body: "3",
  },
  {
    body: "4",
  },
];

describe("batchHandler", () => {
  let notifySpy: any;

  beforeEach(() => {
    notifySpy = jest
      .spyOn(notificationService, "notify")
      .mockReturnValue(notifySpy);
  });

  it("should process all records", async () => {
    await batchHandler(
      {
        Records: mockData,
      } as any,
      null,
      null
    );

    expect(notifySpy.mock.calls).toEqual([["1"], ["2"], ["3"], ["4"]]);
  });
});
