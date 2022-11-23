// import the server

const mongoose = require('mongoose');
const request = require('supertest');
const {app} = require('../src/server');

// establish a connection to the database

const {databaseConnector, databaseDisconnector} = require('../src/database');
const DATABASE_URI = process.env.DATABASE_URI || 'mongodb://localhost:27017/SomeTestDatabase'

// beforeEach and afterEach will set up before-tests and after tests operations (connect and disconnect, so it won't hang around if there's no activities)

beforeEach(async () => {
    await databaseConnector(DATABASE_URI);
})

afterEach(async () => {
    await databaseDisconnector();
})

// The tests
describe('Server homepage...', () => {
    it("shows a connection status", async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toEqual(200);
        expect(response.text).toEqual(expect.stringContaining("connected"));
    })
})

describe('Create user in MongoDB account', () => {
    it("lets you make a user database", async () => {
        const response = await request(app).post('/employees').send({
            name: "displayName",        
            employeeID: "employeeID",
            Monday: "Monday",
            Tuesday: "Tuesday",
            Wednesday: "Wednesday",
            Thursday: "Thursday",
            Friday: "Friday",
            Saturday: "Saturday",
            Sunday: "Sunday"
        });
        expect(response.statusCode).toEqual(200);
    })
})

describe('Create user in Firebase account', () => {
    it("lets you make a user account", async () => {
        const response = await request(app).post('/users/sign-up').send({
            email: "clientAccount@client.com",
            password: "password1",
            displayName: "clientAccount"
        });
        expect(response.statusCode).toEqual(200);
    })
})

describe('Get all users in mongoDB account', () => {
    it("lets you get all user accounts in MongoDB", async () => {
        const response = await request(app).get('/employees');
        expect(response.statusCode).toEqual(200);
    })
})

describe('Get all users in Firebase account', () => {
    it("lets you get all user accounts in Firebase", async () => {
        const response = await request(app).get('/users');
        expect(response.statusCode).toEqual(200);
    })
})

describe('Get one user in MongoDB account', () => {
    it("lets you search a specific user", async () => {
        const response = await request(app).get('/employees/637c9d2fc17ed96188da8041');
        expect(response.statusCode).toEqual(200);
    })
})

describe('Get one user in MongoDB account', () => {
    it("lets you search a specific user", async () => {
        const response = await request(app).get('/employees/637c9d2fc17ed96188da8041');
        expect(response.statusCode).toEqual(200);
    })
})

describe('Update user rosters in MongoDB account', () => {
    it("lets you update rosters", async () => {
        const response = await request(app).put('/employees/637c764620a8931cc01b559c').send({
            Monday: "9am - 5pm",
            Tuesday: "9am - 5pm",
            Wednesday: "9am - 5pm",
            Thursday: "9am - 5pm",
            Friday: "9am - 5pm",
            Saturday: "Day off",
            Sunday: "Day off"
        });
        expect(response.statusCode).toEqual(200);
    })
})

describe('Sign out user account', () => {
    it("lets you to sign out", async () => {
        const response = await request(app).post('/users/sign-out');
        expect(response.statusCode).toEqual(200);
    })
})

describe('Sign in user account', () => {
    it("lets you to sign in", async () => {
        const response = await request(app).post('/users/sign-in').send({
            email: "clientAccount@client.com",
            password: "password1"
        });
        expect(response.statusCode).toEqual(200);
    })
})

describe('Delete one user in MongoDB account', () => {
    it("lets you delete a user database", async () => {
        const response = await request(app).delete('/employees/637c9d2fc17ed96188da8041');
        expect(response.statusCode).toEqual(200);
    })
})

describe('Delete one user in firebase account', () => {
    it("lets you delete a user account", async () => {
        const response = await request(app).delete('/users/delete/2A53aSBssvSAmwXGyczdS9QWO5C2');
        expect(response.statusCode).toEqual(200);
    })
})