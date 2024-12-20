import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { EventAttendee } from '../entities/event-attendee.entity';

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

    @Column()
    price!: number;

    @Column({ nullable: true })
    image_url!: string;

    @Column()
    organizer_id!: string;

    @ManyToOne(() => User, user => user.created_events)
    creator!: User;

    @OneToMany(() => EventAttendee, eventAttendee => eventAttendee.event)
    attendees!: EventAttendee[];

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
} 