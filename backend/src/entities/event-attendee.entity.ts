import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.entity.js';
import { Event } from './event.entity.js';

@Entity('event_attendees')
export class EventAttendee {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne('Event', (event: Event) => event.attendees, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'event_id' })
    event!: Event;

    @ManyToOne('User', (user: User) => user.attendedEvents, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @CreateDateColumn()
    created_at!: Date;
} 