pipeline {
    agent any

    tools {
        jdk 'Java17'
        maven 'maven-3.6.3'
        nodejs 'Node20'
    }

    environment {
        BACKEND_DIR  = 'backend/issuetracker'
        FRONTEND_DIR = 'frontend/issue-tracker-frontend'
        COMPOSE_DIR  = '/vagrant'     // Jenkins and docker are inside same VM
    }

    stages {

        /* -----------------------------
         *  CHECKOUT CODE
         * ----------------------------- */
        stage('Checkout') {
            steps {
                echo "📥 Pulling latest code from GitHub..."
                git branch: 'main', url: 'https://github.com/wahbisoussiesprit/issue_tracker_project.git'
                sh 'ls -alh'
            }
        }

        /* -----------------------------
         *  BACKEND BUILD
         * ----------------------------- */
        stage('Backend Build') {
            steps {
                dir("${BACKEND_DIR}") {
                    echo '⚙️ Building backend JAR...'
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        /* -----------------------------
         *  SONARQUBE ANALYSIS
         * ----------------------------- */
        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'SonarScanner'
                    withSonarQubeEnv('SonarQube') {
                        dir("${BACKEND_DIR}") {
                            sh """
                                ${scannerHome}/bin/sonar-scanner \
                                -Dsonar.projectKey=issue-tracker \
                                -Dsonar.sources=src \
                                -Dsonar.java.binaries=target
                            """
                        }
                    }
                }
            }
        }

        /* -----------------------------
         *  FRONTEND BUILD
         * ----------------------------- */
        stage('Frontend Build') {
            steps {
                dir("${FRONTEND_DIR}") {
                    echo '🧱 Building Angular frontend...'
                    sh 'npm ci --no-audit --no-fund'
                    sh 'npm run build'
                }
            }
        }

        /* -----------------------------
         *  ARCHIVE ARTIFACTS
         * ----------------------------- */
        stage('Archive Artifacts') {
            steps {
                echo "📦 Saving build artifacts..."
                archiveArtifacts artifacts: '**/target/*.jar', fingerprint: true
                archiveArtifacts artifacts: 'frontend/issue-tracker-frontend/dist/**', fingerprint: true
            }
        }

        /* -----------------------------
         *  🐳 CI/CD DEPLOYMENT
         * ----------------------------- */
        stage('Deploy to Docker') {
            steps {
                echo "🚀 Deploying using Docker Compose..."

                sh """
                    cd ${COMPOSE_DIR}
                    echo "📌 Stopping old containers..."
                    docker compose down

                    echo "📌 Rebuilding images..."
                    docker compose build

                    echo "📌 Starting updated containers..."
                    docker compose up -d
                """
            }
        }

        /* -----------------------------
         *  DONE
         * ----------------------------- */
        stage('Finish') {
            steps {
                echo '🎉 CI/CD pipeline completed successfully!'
            }
        }
    }

    post {
        failure {
            echo '❌ Pipeline failed!'
        }
    }
}
