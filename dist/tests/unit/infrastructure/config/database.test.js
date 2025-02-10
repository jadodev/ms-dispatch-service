"use strict";
describe('Database Pool Module', () => {
    beforeEach(() => {
        jest.resetModules();
    });
    describe('when environment variables are set', () => {
        beforeEach(() => {
            process.env.MYSQL_HOST = 'testHost';
            process.env.MYSQL_PORT = '1234';
            process.env.MYSQL_USER = 'testUser';
            process.env.MYSQL_PASSWORD = 'testPassword';
            process.env.MYSQL_DATABASE = 'testDb';
            try {
                delete require.cache[require.resolve('../../../../infrastructure/config/database')];
            }
            catch (e) {
            }
        });
        it('should call dotenv.config() and create pool with the provided environment variables', () => {
            jest.doMock('dotenv', () => ({
                config: jest.fn()
            }));
            jest.doMock('mysql2/promise', () => ({
                createPool: jest.fn(() => ({}))
            }));
            const dotenvMock = require('dotenv');
            const mysqlMock = require('mysql2/promise');
            require('../../../../infrastructure/config/database');
            expect(dotenvMock.config).toHaveBeenCalled();
            expect(mysqlMock.createPool).toHaveBeenCalledWith({
                host: 'testHost',
                port: 1234,
                user: 'testUser',
                password: 'testPassword',
                database: 'testDb',
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0
            });
        });
    });
    describe('when environment variables are missing', () => {
        beforeEach(() => {
            delete process.env.MYSQL_HOST;
            delete process.env.MYSQL_PORT;
            delete process.env.MYSQL_USER;
            delete process.env.MYSQL_PASSWORD;
            delete process.env.MYSQL_DATABASE;
            jest.resetModules();
            try {
                delete require.cache[require.resolve('../../../../infrastructure/config/database')];
            }
            catch (e) { }
        });
        it('should create pool with default values', () => {
            jest.doMock('mysql2/promise', () => ({
                createPool: jest.fn(() => ({}))
            }));
            const mysqlMock = require('mysql2/promise');
            require('../../../../infrastructure/config/database');
            expect(mysqlMock.createPool).toHaveBeenCalledWith({
                host: 'mysql',
                port: 3306,
                user: 'user',
                password: 'password',
                database: 'mydb',
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0
            });
        });
    });
});
