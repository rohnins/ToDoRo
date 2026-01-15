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
                        // Attempt to stop containers that might be locking the workspace
                        // We use the default compose file if it exists from previous run
                        sh '/usr/local/bin/docker compose down --remove-orphans || true'
                    } catch (Exception e) {
                        echo "Warning: Failed to stop containers, they might not exist yet: ${e.message}"
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