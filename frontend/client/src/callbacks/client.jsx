import axios from 'axios';
export const startTeamServer = async (teamId) => {
    const port = 8080 + teamId;
    try {
        await axios.post(`${process.env.NEXT_PUBLIC_SERVER_CONTROLLER}/start/${teamId}/${port}`);
    }
    catch (error) {
        console.error('Error starting team:', error);
        throw error;
    }
};
export const stopTeamServer = async (teamId) => {
    try {
        await axios.post(`${process.env.NEXT_PUBLIC_SERVER_CONTROLLER}/stop/${teamId}`);
    }
    catch (error) {
        console.error('Error stopping team:', error);
        throw error;
    }
};
export const fetchLogs = async (teamId) => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_CONTROLLER}/logs/${teamId}`);
        return response.data; // Assuming the response contains the logs
    }
    catch (error) {
        console.error('Error fetching logs:', error);
        throw error;
    }
};

export const getProjects = async () => {
	try {
		const resp = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_CONTROLLER}/getProjects`);
		if (resp.status == 200) {
			console.log("Fetched projects successfully");
			console.log(resp.data)
			return resp.data.projects
		}
	} catch (error) {
		console.error("Error getting all projects", error);
		throw error
	}
}

export const getProject = async(teamId) => {
	try {
		console.log(`getProject ${teamId}`)
		const resp = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_CONTROLLER}/getProject?id=${teamId}`);
		if (resp.status == 200) {
			console.log("Fetched projects successfully");
			console.log(resp.data)
			return resp.data.project
		} else throw new Error(`Status code ${resp.status}`);
	} catch (error) {
		console.error(`Error getting project with id ${teamId}`, error);
		throw error
	}
}

export const updateProject = async(project) => {
	try {
		const resp = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_CONTROLLER}/updateProject`, project);
		if (resp.status == 200) {
			console.log("Updated project successfully");
			console.log(project)
		} else throw new Error(`Status code ${resp.status}`);
	} catch (error) {
		console.error("Error in updated project with id", project.project_id);
		console.error(error)
		throw error
	}
}

export const getUsers = async () => {
	try {
		const resp = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_CONTROLLER}/getUsers`);
		if (resp.status == 200) {
			console.log(resp)
			return resp.data;
		} else throw new Error(`Status code ${resp.status}`);
	} catch (error) {
		console.error("Error in getting users");
		console.error(error);
		throw error;
	}
}

export const createProject = async(project) => {
	try {
		await axios.post(`${process.env.NEXT_PUBLIC_SERVER_CONTROLLER}/createProject`, project);
		console.log("Created project successfully");
	} catch (err) {
		console.error("error in creating project");
		console.log(project);
		console.error(err);
		throw err;
	}
}

export const generateMilestones = async(project) => {
	try {
		let resp = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_CONTROLLER}/generateMilestones`, project);
		if (resp.status == 200) {
			console.log(resp);
			return resp.data;
		} else throw new Error(`Status code ${resp.status}`);
	} catch (err) {
		console.error("Error in getting milestones");
		console.log(project);
		console.error(err);
		throw err;
	}
}

export const getApps = async() =>  {
	try {
		let resp = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_CONTROLLER}/getApps`);
		if (resp.status == 200) {
			console.log(resp)
			return resp.data.apps
		} else throw new Error (`Status code ${resp.status}`);
	} catch (err) {
		console.error("Error in getting global apps");
		console.error(err);
		throw err;
	}
}