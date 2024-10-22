# Project Name

A NestJS-based application for user authentication, wallet management, and transaction processing. This project includes features like user registration, login with OTP verification, JWT-based authentication, and ledger-based transactions.

## Table of Contents

- [Project Overview](#project-overview)
- [Technologies](#technologies)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Running Tests](#running-tests)
- [API Documentation](#api-documentation)
    - [User Registration](#user-registration)
    - [Login and OTP Verification](#login-and-otp-verification)
    - [Transactions](#transactions)
    - [Ledger](#ledger)

## Project Overview

This project handles:

1. **User Registration and Authentication**:
    - Users register and verify their email via OTP.
    - Devices are registered during login and OTP verification.
    - JWT-based authentication is used for all authenticated endpoints.

2. **Wallet and Asset Management**:
    - Users can manage multiple wallets in different asset types (Naira, Dollar, Pounds, Euro).
    - Transactions between users are recorded in a ledger.

3. **Transaction Management**:
    - A user can send funds to another user.
    - All transactions are logged in a ledger with asset type management.

---

## Technologies

- **Node.js**
- **NestJS** (with TypeORM)
- **PostgreSQL**
- **JWT for authentication**
- **Swagger for API documentation**
- **Jest for unit testing**
- **Bcrypt for password hashing**

---

## Setup Instructions

### 1. Clone the Repository

```bash
https://github.com/benjosiah/gowagrTest.git
cd project
```
# gowagrTest

### 2. Install Dependencies

```bash
npm install
```


### 3. Setup the Database
Ensure you have PostgreSQL installed and running. Create a new PostgreSQL database.

```sql
CREATE DATABASE your_db_name;
```
### 4. Configure Environment Variables
Create a .env file at the root of your project. The required environment variables are listed below.

Environment Variables
Set up the .env file with the following environment variables:

```
# Application
APP_PORT=3000

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

# Email Service (SMTP Configurations)
EMAIL_HOST=smtp.yourservice.com
EMAIL_PORT=587
EMAIL_USERNAME=your_email_username
EMAIL_PASSWORD=your_email_password
EMAIL_FROM=noreply@yourdomain.com
```
### 5. Run Migrations
   Before starting the application, make sure to run the database migrations:

```bash
npm run typeorm:migration:run
```
### 6. Start the Application
   To start the server, use:

```bash
npm run start:dev
```
This will start the server on http://localhost:3000.

## Running Tests
To run unit tests for this project, use:

``` bash Copy code
npm run test
```

## API Documentation
This project uses Swagger for API documentation. Once the server is running, you can access the documentation by visiting:

```bash
Copy code
http://localhost:3000/api
```
Below are some of the main API endpoints:

### User Registration

Endpoint: POST /users/register

Description: Registers a new user by sending an OTP to their email for verification.

Request Body:

```json
{
"email": "user@example.com",
"username": "johndoe",
"firstName": "John",
"lastName": "Doe"
}
```
Response:

```json
{
"id": "user-uuid",
"email": "user@example.com",
"otp": "123456"
}
```
Login and OTP Verification
1. Login

Endpoint: POST /auth/login

Description: Logs in a user using email and password. If it's the first time logging in on a new device, an OTP will be sent.

Request Body:

```json

{
"email": "user@example.com",
"password": "password123",
"deviceId": "device-uuid"
}
```
Response: (For new device)

```json

{
"email": "user@example.com",
"accessToken": null
}
```
Response: (For existing device)

```json

{
"id": "user-uuid",
"email": "user@example.com",
"accessToken": "jwt-token"
}
```
2. OTP Verification

Endpoint: POST /auth/verify-otp

Description: Verifies the OTP sent to the user's email.

Request Body:

```json

{
"email": "user@example.com",
"otp": "123456",
"deviceName": "iPhone 12",
"browserName": "Safari"
}
```
Response:

```json

{
"accessToken": "jwt-token"
}
```
Transactions
Endpoint: POST /transfers

Description: Initiates a transfer between users.

Request Body:

```json

{
"from": "senderUsername",
"to": "receiverUsername",
"assetType": "naira",
"amount": 100.50,
"description": "Payment for services"
}
```
Response:

```json

{
"id": "transaction-id",
"reference": "TX12345",
"status": "pending",
"from": "senderUsername",
"to": "receiverUsername",
"assetType": "naira",
"amount": 100.50,
"description": "Payment for services"
}

```
Ledger
Endpoint: GET /users/:id

Description: Fetches the user details along with wallet balance.

Response:

```json

{
"id": "user-uuid",
"username": "johndoe",
"email": "user@example.com",
"firstName": "John",
"lastName": "Doe",
"wallets": [
{
"id": "wallet-id",
"balance": 500.00,
"type": "naira"
}
]
}
```
## License
This project is licensed under the MIT License.


