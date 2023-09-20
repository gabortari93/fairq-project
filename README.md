# FairQ
Fair, transparent and efficient waiting experiences

## Architecture

[Entity Relationship Diagram](/Users/amuedespacher/Dev/Bootcamp/fairq/docs/ERD.pdf)

### Frontend
* React (with Vite)

### Backend / API
* Django
* Django Rest Framework
* REST API (Swagger docs: /backend/api/docs)

### Database
* PostgreSQL

## DevOps

Step-by-step manual [can be found here](docs/ci_cd.md)

### Development
#### Backend (with Docker)
* Build image with `docker build .`
* Start servers with `docker compose up -d`

#### Frontend (on Host)
* `cd frontend`
* Ensure `node.js` is installed
* Install npm dependencies from `package.json` with `npm install`
* Start development server with `npm run dev`

### Deployment (with Gitlab CI)
* Commit to master / main branch
* Observe pipeline on Gitlab (Repo > CI/CD > Pipelines)