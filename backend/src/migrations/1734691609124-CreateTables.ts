import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1734691609124 implements MigrationInterface {
    name = 'CreateTables1734691609124'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Your migration code here
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Your rollback code here
    }
}
