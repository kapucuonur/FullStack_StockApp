# Installation

## Install

```bash
npm install
# or
yarn
```

## Run (development)

```bash
npm start
# or
yarn start
```

## Build (production)

```bash
npm run build
# or
yarn build
```

## Libraries used

- @reduxjs/toolkit
- react-redux
- axios
- react-router-dom
- @mui/material
- @emotion/react
- @emotion/styled

## Live Example of the Application

https://stock-qg9tfa1ph-kapucuonurs-projects.vercel.app/

## Production environment / Deploy notes

- The client expects an environment variable named `REACT_APP_BASE_URL` at build time. Set it to your backend API base URL (include the `/api/v1` suffix), for example:

  `REACT_APP_BASE_URL=https://your-backend.example.com/api/v1`

- On platforms like Render or Vercel, add the above environment variable in the project's Settings → Environment before building.

- To build locally with a custom backend URL run:

```bash
# from the `client` folder
REACT_APP_BASE_URL=https://your-backend.example.com/api/v1 npm run build
```

- If you deploy the frontend and backend on different hosts, the frontend must be built with the backend URL so API calls go to the correct origin.

- For same-origin deployments (serving static build from the backend server), the default `REACT_APP_BASE_URL` is `/api/v1` and no extra config is required.

## Add `.env` (development)

- For local development you can create `client/.env` with:

```
REACT_APP_BASE_URL=http://localhost:10000/api/v1
```

Make sure `client/.env` is listed in `.gitignore` (it is), and do not commit secrets to the repo.

## Notes about build-time envs

- React reads `REACT_APP_` environment variables at build time and bakes them into the bundle. Changing runtime envs on the static server will not change the built API base — rebuild is required after changing `REACT_APP_BASE_URL`.
