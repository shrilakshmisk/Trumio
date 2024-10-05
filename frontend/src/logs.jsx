import React, { useEffect, useState } from 'react';
import { Card } from "@mui/material";
import { fetchLogs } from '@/callbacks/client'; // Import your fetchLogs function
const Logs = ({ teamID }) => {
    const [logs, setLogs] = useState([]);
    useEffect(() => {
        // Fetch logs when the component mounts
        const fetchLogsData = async () => {
            try {
                const { logs: logsData } = await fetchLogs(teamID);
                // Split logs into an array of lines
                const logsArray = logsData.split('\x01');
                setLogs(logsArray);
            }
            catch (error) {
                console.error('Error fetching logs:', error);
            }
        };
        fetchLogsData();
    }, [teamID]);
    return (<Card style={{
            width: "90%",
            alignSelf: "center",
            padding: "10px",
            backgroundColor: "#ddd",
            fontFamily: '"Courier New", monospace',
        }}>
      {logs.length === 0
            ? 'Loading logs...'
            : logs.map((log, index) => (
            // Add your own styling or formatting here
            <p key={index}>{log}</p>))}
    </Card>);
};
export default Logs;
