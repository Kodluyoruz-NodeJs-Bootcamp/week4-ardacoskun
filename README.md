# Gusto & RemoteTeam Bootcamp Week-4

This project is about JWT and Session Authentication with TypeScript. Project starts with login page. If user does not have an account, needs to visit sign up page.
After registration, the user is directed to the dashboard page.If user correctly enters the credentials,directed to the login page. After logging in, the user's unique id and browser informations are kept in session and in token. If user's browser informations which kept in session and token does not match with each others, user can not be authenticated.If users wants to update their account or add profile picture. Also users can delete their account if they want to.

# [Live Demo](https://typeormauthv2.herokuapp.com/)

### Main dev tools used:

`NodeJS & ExpressJS` - `TypeOrm` - `MySQL` - `Typescript` - `EJS`

#### Other Dependencies

- [JsonWebToken](https://www.npmjs.com/package/jsonwebtoken)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [multer](https://www.npmjs.com/package/multer)

## Installation

Clone the project to your local repository

```bash
https://github.com/Kodluyoruz-NodeJs-Bootcamp/week4-ardacoskun.git
```

Install the dependencies of the project

```bash
npm install
```

## Usage

```bash
npm run build
```

```bash
npm start
```

## Database Table

![Ekran Alıntısı](https://user-images.githubusercontent.com/92170066/151717548-e6e2076c-6d26-4833-b70d-03f14968ca0d.PNG)



## License

[MIT](https://choosealicense.com/licenses/mit/)
