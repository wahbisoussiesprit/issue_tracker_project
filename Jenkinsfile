pipeline {
    agent any

tools {
    jdk 'Java17'
    maven 'maven-3.6.3'
}

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/wahbisoussiesprit/issue_tracker_project.git'
            }
        }

        stage('Build') {
            steps {
                sh 'mvn clean package -DskipTests'
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
