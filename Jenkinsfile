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
                sh '/usr/local/bin/docker compose -f docker-compose.prod.yml up -d --build'
            }
        }
    }
}