import {MigrationInterface, QueryRunner} from 'typeorm';

export class MigracionUsuario1583873676081 implements MigrationInterface {
    name = 'MigracionUsuario1583873676081';

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE usuario (id SERIAL, nombre varchar(255) NOT NULL, clave varchar(255) NOT NULL, "fechaCreacion" timestamp NOT NULL, PRIMARY KEY (id))`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP TABLE `usuario`", undefined);
    }

}
