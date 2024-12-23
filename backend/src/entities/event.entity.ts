import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import type { User } from './user.entity.js';
import type { EventAttendee } from './event-attendee.entity.js';

@Entity('events')
export class Event {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column('text')
    description!: string;

    @Column('datetime')
    date!: Date;

    @Column()
    location!: string;

    @Column()
    available_places!: number;

    @Column('decimal', { precision: 10, scale: 2 })
    price!: number;

    @Column({ nullable: true })
    image_url?: string;

    @Column()
    organizer_id!: number;

    @ManyToOne('User', (user: User) => user.createdEvents)
    creator!: User;

    @OneToMany('EventAttendee', (attendee: EventAttendee) => attendee.event)
    attendees!: EventAttendee[];

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
} 