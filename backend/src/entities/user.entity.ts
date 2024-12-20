import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import type { Event } from './event.entity.js';
import type { EventAttendee } from './event-attendee.entity.js';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('increment')
    id!: number;

    @Column()
    email!: string;

    @Column()
    password!: string;

    @Column()
    name!: string;

    @Column({
        type: 'enum',
        enum: ['free', 'paid'],
        default: 'free'
    })
    membership_level!: 'free' | 'paid';

    @CreateDateColumn()
    created_at!: Date;

    @OneToMany('Event', 'creator')
    created_events!: Event[];

    @OneToMany('EventAttendee', 'user')
    event_attendees!: EventAttendee[];
} 