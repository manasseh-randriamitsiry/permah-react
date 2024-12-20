import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Event } from './event.entity';

@Entity('event_attendees')
export class EventAttendee {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    userId!: number;

    @Column()
    eventId!: number;

    @ManyToOne(() => User, user => user.created_events)
    user!: User;

    @ManyToOne(() => Event, event => event.attendees)
    event!: Event;

    @CreateDateColumn()
    joinedAt!: Date;
} 