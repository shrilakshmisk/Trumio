package store

import (
	"context"
	"fmt"
	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
	"github.com/docker/go-connections/nat"
	"github.com/docker/docker/api/types/network"
	"go.uber.org/zap"
	"io"
	"os"
	"path/filepath"
	"strconv"
	"strings"
)

func ResolvePath(dir string) (string, error) {
	home, err := os.UserHomeDir()

	if dir == "~" {
		if err != nil {
			return "", err
		}
		return home, nil
	}

	absPath := filepath.Join(home, dir)
	return absPath, nil
}

func NameContainer(teamName string) string {
	containerName := fmt.Sprintf("team-%v-workspace", teamName)
	return containerName
}

func StartDockerContainer(rootDir string, team string, portInt int) (string, error) {
	cli, err := client.NewClientWithOpts(client.FromEnv)
	if err != nil {
		return "", err
	}

	port := strconv.Itoa(portInt)
	// Docker image to use (replace with the actual image)
	imageName := "codercom/code-server"
	zap.S().Infof("Docker container on port : %v", port)

	// Container name based on the team
	containerName := NameContainer(team)

	// HostConfig for volume mount and port binding
	hostConfig := &container.HostConfig{
		Binds: []string{fmt.Sprintf("%s:/home/coder/project", rootDir)},
		PortBindings: nat.PortMap{
			nat.Port(fmt.Sprintf("%s/tcp", port)): []nat.PortBinding{
				{
					HostIP:   "0.0.0.0",
					HostPort: port,
				},
			},
		},
	}

	// ContainerConfig with environment variable for code-server authentication
	containerConfig := &container.Config{
		Image: imageName,
		ExposedPorts: nat.PortSet{
			nat.Port(fmt.Sprintf("%s/tcp", port)): struct{}{},
		},
		Cmd: []string{"--auth=none", "--disable-telemetry", fmt.Sprintf("--port=%s", port)},
		Env: []string{"PASSWORD=password"}, // Replace with your desired authentication method
	}

	networkConfig := &network.NetworkingConfig{
        EndpointsConfig: map[string]*network.EndpointSettings{
			"datashieldx-backend_mynetwork": {}, // You can customize settings here if needed
		},
    }
	// Create the container
	resp, err := cli.ContainerCreate(context.Background(), containerConfig, hostConfig, networkConfig, nil, containerName)
	if err != nil {
		return "", err
	}

	// Start the container
	if err := cli.ContainerStart(context.Background(), resp.ID, types.ContainerStartOptions{}); err != nil {
		return "", err
	}

	return resp.ID, nil
}

func StopDockerContainer(containerName string) error {
	cli, err := client.NewClientWithOpts(client.FromEnv)
	if err != nil {
		return err
	}

	timeout := 10 // Adjust the timeout as needed

	containerID, err := GetContainerIDByTeamName(containerName)
	if err != nil {
		zap.S().Errorf("Error while retrieving container ID : %v", err)
		return err
	}

	if containerID == "" {
		return fmt.Errorf("container with name %s not found", containerName)
	}

	stopOptions := container.StopOptions{
		Signal:  "",
		Timeout: &timeout,
	}

	// Stop the Docker container
	err = cli.ContainerStop(context.Background(), containerID, stopOptions)
	if err != nil {
		zap.S().Errorf("Error while stopping the container: %v", err)
		return err
	}

	statusCh, errCh := cli.ContainerWait(context.Background(), containerID, container.WaitConditionNotRunning)
	select {
	case <-statusCh:
		// Container has stopped
	case err := <-errCh:
		if err != nil {
			zap.S().Errorf("Error while running waitContainer: %v", err)
			return err
		}
	}

	// Remove the Docker container
	err = cli.ContainerRemove(context.Background(), containerID, types.ContainerRemoveOptions{Force: true})
	if err != nil {
		zap.S().Errorf("Error while removing the container: %v", err)
		return err
	}

	return nil
}

func GetContainerIDByTeamName(teamName string) (string, error) {
	cli, err := client.NewClientWithOpts(client.FromEnv)
	if err != nil {
		zap.S().Errorf("Error while creating docker client: %v", err)
		return "", err
	}

	// List containers to find the one with the specified name
	containers, err := cli.ContainerList(context.Background(), types.ContainerListOptions{All: true})
	if err != nil {
		zap.S().Errorf("Error while getting list of containers: %v", err)
		return "", err
	}

	for _, container := range containers {
		for _, cName := range container.Names {
			if strings.TrimPrefix(cName, "/") == teamName {
				return container.ID, nil
			}
		}
	}

	return "", fmt.Errorf("container with name %s not found", teamName)
}

func GetContainerLogs(containerID string) (string, error) {
	cli, err := client.NewClientWithOpts(client.FromEnv)
	if err != nil {
		zap.S().Errorf("Error while creating docker client: %v", err)
		return "", err
	}

	logOptions := types.ContainerLogsOptions{
		ShowStdout: true,
		ShowStderr: true,
		Follow:     false,
	}

	// Get container logs
	logs, err := cli.ContainerLogs(context.Background(), containerID, logOptions)
	if err != nil {
		zap.S().Errorf("Error while creating getting container logs: %v", err)
		return "", err
	}

	defer logs.Close()

	// Read the logs
	logContent, err := io.ReadAll(logs)
	if err != nil {
		zap.S().Errorf("Error while reading logs: %v", err)
		return "", err
	}

	return string(logContent), nil
}
