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
                sh 'docker compose up -d --build'
            }
        }
    }
}