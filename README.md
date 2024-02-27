# Angular Authentication App with AWS Cognito

This project is an Angular application that implements user authentication
using AWS Cognito User Pools. It includes features such as sign up, sign
up confirmation, log in, and multi-factor authentication (MFA) with both
SMS and Time-based One-Time Password (TOTP) Authenticator.

## Features

- **User Registration**: New users can create an account.
- **User Confirmation**: Users can confirm their account after registration.
- **User Login**: Registered users can log in to the application.
- **MFA**: Users can secure their accounts using multi-factor
authentication. The application supports both SMS and TOTP Authenticator
methods.
- **Token Refresh**: The application includes a mechanism to refresh
tokens based on the expiry time of JSON Web Tokens (JWT).
- **MFA Toggle**: Users have the option to enable or disable MFA for their
accounts.

## Getting Started

These instructions will get you a copy of the project up and running on
your local machine for development and testing purposes.

### Prerequisites

- Node.js
- Angular CLI
- AWS Account

### Installation

1. Clone the repository.
2. Install the dependencies using `npm install`.
3. Configure your AWS credentials.
4. Run the application using `ng serve`.

