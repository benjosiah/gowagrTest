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
git clone https://github.com/your-repo/project.git
cd project
# gowagrTest
