export function getDbInstanceMock() {
    const manager = {
        save: jest.fn(),
        create: jest.fn((_, obj) => obj)
    }
    const queryFn = jest.fn();
    const transactionFn = jest.fn(cb => cb(manager));
    const getInstanceFn = jest.fn(() => {
        return {
            connection: Promise.resolve({
                query: queryFn,
                transaction: transactionFn
            }),
        };
    });

    return {
        queryFn,
        getInstanceFn,
        transactionFn,
        entityManager: manager,
        mock: () => jest.mock("@libs/db", () => {
            return {
                DbConnection: {
                    getInstance: getInstanceFn,
                },
            };
        })
    }
}

export function mockMiddyfy() {
    return jest.mock("@libs/lambda", () => {
        return {
            middyfy: (e) => e,
        };
    })
}
