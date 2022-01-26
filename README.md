# Social Network Project

This project was realized when finishing my schoolarship at IFOCOP school. The goal was to make a social network with some functionnalities listed below:

* Connexion and registration
* Members and administrators authorizations
* Administrator panel
* Publications on friends and own walls
* Discussions between firends

## How to install this project?

### Prerequisites

Install Node.js which includes Node Package Manager

### Setting up this project

Clone this project. Enter into the project directory with `cd social-network`. The project is divided into 2 folders: `sn-front` for the front part and `sn-server` for the server part. For each folder, go into and type `npm install` to install all dependencies.

### Build

In the `sn-front` directory, run `ng build` to build the project. The build artifacts will be stored in the `sn-front/dist/` directory.

In the `sn-server` directory, run `npm run build` to build the project. The build artifacts will be stored in the `sn-server/dist/` directory.

### Database
This project need a MongoDB database. See an exemple in config.json at the root directory.

### Configuration

Create a configuration file named `./sn-server/src/config.ts` with this content:

```typescript
import { Secret } from "jsonwebtoken";

export const PORT = process.env.PORT || 3005;
export const mongoUri: "mongodb+srv://< login >:< password >@< mongDBuri >/social-network";

export const googleCredentials = {
  clientId: "",
  clientSecret: "",
  refresh_token: "",
  user: "",
};

export const site = {
  name: "Social Network",
};

export const secret: Secret = "";
```

Don't forget to replace `login`, `password` and `mongoDBuri` with your MongoDb credentials. Same for googleCredentials (or replace with other providers). Enter whatever secret pass you want.

Change if needed the server port here and in `sn-front/src/environments/environment.prod.ts`.

### Execute server

Enter in server directory with `cd sn-server/dist`. Run `node app.js`. Naviguate to `http://localhost:8095` or the port you provided in the config file.

### Development

You can serve these applications for development purpose.

In `sn-front` directory, type `ng serve`, it will build and serve the application to a local server and watch any change for a live reload.

In `sn-server` directory, type `npm run dev`, it will build, serve the application and watch any change for a live reload.

### Infos

This project uses Angular version 13.

The servers runs under node.js version 16.10.0, express version 4.17.1 and mongodb version 4.1.3.

All the project is written in typescript.