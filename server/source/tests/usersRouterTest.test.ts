import express from "express";
import request from "supertest";
import { usersRouter } from "../routes/usersRouter";
import http from 'http';
import supertest from "supertest";
import createServer from "../utils/mockServer";
import { generateToken } from "../../utils";
import { initDatabaseConnection } from "../config/db";
import connection from "../utils/mockDbConnection";
import { Users } from './../entity/Users';

const app = createServer();

beforeAll(async () => {
    await initDatabaseConnection();
  });
  
  afterAll(async () => {
    await connection.close();
  });

describe("POST /register", () => {
    describe("existing account check passed successfuly", () => {
        it("should return a 401 status and message about existing user", async () => {
            const {body, statusCode} = await supertest(app).post('/api/register').send({
                firstName: "Adam",
                lastName: "Nowak",
                email: "test@test.pl",
                password: "Test321"
            });

            expect(statusCode).toEqual(401);
        });
    });
});

describe("POST /login", () => {
    describe("such user exists", () => {
        it("should return a 200 status and user payload", async () => {
            const {body, statusCode} = await supertest(app).post('/api/login').send({
                email: "test@test.pl",
                password: "Test123"
            });
            
            const data = {
                id: body.id,
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email,
                role: body.role,
                token: body.token,
            };

            expect(statusCode).toEqual(200);

            expect(body).toEqual(data);
        });
    });
});