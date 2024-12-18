import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Event } from './event.entity';

@Entity('event_attendees')
export class EventAttendee {
  @PrimaryColumn()
  event_id!: string;

  @PrimaryColumn()
  user_id!: string;

  @ManyToOne(() => Event, event => event.attendees)
  @JoinColumn({ name: 'event_id' })
  event!: Event;

  @ManyToOne(() => User, user => user.event_attendees)
  @JoinColumn({ name: 'user_id' })
  user!: User;
} 