import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { Knex } from 'knex';
import { KNEX_CONNECTION } from '../../database/database.module.js';

export interface User {
    id: number;
    name: string;
    created_at: Date;
    updated_at: Date;
}

@Injectable()
export class UsersService {
    constructor(@Inject(KNEX_CONNECTION) private readonly knex: Knex) { }

    async create(name: string) {
        const [user] = await this.knex<User>('users')
            .insert({ name })
            .returning('*');
        return user;
    }

    async findAll() {
        return this.knex<User>('users').select('*');
    }

    async findOne(id: number) {
        const user = await this.knex<User>('users').where({ id }).first();
        if (!user) {
            throw new NotFoundException(`User #${id} not found`);
        }
        return user;
    }

    async update(id: number, name: string) {
        await this.findOne(id); // Check exists
        const [updatedUser] = await this.knex<User>('users')
            .where({ id })
            .update({ name, updated_at: new Date() })
            .returning('*');
        return updatedUser;
    }

    async remove(id: number) {
        await this.findOne(id); // Check exists
        await this.knex('users').where({ id }).del();
        return { deleted: true };
    }
}
