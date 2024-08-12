## Local Setup

### Backend Setup

- navigate to `backend` directory and use `yarn install` or simply `yarn` to install dependencies
- create a `.env` file from `.env.example` and fill the fields
- replace all `https://taskmanager-production-0377.up.railway.app` with `http://localhost:3000`
- `https://taskmanager-production-0377.up.railway.app` is the deployed backend public url
- fire up the local backend server with `yarn dev`

### Frontend setup

- navigate to `index.html` and simply use `Live Server Extension` from `vscode marketplace` to start the frontend
- front end deployed to `https://incomparable-travesseiro-29e254.netlify.app`

## Note:

- If the app gives cors issues on Chrome, please disable cross origin security and try again. High chances to happen on chrome while local development
