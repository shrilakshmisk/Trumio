# DataShieldX-backend

This repository contains a Go-based web application using the Gin framework, organized into two main components: `student` and `client`. Each component has its own static frontend files, and the entire project can be easily run using Docker. Below, you'll find details on the project structure, how to run it, and other relevant information.

## Project Structure

- **student/**: Contains the student component of the web application.
  - **Dockerfile**: Docker configuration file for building the student component.
  - **out/**: Folder containing static files for the student component.
  - **main.go**: Main Go application file for the student component.

- **client/**: Contains the client component of the web application.
  - **Dockerfile**: Docker configuration file for building the client component.
  - **out/**: Folder containing static files for the client component.
  - **main.go**: Main Go application file for the client component.

- **docker-compose.yaml**: Docker Compose configuration file to orchestrate running both components.

## Running the Project

1. Ensure you have Docker installed on your machine.

2. Keep the name of the main directory as `DatashieldX-backend`

3. Open a terminal and navigate to the project root directory.

4. Run the following command to build and start the entire project:

   ```bash
   docker-compose up -d
   ```

5. To connect to rocket chat:

    ```bash
    chmod +x rocket_chat.sh
    ./rocket_chat.sh
    ```

This command will build the Docker images for both the student and client components and start the containers.

Once the containers are running, you can access the web applications in your browser:

**Student component**: http://localhost:8080 \
**Client component**: http://localhost:8081 \
\
<!-- Notes -->
<!-- Each component has its own Dockerfile to ensure isolation and easy deployment.
The static files for the frontend are stored in the out/ folders within each component.
The docker-compose.yaml file orchestrates the deployment of both components, making it easy to run the entire project with a single command.
Feel free to modify the code, static files, or Docker configurations to suit your specific needs. If you encounter any issues or have questions, refer to the documentation of Go, Gin, and Docker for further assistance. -->
