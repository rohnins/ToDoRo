pipeline {
    agent any
    
    stages {
        stage('Pull') {
            steps {
                echo 'Code pulled from GitHub'
            }
        }
        
        stage('Build') {
            steps {
                script {
                    sh 'docker-compose build'
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    sh 'docker-compose down'
                    sh 'docker-compose up -d'
                }
            }
        }
    }
}