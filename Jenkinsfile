pipeline {

    agent none
    
    environment {
        // Định nghĩa tên của Docker image
        DOCKER_IMAGE = "ndminh1212/personal-library-api"

        // Định nghĩa tên container
        CONTAINER_NAME = "personal-library-api-container"
    }

    stages {
        stage('Build Docker Image') {
            agent { label 'master' }
            steps {
                script {
                    // Build Docker image
                    echo "Building Docker image ${DOCKER_IMAGE}"

                    sh "docker build -t ${DOCKER_IMAGE} ."
                }
            }
        }

        stage('Push Docker Image to Docker Hub') {
            agent { label 'master' }
            steps {
                script {
                    echo "Pushing Docker image ${DOCKER_IMAGE} to Docker Hub"

                    sh "docker push ${DOCKER_IMAGE}"
                }
            }
        }

        stage('Run Docker Container') {
            steps {
                agent { label 'a71' }
                script {
                    // Kiểm tra và dừng container cũ nếu tồn tại
                    echo "Stopping and removing existing container if exists"

                    sh "./alpine/ssh2qemu.sh"

                    sh """

                    if [ \$(docker ps -aq -f name=${CONTAINER_NAME}) ]; then
                        docker stop ${CONTAINER_NAME} || true
                        docker rm ${CONTAINER_NAME} || true
                    fi

                    """

                    // Chạy container mới từ image vừa build
                    echo "Running Docker container ${CONTAINER_NAME}"

                    sh """

                    docker run -d --name ${CONTAINER_NAME} --env-file=./personal-library-api/.env -p 8888:8888 ${DOCKER_IMAGE}

                    """
                }
            }
        }
    }

    post {
        always {
            echo "Cleaning up workspace"

            // Xóa các file và thư mục trong workspace sau khi build
            cleanWs()
        }
    }
}