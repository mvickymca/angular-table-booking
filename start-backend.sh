#!/bin/bash

echo "Starting Spring Boot Backend..."

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo "Maven not found. Installing Maven..."
    
    # Download and install Maven
    cd /tmp
    wget https://archive.apache.org/dist/maven/maven-3/3.8.6/binaries/apache-maven-3.8.6-bin.tar.gz
    tar -xzf apache-maven-3.8.6-bin.tar.gz
    sudo mv apache-maven-3.8.6 /opt/maven
    
    # Set Maven environment variables
    export M2_HOME=/opt/maven
    export MAVEN_HOME=/opt/maven
    export PATH=${M2_HOME}/bin:${PATH}
    
    echo "Maven installed successfully!"
fi

# Navigate to backend directory
cd /workspace/backend

echo "Building Spring Boot application..."
mvn clean compile

echo "Starting Spring Boot application on port 8080..."
echo "Access the application at: http://localhost:8080"
echo "H2 Console available at: http://localhost:8080/h2-console"
echo ""
echo "API Endpoints:"
echo "  POST /api/upload        - Upload JSON file"
echo "  GET  /api/json/{id}     - Get JSON data by ID"
echo "  GET  /api/documents     - Get API information"
echo ""

mvn spring-boot:run