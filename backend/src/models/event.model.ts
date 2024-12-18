import { RowDataPacket } from 'mysql2';

export interface IEvent extends RowDataPacket {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  image_url: string | null;
  available_places: number;
  price: number;
  organizer_id: string;
  created_at: Date;
}

// SQL for creating events table:
/*
CREATE TABLE events (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  date DATETIME NOT NULL,
  location VARCHAR(255) NOT NULL,
  organizer_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (organizer_id) REFERENCES users(id)
);

CREATE TABLE event_participants (
  event_id VARCHAR(36),
  user_id VARCHAR(36),
  PRIMARY KEY (event_id, user_id),
  FOREIGN KEY (event_id) REFERENCES events(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
*/ 