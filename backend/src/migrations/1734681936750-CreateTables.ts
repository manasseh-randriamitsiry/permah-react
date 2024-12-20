import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1734681936750 implements MigrationInterface {
    name = 'CreateTables1734681936750'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`event_attendees\` DROP FOREIGN KEY \`FK_c296e70709cd6f4cb6b4e3e7e2a\``);
        await queryRunner.query(`ALTER TABLE \`event_attendees\` DROP FOREIGN KEY \`FK_ff98c4d7c3e85237115140cf69e\``);
        await queryRunner.query(`ALTER TABLE \`events\` DROP FOREIGN KEY \`FK_14c9ce53a2c2a1c781b8390123e\``);
        await queryRunner.query(`ALTER TABLE \`event_attendees\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`event_attendees\` ADD PRIMARY KEY (\`user_id\`)`);
        await queryRunner.query(`ALTER TABLE \`event_attendees\` DROP COLUMN \`event_id\``);
        await queryRunner.query(`ALTER TABLE \`event_attendees\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`event_attendees\` DROP COLUMN \`user_id\``);
        await queryRunner.query(`ALTER TABLE \`events\` DROP COLUMN \`available_places\``);
        await queryRunner.query(`ALTER TABLE \`events\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`events\` DROP COLUMN \`image_url\``);
        await queryRunner.query(`ALTER TABLE \`events\` DROP COLUMN \`organizer_id\``);
        await queryRunner.query(`ALTER TABLE \`events\` DROP COLUMN \`price\``);
        await queryRunner.query(`ALTER TABLE \`event_attendees\` ADD \`id\` int NOT NULL PRIMARY KEY AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`event_attendees\` ADD \`userId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`event_attendees\` ADD \`eventId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`event_attendees\` ADD \`joinedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`events\` ADD \`maxAttendees\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`events\` ADD \`creatorId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`events\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`events\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`events\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`events\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`events\` ADD \`id\` int NOT NULL PRIMARY KEY AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`event_attendees\` ADD CONSTRAINT \`FK_07eb323a7b08ba51fe4b582f3f4\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`event_attendees\` ADD CONSTRAINT \`FK_21056813ffb169d392d38a40c2d\` FOREIGN KEY (\`eventId\`) REFERENCES \`events\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`events\` ADD CONSTRAINT \`FK_c621508a2b84ae21d3f971cdb47\` FOREIGN KEY (\`creatorId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`events\` DROP FOREIGN KEY \`FK_c621508a2b84ae21d3f971cdb47\``);
        await queryRunner.query(`ALTER TABLE \`event_attendees\` DROP FOREIGN KEY \`FK_21056813ffb169d392d38a40c2d\``);
        await queryRunner.query(`ALTER TABLE \`event_attendees\` DROP FOREIGN KEY \`FK_07eb323a7b08ba51fe4b582f3f4\``);
        await queryRunner.query(`ALTER TABLE \`events\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`events\` ADD \`id\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`events\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`events\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`events\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`events\` DROP COLUMN \`creatorId\``);
        await queryRunner.query(`ALTER TABLE \`events\` DROP COLUMN \`maxAttendees\``);
        await queryRunner.query(`ALTER TABLE \`event_attendees\` DROP COLUMN \`joinedAt\``);
        await queryRunner.query(`ALTER TABLE \`event_attendees\` DROP COLUMN \`eventId\``);
        await queryRunner.query(`ALTER TABLE \`event_attendees\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`event_attendees\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`events\` ADD \`price\` decimal NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`events\` ADD \`organizer_id\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`events\` ADD \`image_url\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`events\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`events\` ADD \`available_places\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`event_attendees\` ADD \`user_id\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`event_attendees\` ADD PRIMARY KEY (\`user_id\`)`);
        await queryRunner.query(`ALTER TABLE \`event_attendees\` ADD \`event_id\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`event_attendees\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`event_attendees\` ADD PRIMARY KEY (\`event_id\`, \`user_id\`)`);
        await queryRunner.query(`ALTER TABLE \`events\` ADD CONSTRAINT \`FK_14c9ce53a2c2a1c781b8390123e\` FOREIGN KEY (\`organizer_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`event_attendees\` ADD CONSTRAINT \`FK_ff98c4d7c3e85237115140cf69e\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`event_attendees\` ADD CONSTRAINT \`FK_c296e70709cd6f4cb6b4e3e7e2a\` FOREIGN KEY (\`event_id\`) REFERENCES \`events\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
