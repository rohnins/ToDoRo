pipeline {
    agent any
    
    stages {
        stage('Pull') {
            steps {
                echo 'Code pulled from GitHub'
            }
        }
        
        stage('Setup') {
            steps {
                sh 'cp client/.env.example client/.env || true'
            }
        }
        
        stage('Build & Deploy') {
            steps {
                sh '/usr/local/bin/docker compose up -d --build'
            }
        }
    }
}