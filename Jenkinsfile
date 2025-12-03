pipeline {
    agent any
    
    stages {
        stage('Test') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'echo "Unix system"'
                        sh 'which sh'
                        sh 'echo $PATH'
                    } else {
                        bat 'echo Windows system'
                    }
                }
            }
        }
    }
}