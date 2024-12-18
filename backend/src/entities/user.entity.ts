import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Event } from '../entities/event.entity';
import { EventAttendee } from '../entities/event-attendee.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

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

  @OneToMany(() => Event, event => event.organizer)
  organized_events!: Event[];

  @OneToMany(() => EventAttendee, attendee => attendee.user)
  event_attendees!: EventAttendee[];
} 