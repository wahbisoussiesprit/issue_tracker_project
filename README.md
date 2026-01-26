# Issue Tracker – Full‑Stack DevOps 

A modern full‑stack **Issue Tracker** application built for portfolio and DevOps practice.

# Diagrams Related

(ContainerView-dark.png)

It demonstrates:

- Secure **Spring Boot 3** REST API with JWT auth and RBAC
- Responsive **Angular 20 + Tailwind** frontend with dark mode
- **MySQL 8** persistence
- **Docker Compose** for full‑stack containers
- **Jenkins CI/CD pipeline** (via `Jenkinsfile`)
- Vagrant‑based DevOps lab environment

---

## 1. TL;DR – How to Run

### Option A – Full stack in Vagrant + Docker (recommended)

On your **Windows host**, from the project root:

```bash
# 1) Start / reload the DevOps VM
vagrant up        # or: vagrant reload

# 2) SSH into VM
vagrant ssh
cd /vagrant       # project root inside the VM

# 3) Build and run Docker containers
docker-compose build
docker-compose up -d

# 4) Check from inside VM
curl http://localhost:8081/api/issues   # [] or JSON
curl -I http://localhost:4200           # nginx serving Angular
```

Then on your **Windows host browser**:

- Frontend UI: `http://localhost:4200`
- Backend API: `http://localhost:8081/api` (e.g. `/api/issues`)

> Vagrant port forwards are defined in `Vagrantfile`:
> - 4200 → Angular/nginx frontend  
> - 8081 → Spring Boot backend

---

### Option B – Run locally without Docker (dev mode)

#### Backend only

```bash
cd backend/issuetracker

# Build and run (with Maven wrapper or mvn if installed)
./mvnw spring-boot:run          # Linux/macOS
# or
mvn spring-boot:run             # if Maven is installed
```

Backend API runs at: `http://localhost:8080/api`

#### Frontend dev server

```bash
cd frontend/issue-tracker-frontend

npm install         # once
npm start           # or: npx ng serve
```

Frontend runs at: `http://localhost:4200`

For this mode, set `environment.ts`:

```ts
export const environment = {
  production: false,
  apiBase: 'http://localhost:8080/api'
};
```

---

## 2. Features

### Core app

- **Authentication & Roles**
  - JWT‑based login/register
  - Roles: `ADMIN`, `USER` (extensible)
  - Protected endpoints and role‑based UI

- **Issues**
  - CRUD operations (create, view, update, delete)
  - Fields: title, description, status, priority, assignee, project, due date, tags
  - Status: `OPEN`, `IN_PROGRESS`, `CLOSED`
  - Priority: `LOW`, `MEDIUM`, `HIGH`
  - Due date badges with **overdue highlighting**
  - Tag chips (e.g. `#bug`, `#api`, `#frontend`)

- **Projects & Users**
  - Projects: CRUD with inline editing
  - Users: CRUD with inline editing
  - Admin‑only management screens

### UX / UI

- Modern layout using **Tailwind CSS**
- **Dark / light theme toggle** with persisted preference
- Navbar includes:
  - Auth‑aware links (Issues, New Issue, Projects, Users)
  - Welcome message with username
  - Logout & theme toggle
- Issue list as **cards**:
  - Status and priority color chips
  - Assignee avatar initials
  - Due date indicator (overdue in red)
  - Actions bar:
    - **Admin**: Edit + status dropdown + delete
    - **User**: status dropdown only

### Productivity features

- **Slide‑in drawer** for Create/Edit Issue
  - Keyboard shortcuts: `Esc` to cancel, `Ctrl+Enter` to save
  - Validation and inline messages
- **Search & Advanced Filters**
  - Quick search input
  - Status & priority filters
  - Advanced drawer:
    - Assignee
    - Project
    - Date range (from / to)
    - Tags
  - **Server‑side pagination + sorting**
  - URL query sync (filters & page state are shareable/bookmarkable)
- Lightweight toast notifications for success actions

---

## 3. Tech Stack

### Backend

- **Java 17**
- **Spring Boot 3**
  - Spring Web
  - Spring Data JPA (MySQL)
  - Spring Security with JWT
- MySQL 8
- Maven

### Frontend

- **Angular 20** (standalone components + SSR)
- Tailwind CSS
- TypeScript
- Nginx (for production container serving built Angular app)

### DevOps / Infrastructure

- **Docker & Docker Compose**
  - `mysql-issuetracker` (MySQL 8)
  - `backend-issuetracker` (Spring Boot)
  - `frontend-issuetracker` (Angular build served by nginx)
- **Vagrant + VirtualBox**
  - Ubuntu 22.04 DevOps lab VM
  - Port‑forwarded services (Jenkins, SonarQube, Prometheus, Grafana, Issue Tracker)
- **Jenkins**
  - Declarative pipeline in `Jenkinsfile`
  - Stages: checkout, backend build, frontend build, tests, artifact build, archive

---

## 4. Architecture Overview

### High‑level

- **Frontend** (Angular)
  - Talks to backend REST API via environment‑based base URL (`environment.apiBase`).
  - Runs as an nginx container in production (Docker).

- **Backend** (Spring Boot)
  - Exposes `/api` endpoints
  - Secured with JWT + role checks
  - Uses Spring Data JPA + MySQL for persistence
  - Serves JSON for Issues, Projects, Users, Auth flows

- **Database**
  - MySQL schema with tables for users, projects, issues, and relations.

