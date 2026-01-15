pipeline {
    agent any
    
    // Skip the automatic checkout so we can stop containers (release locks) first
    options {
        skipDefaultCheckout()
    }
    
    stages {
        stage('Clean Locks') {
            steps {
                script {
                    try {
                        // 1. Create a dummy docker-compose.yml so we have a config to "down"
                        // This matches the service names 'server' and 'client' so Docker knows what to look for
                        writeFile file: 'docker-compose.yml', text: '''
services:
  server:
    image: alpine
  client:
    image: alpine
'''
                        // 2. Stop the containers using this config
                        // This releases the file locks on node_modules
                        sh '/usr/local/bin/docker compose down --remove-orphans || true'
                        
                        // 3. Cleanup the dummy file
                        sh 'rm docker-compose.yml'
                    } catch (Exception e) {
                        echo "Warning: Lock cleanup had issues: ${e.message}"
                    }
                }
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build & Deploy') {
            steps {
                // Now using the production compose file which prevents future locking
                sh '/usr/local/bin/docker compose -f docker-compose.prod.yml up -d --build'
            }
        }
    }
}