import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity.js';
import { Event } from '../entities/event.entity.js';
import { EventAttendee } from '../entities/event-attendee.entity.js';
import { config } from './env.js';

const AppDataSource = new DataSource({
    type: 'mysql',
    host: config.DB_HOST,
    port: 3306,
    username: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    entities: [User, Event, EventAttendee],
    migrations: ['src/migrations/*.ts'],
    synchronize: false,
    logging: true
});

export default AppDataSource; 