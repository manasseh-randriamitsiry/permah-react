import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import type { Event } from './event.entity.js';
import type { EventAttendee } from './event-attendee.entity.js';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @CreateDateColumn()
    created_at!: Date;

    @OneToMany('Event', (event: Event) => event.creator)
    createdEvents!: Event[];

    @OneToMany('EventAttendee', (attendee: EventAttendee) => attendee.user)
    attendedEvents!: EventAttendee[];
} 