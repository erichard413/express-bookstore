const request = require("supertest");
const app = require("../app");
const db = require("../db");
const Book = require("../models/book")

process.env.NODE_ENV = "test";

describe("Books Routes Test", function () {

    beforeEach(async function () {
      await db.query("DELETE FROM books");
  
      const book = await Book.create({
        isbn: "0691161518",
        amazon_url: "http://a.co/eobPtX2",
        author: "Matthew Lane",
        language: "english",
        pages: 264,
        publisher: "Princeton University Press",
        title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
        year: 2017
      });
    });

    // GET ROUTES

    describe("Get / to list all books", ()=> {
        test("Retrieves list of all books", async()=> {
            const results = await request(app).get("/books");
            expect(results.statusCode).toBe(200);
            expect(results.text).toEqual(expect.stringContaining("Matthew Lane"));
        })
    })
    
    describe("Get /id to list single book", ()=> {
        test("Retrieves book with id", async () => {
            const result = await request(app).get(`/books/0691161518`);
            expect(result.statusCode).toBe(200);
            expect(result.text).toEqual(expect.stringContaining("Power-Up"));
        })
        test("Retrieves book with INVALID id", async () => {
            const result = await request(app).get(`/books/IAMINVALID`);
            expect(result.statusCode).toBe(404);
        })
    })
    
    // POST ROUTES
    describe("POST /", ()=> {
        test("Creates a new book", async () => {
            const result = await request(app).post('/books').send(
                {
                    "isbn": "1111111111",
                    "amazon_url": "http://a.co/test1",
                    "author": "Test Test",
                    "language": "english",
                    "pages": 100,
                    "publisher": "Fake Books Inc",
                    "title": "How to Write Better Tests",
                    "year": 2022
                  });
            expect(result.statusCode).toBe(201);
            expect(result.text).toEqual(expect.stringContaining("Fake Books Inc"));
        });
        test("Creates a new book with invalid data", async () => {
            const result = await request(app).post('/books').send(
                {
                    "isbn": "1111111111",
                    "amazon_url": "http://a.co/test1",
                    "author": 123,
                    "language": "english",
                    "pages": "INVALID",
                    "publisher": "Fake Books Inc",
                    "title": "How to Write Better Tests",
                    "year": "INVALID"
                  });
            expect(result.statusCode).toBe(404);
        });
    });
    // PUT ROUTES

    describe("PUT /isbn", ()=>{
        test("Updates book by isbn", async () => {
            const result = await request(app).put('/books/0691161518').send(
                {
                    "isbn": "0691161518",
                    "amazon_url": "http://a.co/eobPtX2",
                    "author": "Test Name",
                    "language": "english",
                    "pages": 264,
                    "publisher": "Princeton University Press",
                    "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                    "year": 2017
                  }
            );
            expect(result.statusCode).toBe(200);
            expect(result.text).toEqual(expect.stringContaining("Test Name"));
        })
        test("Updates book by INVALID isbn", async () => {
            const result = await request(app).put('/books/0691161518').send(
                {
                    "isbn": "INVALID",
                    "amazon_url": "http://a.co/eobPtX2",
                    "author": "Test Name",
                    "language": "english",
                    "pages": 264,
                    "publisher": "Princeton University Press",
                    "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                    "year": 2017
                  }
            );
            expect(result.statusCode).toBe(200);
        });        
        test("Updates book by INVALID isbn", async () => {
            const result = await request(app).put('/books/0691161518').send(
                {
                    "isbn": "INVALID",
                    "amazon_url": "http://a.co/eobPtX2",
                    "author": 123,
                    "language": "english",
                    "pages": "INVALID",
                    "publisher": "Princeton University Press",
                    "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                    "year": "INVALID"
                  });
            expect(result.statusCode).toBe(404);
        });
    });
    // DELETE ROUTE
    describe("DELETE /isbn", ()=> {
        test("Deletes book by isbn", async()=>{
            const result = await request(app).delete('/books/0691161518');
            expect(result.statusCode).toBe(200);
            expect(result.text).toEqual("{\"message\":\"Book deleted\"}");
        })
    })

    afterAll(async function () {
    await db.end();
    });
});

