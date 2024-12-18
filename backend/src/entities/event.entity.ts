import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { EventAttendee } from '../entities/event-attendee.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column('text')
  description!: string;

  @Column('datetime')
  date!: Date;

  @Column()
  location!: string;

  @Column({ nullable: true })
  image_url!: string;

  @Column()
  available_places!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price!: number;

  @Column()
  organizer_id!: string;

  @ManyToOne(() => User, user => user.organized_events)
  @JoinColumn({ name: 'organizer_id' })
  organizer!: User;

  @OneToMany(() => EventAttendee, attendee => attendee.event)
  attendees!: EventAttendee[];

  @CreateDateColumn()
  created_at!: Date;
} 