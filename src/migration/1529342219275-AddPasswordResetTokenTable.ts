import {MigrationInterface, QueryRunner} from "typeorm";

export class AddPasswordResetTokenTable1529342219275 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "password_reset_token" ("user" uuid NOT NULL, "expires" TIMESTAMP WITH TIME ZONE NOT NULL, "token" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "UQ_6c50e3a3bee2912c1153c63aa64" UNIQUE ("token"), CONSTRAINT "REL_a4e53583f7a8ab7d01cded46a4" UNIQUE ("userId"), CONSTRAINT "PK_c0626d42be14a99cd9871b74fd1" PRIMARY KEY ("user"))`);
        await queryRunner.query(`ALTER TABLE "password_reset_token" ADD CONSTRAINT "FK_a4e53583f7a8ab7d01cded46a41" FOREIGN KEY ("userId") REFERENCES "user"("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "password_reset_token" DROP CONSTRAINT "FK_a4e53583f7a8ab7d01cded46a41"`);
        await queryRunner.query(`DROP TABLE "password_reset_token"`);
    }

}