- **Networking**
  - Docker Compose network:
    - `backend` connects to `mysql` as `jdbc:mysql://mysql:3306/issuetracker_db`
    - `frontend` (browser) calls backend via host URL (in Docker prod: `http://localhost:8081/api`).
  - Vagrant forwards VM ports to Windows host.

---

## 5. Docker Compose Details

**File:** `docker-compose.yml`

```yaml
services:
  mysql:
    image: mysql:8
    container_name: mysql-issuetracker
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: issuetracker_db
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  backend:
    build: ./backend/issuetracker
    container_name: backend-issuetracker
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/issuetracker_db
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: root
    ports:
      - "8081:8080"  # host 8081 → container 8080
    depends_on:
      - mysql

  frontend:
    build: ./frontend/issue-tracker-frontend
    container_name: frontend-issuetracker
    ports:
      - "4200:80"    # host 4200 → container 80
    depends_on:
      - backend

volumes:
  mysql_data:
```

---

## 6. Vagrant Networking

**File:** `Vagrantfile`

```ruby
Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/jammy64" # Ubuntu 22.04 LTS
  config.vm.hostname = "devops-ubuntu"
  
  # DevOps tools
  config.vm.network "forwarded_port", guest: 8080, host: 8080  # Jenkins
  config.vm.network "forwarded_port", guest: 9000, host: 9000  # SonarQube
  config.vm.network "forwarded_port", guest: 3000, host: 3000  # Grafana
  config.vm.network "forwarded_port", guest: 9090, host: 9090  # Prometheus

  # Issue Tracker app (Docker)
  config.vm.network "forwarded_port", guest: 4200, host: 4200, auto_correct: true
  config.vm.network "forwarded_port", guest: 8081, host: 8081, auto_correct: true

  # VM Resources
  config.vm.provider "virtualbox" do |vb|
    vb.name = "devops-lab"
    vb.memory = "4096"
    vb.cpus = 2
  end

  # Provisioning Script
  config.vm.provision "shell", path: "provision.sh"
end
```

After editing the Vagrantfile:

```bash
vagrant reload
```

---

## 7. Environments & API Base URLs

Angular uses environment files:

- `src/environments/environment.ts` (dev)

  ```ts
  export const environment = {
    production: false,
    apiBase: 'http://localhost:8080/api'
  };
  ```

- `src/environments/environment.prod.ts` (Docker/prod)

  ```ts
  export const environment = {
    production: true,
    apiBase: 'http://localhost:8081/api'
  };
  ```

So:

| Mode                               | Frontend URL             | Backend URL                 | apiBase used                  |
|-----------------------------------|--------------------------|-----------------------------|--------------------------------|
| Docker in Vagrant (production)    | `http://localhost:4200`  | `http://localhost:8081/api` | `environment.prod.apiBase`     |
| Local dev (no Docker)             | `http://localhost:4200`  | `http://localhost:8080/api` | `environment.apiBase`          |

---

## 8. Jenkins Pipeline (CI/CD)

**File:** `Jenkinsfile`

Typical pipeline stages:

1. **Checkout**
   ```groovy
   checkout scm
   ```

2. **Backend build**
   ```bash
   cd backend/issuetracker
   mvn clean package
   ```

3. **Frontend build**
   ```bash
   cd frontend/issue-tracker-frontend
   npm ci
   npm run build
   ```

4. **Docker image build**
   ```bash
   docker-compose build
   ```

5. **(Optional) Tests & Quality**
   - Unit tests / integration tests
   - SonarQube analysis

6. **Deploy**
   ```bash
   docker-compose up -d
   ```

This pipeline can run on Jenkins inside the Vagrant VM and produces the same result as your local commands.

---

## 9. Demo Script (for portfolio / video)

1. **Intro (10–20s)**
   - "This is a full‑stack Issue Tracker I built with Spring Boot, Angular, MySQL, Docker, and Jenkins. It supports JWT auth, roles, advanced filters, and a polished UI."

2. **Show architecture quickly**
   - Open `docker-compose.yml` and `Vagrantfile`.
   - Explain the three services (MySQL, backend, frontend) and port forwarding (4200, 8081).

3. **Bring up the stack (already running or fast‑forward)**
   - Show:
     ```bash
     vagrant up
     vagrant ssh
     cd /vagrant
     docker-compose up -d
     docker ps
     ```
   - Mention that Jenkins can run the same steps via the `Jenkinsfile`.

4. **Frontend tour**
   - Open `http://localhost:4200`.
   - Register & login (ADMIN).
   - Create issues with status, priority, due date, tags.
   - Show issue cards: colored chips, assignee, due date badge.
   - Show edit/delete and role‑based controls (ADMIN vs USER).
   - Use the Filters drawer: status/priority/assignee/project/dates/tags.
   - Show pagination + URL query sync.
   - Toggle dark mode.

5. **Backend/API**
   - Open `http://localhost:8081/api/issues` in browser or Postman.
   - Show responses and maybe a quick `curl` from VM.

6. **Wrap up**
   - Mention extensibility: Kanban, real‑time updates, analytics dashboard, etc.
   - Highlight DevOps: Jenkins, Docker, Vagrant, environments.

---

## 10. Future Improvements

- Real‑time updates via WebSockets or Server‑Sent Events
- Kanban board with drag‑and‑drop
- Comments & activity feed on issues
- Analytics dashboard (charts, throughput, lead time)
- More automated tests (unit, integration, e2e)
- Externalized secrets / config for production
