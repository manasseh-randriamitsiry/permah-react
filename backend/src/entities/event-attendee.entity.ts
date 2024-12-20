import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import type { User } from './user.entity.js';
import type { Event } from './event.entity.js';

@Entity('event_attendees')
export class EventAttendee {
    @PrimaryGeneratedColumn('increment')
    id!: number;

    @Column()
    userId!: number;

    @Column()
    eventId!: number;

    @ManyToOne('User', 'event_attendees')
    user!: User;

    @ManyToOne('Event', 'attendees')
    event!: Event;

    @CreateDateColumn()
    joinedAt!: Date;
} 