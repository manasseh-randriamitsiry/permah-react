import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from './user.entity.js';
import { EventAttendee } from './event-attendee.entity.js';

@Entity('events')
export class Event {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column()
    description!: string;

    @Column()
    date!: Date;

    @Column()
    location!: string;

    @Column()
    image_url!: string;

    @Column()
    available_places!: number;

    @Column()
    price!: number;

    @Column({ name: 'organizer' })
    organizer!: string;

    @Column({ name: 'creator_id' })
    creator_id!: number;

    @CreateDateColumn()
    created_at!: Date;

    @ManyToOne(() => User, (user: User) => user.createdEvents, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'creator_id' })
    creator!: User;

    @OneToMany(() => EventAttendee, (attendee: EventAttendee) => attendee.event)
    attendees!: EventAttendee[];
} 