# VokeyQuiz

VokeyQuiz is a dynamic and interactive quiz web application built using HTML, CSS, and JavaScript.  
This repository is integrated with a DevOps pipeline using GitHub Actions for CI/CD, Docker for containerization, and Nginx for static content serving.

---

## Features

- Interactive quiz generation from custom user input
- Timer-based question answering
- Dynamic dark/light theme toggle
- Sidebar navigation between questions
- Score summary and result display
- Responsive and animated UI
- Automated CI/CD using GitHub Actions
- Dockerized deployment with Nginx

---

## Tech Stack

| Technology | Purpose |
|-------------|----------|
| HTML5 | Structure of the web app |
| CSS3 | Styling and dark mode support |
| JavaScript | Application logic and interactivity |
| Nginx | Static web server |
| Docker | Containerization |
| GitHub Actions | Continuous Integration and Deployment |

---

## DevOps Pipeline Overview

The project uses GitHub Actions for CI/CD automation.  
Whenever code is pushed to the `main` branch:

1. The repository is checked out.
2. HTML, CSS, and JS files are validated.
3. A Docker image is built.
4. The project is automatically deployed to **GitHub Pages**.

---

## Folder Structure

```
VokeyQuiz/
│
├── index.html
├── style.css
├── script.js
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
└── .github/
    └── workflows/
        └── deploy.yml
```

---

## CI/CD Workflow

### File: `.github/workflows/deploy.yml`

This workflow performs the following tasks:
- Validates HTML, CSS, and JavaScript syntax.
- Builds a Docker image for the project.
- Deploys the latest version to GitHub Pages.

---

## Docker Setup

### Build Docker Image
```bash
docker build -t vokeyquiz .
```

### Run Container
```bash
docker run -d -p 8080:80 vokeyquiz
```

Access the app in your browser at:
```
http://localhost:8080
```

---

## Docker Compose Setup

You can also use Docker Compose for simplified deployment:

### Run
```bash
docker-compose up -d
```

### Stop
```bash
docker-compose down
```

---

## nginx.conf

A custom Nginx configuration file is included to serve static files and handle 404 responses gracefully.

---

## Local Development

For local testing without Docker:
1. Open `index.html` in your browser, or
2. Use VS Code’s **Live Server** extension.

---

## Contributing

Contributions, bug reports, and feature requests are welcome.  
Please fork the repository and create a pull request.

