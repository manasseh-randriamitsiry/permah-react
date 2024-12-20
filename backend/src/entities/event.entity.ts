import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import type { User } from './user.entity.js';
import type { EventAttendee } from './event-attendee.entity.js';

@Entity('events')
export class Event {
    @PrimaryGeneratedColumn('increment')
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

    @Column()
    price!: number;

    @Column({ nullable: true })
    image_url!: string;

    @Column()
    organizer_id!: number;

    @ManyToOne('User', 'created_events')
    creator!: User;

    @OneToMany('EventAttendee', 'event')
    attendees!: EventAttendee[];

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
} 