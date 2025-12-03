pipeline {
    agent any
    
    stages {
        stage('Pull') {
            steps {
                echo 'Code pulled from GitHub'
            }
        }
        
        stage('Build & Deploy') {
            steps {
                sh '/bin/bash -c "docker compose up -d --build"'
            }
        }
    }
}