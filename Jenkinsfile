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
                sh '/usr/local/bin/docker-compose build'
                sh '/usr/local/bin/docker-compose down'
                sh '/usr/local/bin/docker-compose up -d'
            }
        }
    }
}