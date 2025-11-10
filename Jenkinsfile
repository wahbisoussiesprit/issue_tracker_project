pipeline {
    agent any

    tools {
        jdk 'Java17'              // must match Jenkins Global Tool Configuration
        maven 'maven-3.6.3'       // must match your configured Maven installation
    }

    environment {
        BACKEND_DIR = 'backend/issuetracker'
        FRONTEND_DIR = 'frontend/issue-tracker-frontend'
    }

    stages {
        stage('Checkout') {
            steps {
                echo '📥 Cloning repository...'
                git branch: 'main', url: 'https://github.com/wahbisoussiesprit/issue_tracker_project.git'
                echo '🔍 Checking out files...'
                sh 'ls -alh'  // List files in the root directory
            }
        }

        stage('Backend Build') {
            steps {
                dir("${BACKEND_DIR}") {
                    echo '⚙️ Building backend with Maven...'
                    sh 'ls -alh'           // Debug: List files in the backend directory
                    sh 'cat pom.xml'       // Debug: Output pom.xml content
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir("${FRONTEND_DIR}") {
                    echo '🧱 Building Angular frontend...'
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Archive Artifacts') {
            steps {
                echo '📦 Archiving JAR and build files...'
                archiveArtifacts artifacts: '**/target/*.jar', fingerprint: true
            }
        }

        stage('Finish') {
            steps {
                echo '✅ Build completed successfully!'
            }
        }
    }

    post {
        failure {
            echo '❌ Build failed.'
        }
    }
}
