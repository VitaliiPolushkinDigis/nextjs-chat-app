pipeline {
    agent {
        node {
            label 'nodejs'
        }
    }

    environment {
        // Artifactory configuration
        ARTIFACTORY_URL = 'https://your-company-artifactory.com/artifactory'
        REPO_NAME = 'storybook-preview'
        
        // Jenkins built-in variables
        BUILD_NUMBER = "${BUILD_NUMBER}"
        BRANCH_NAME = "${BRANCH_NAME}"
        CHANGE_ID = "${CHANGE_ID}"
        
        // Credentials (these will be automatically masked in logs)
        ARTIFACTORY_CREDENTIALS = credentials('artifactory-credentials-id')
        GITHUB_TOKEN = credentials('github-token-id')
        GITHUB_REPO = 'your-organization/repo-name'  // Replace with your actual repo
    }

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'yarn install'
            }
        }

        stage('Build Storybook') {
            steps {
                sh 'yarn build-storybook -o storybook-static'
            }
        }

        stage('Deploy to Artifactory') {
            steps {
                script {
                    // Create a unique path for this build
                    def deployPath = "${REPO_NAME}/${BRANCH_NAME}/${CHANGE_ID}"
                    def timestamp = new Date().format("yyyyMMdd_HHmmss")
                    
                    // Create a simple index.html that redirects to the Storybook
                    sh """
                        echo '<!DOCTYPE html>
                        <html>
                        <head>
                            <meta http-equiv="refresh" content="0; url=./storybook-static/index.html" />
                            <title>Storybook Preview</title>
                        </head>
                        <body>
                            <p>Redirecting to Storybook preview...</p>
                        </body>
                        </html>' > storybook-static/redirect.html
                    """
                    
                    // Upload the entire storybook-static directory to Artifactory
                    sh """
                        cd storybook-static
                        for file in \$(find . -type f); do
                            curl -u ${ARTIFACTORY_CREDENTIALS} \
                            -X PUT "${ARTIFACTORY_URL}/${deployPath}/\${file#./}" \
                            -T "\${file}"
                        done
                    """
                    
                    // Generate the preview URL
                    def previewUrl = "${ARTIFACTORY_URL}/${deployPath}/storybook-static/index.html"
                    
                    // Create a more detailed PR comment
                    def prComment = """
                        🎨 Storybook Preview Available:
                        
                        You can view the Storybook preview here:
                        ${previewUrl}
                        
                        Components changed in this PR:
                        - TextFieldComponent
                        
                        Note: The preview will be available for 30 days.
                    """
                    
                    // Post comment to PR
                    sh """
                        curl -X POST \
                        -H "Authorization: token ${GITHUB_TOKEN}" \
                        -H "Accept: application/vnd.github.v3+json" \
                        https://api.github.com/repos/${GITHUB_REPO}/issues/${CHANGE_ID}/comments \
                        -d '{"body": "${prComment}"}'
                    """
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
} 