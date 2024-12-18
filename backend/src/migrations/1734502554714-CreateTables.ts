import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1734502554714 implements MigrationInterface {
    name = 'CreateTables1734502554714'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`event_attendees\` (\`event_id\` varchar(255) NOT NULL, \`user_id\` varchar(255) NOT NULL, PRIMARY KEY (\`event_id\`, \`user_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`events\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`date\` datetime NOT NULL, \`location\` varchar(255) NOT NULL, \`image_url\` varchar(255) NULL, \`available_places\` int NOT NULL, \`price\` decimal(10,2) NOT NULL, \`organizer_id\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`membership_level\` enum ('free', 'paid') NOT NULL DEFAULT 'free', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`event_attendees\` ADD CONSTRAINT \`FK_c296e70709cd6f4cb6b4e3e7e2a\` FOREIGN KEY (\`event_id\`) REFERENCES \`events\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`event_attendees\` ADD CONSTRAINT \`FK_ff98c4d7c3e85237115140cf69e\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`events\` ADD CONSTRAINT \`FK_14c9ce53a2c2a1c781b8390123e\` FOREIGN KEY (\`organizer_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`events\` DROP FOREIGN KEY \`FK_14c9ce53a2c2a1c781b8390123e\``);
        await queryRunner.query(`ALTER TABLE \`event_attendees\` DROP FOREIGN KEY \`FK_ff98c4d7c3e85237115140cf69e\``);
        await queryRunner.query(`ALTER TABLE \`event_attendees\` DROP FOREIGN KEY \`FK_c296e70709cd6f4cb6b4e3e7e2a\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`events\``);
        await queryRunner.query(`DROP TABLE \`event_attendees\``);
    }

}
