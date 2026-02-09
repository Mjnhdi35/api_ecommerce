import { Global, Module, type OnModuleDestroy, Inject } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import knex, { type Knex } from 'knex';

export const KNEX_CONNECTION = 'KNEX_CONNECTION';

@Global()
@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: KNEX_CONNECTION,
            useFactory: (configService: ConfigService) => {
                return knex({
                    client: 'pg',
                    connection: configService.get<string>('DATABASE_URL'),
                    searchPath: ['public'],
                    pool: {
                        min: 0,
                        max: 10,
                    },
                });
            },
            inject: [ConfigService],
        },
    ],
    exports: [KNEX_CONNECTION],
})
export class DatabaseModule implements OnModuleDestroy {
    constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) { }

    async onModuleDestroy() {
        await this.knex.destroy();
    }
}
