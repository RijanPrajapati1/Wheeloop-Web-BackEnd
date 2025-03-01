require("dotenv").config();
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app"); // Ensure this is your main Express app
const Cred = require("../model/cred");

chai.use(chaiHttp);
const { expect } = chai;

let testUser = {
    email: "testuser@example.com",
    password: "Test@1234",
    full_name: "Test User",
    address: "Test Address",
    phone_number: "1234567890"
};

let authToken = "";
let userId = "";

describe("Cred API Tests", function () {
    this.timeout(10000); // Increase timeout for DB operations

    // **Cleanup before running tests**
    before(async () => {
        await Cred.deleteMany({ email: testUser.email }); // Remove existing test data
    });

    // **1. Register a New User**
    it("should register a new user", (done) => {
        chai.request(app)
            .post("/api/cred/register")
            .send(testUser)
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.have.property("message", "You have successfully registered.");
                userId = res.body.user._id;
                done();
            });
    });

    // **2. Login User**
    it("should log in the user and return a token", (done) => {
        chai.request(app)
            .post("/api/cred/login")
            .send({ email: testUser.email, password: testUser.password })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property("token");
                expect(res.body).to.have.property("role");
                authToken = res.body.token;
                done();
            });
    });

    // **3. Fetch All Users**
    it("should fetch all users", (done) => {
        chai.request(app)
            .get("/api/cred/users")
            .set("Authorization", `Bearer ${authToken}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an("array");
                done();
            });
    });

    // **4. Fetch User by ID**
    it("should fetch a user by ID", (done) => {
        chai.request(app)
            .get(`/api/cred/users/${userId}`)
            .set("Authorization", `Bearer ${authToken}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property("_id", userId);
                done();
            });
    });

    // **5. Update User Details**
    it("should update user details", (done) => {
        chai.request(app)
            .put(`/api/cred/users/${userId}`)
            .set("Authorization", `Bearer ${authToken}`)
            .send({ address: "Updated Address" })
            .end((err, res) => {
                expect(res).to.have.status(202);
                expect(res.body).to.have.property("address", "Updated Address");
                done();
            });
    });

    // **6. Delete User**
    it("should delete a user by ID", (done) => {
        chai.request(app)
            .delete(`/api/cred/users/${userId}`)
            .set("Authorization", `Bearer ${authToken}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.text).to.equal("User deleted");
                done();
            });
    });
});
