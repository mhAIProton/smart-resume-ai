import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserSubscriptionStatus1757668877691 implements MigrationInterface {
    name = 'UpdateUserSubscriptionStatus1757668877691'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "isActive" TO "subscriptionStatus"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "totalGenerations" SET DEFAULT '3'`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "subscriptionStatus"`);
        await queryRunner.query(`CREATE TYPE "public"."users_subscriptionstatus_enum" AS ENUM('active', 'canceling', 'canceled')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "subscriptionStatus" "public"."users_subscriptionstatus_enum" NOT NULL DEFAULT 'active'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "subscriptionStatus"`);
        await queryRunner.query(`DROP TYPE "public"."users_subscriptionstatus_enum"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "subscriptionStatus" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "totalGenerations" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "subscriptionStatus" TO "isActive"`);
    }

}
