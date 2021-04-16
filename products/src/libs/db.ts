import "reflect-metadata";
import {Connection, createConnection} from "typeorm";
import {Env} from "@libs/env.enum";
import {ProductEntity} from "@libs/entities/product.entity";
import {SnakeNamingStrategy} from "typeorm-naming-strategies";
import {StockEntity} from "@libs/entities/stock.entity";

export class DbConnection {
    private static instances: Map<string, DbConnection> = new Map();
    readonly #connection: Promise<Connection>;

    protected constructor(connectionName: string) {
        console.log(`Creating DB connection with name ${connectionName}...`)
        this.#connection = createConnection({
            type: 'postgres',
            host: Env.DB_HOST,
            database: 'products',
            username: Env.DB_USERNAME,
            password: Env.DB_PASSWORD,
            synchronize: false,
            entities: [ProductEntity, StockEntity],
            name: connectionName,
            namingStrategy: new SnakeNamingStrategy(),
        }).then(connection => {
            console.log(`DB connection with name ${connectionName} created!`)
            return connection;
        })
    }

    get connection(): Promise<Connection> {
        return this.#connection.then(connection => {
            if (!connection.isConnected) {
                return connection.connect();
            }

            return connection;
        });
    }

    static getInstance(connectionName: string) {
        if (!this.instances.has(connectionName)) {
            this.instances.set(connectionName, new DbConnection(connectionName));
        }

        return this.instances.get(connectionName);
    }
}
