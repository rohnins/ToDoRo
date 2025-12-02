pipeline {
    agent any
    
    stages {
        stage('Pull') {
            steps {
                // Git checkout happens automatically
                echo 'Code pulled from GitHub'
            }
        }
        
        stage('Build') {
            steps {
                sh 'docker-compose build'
            }
        }
        
        stage('Deploy') {
            steps {
                sh 'docker-compose down'
                sh 'docker-compose up -d'
            }
        }
    }
}