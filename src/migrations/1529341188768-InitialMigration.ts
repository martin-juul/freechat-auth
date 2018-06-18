import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialMigration1529341188768 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "password" character varying NOT NULL, "email" character varying NOT NULL, "avatar" character varying, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "auth_token" ("token" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_7a74281711d1a581b4dcc4d59ff" PRIMARY KEY ("token"))`);
        await queryRunner.query(`ALTER TABLE "auth_token" ADD CONSTRAINT "FK_5a326267f11b44c0d62526bc718" FOREIGN KEY ("userId") REFERENCES "user"("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "auth_token" DROP CONSTRAINT "FK_5a326267f11b44c0d62526bc718"`);
        await queryRunner.query(`DROP TABLE "auth_token"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
