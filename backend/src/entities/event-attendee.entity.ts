import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import type { Event } from './event.entity.js';
import type { User } from './user.entity.js';

@Entity('event_attendees')
export class EventAttendee {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'int' })
    userId!: number;

    @Column({ type: 'int' })
    eventId!: number;

    @CreateDateColumn()
    joinedAt!: Date;

    @ManyToOne('Event', (event: Event) => event.attendees)
    event!: Event;

    @ManyToOne('User', (user: User) => user.attendedEvents)
    user!: User;
} 