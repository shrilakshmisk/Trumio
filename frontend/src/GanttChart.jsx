import React from 'react';
import { Gantt } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
let tasks = [
    {
        start: new Date(2020, 1, 1),
        end: new Date(2020, 1, 2),
        name: 'Idea',
        id: 'Task 0',
        type: 'task',
        progress: 100,
        isDisabled: true,
        styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
    },
    {
        start: new Date(2020, 1, 3),
        end: new Date(2020, 1, 5),
        name: 'Idea123',
        id: 'Task 1',
        type: 'task',
        progress: 100,
        isDisabled: true,
        styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
    },
    {
        start: new Date(2020, 1, 1),
        end: new Date(2020, 1, 2),
        name: 'Idea868',
        id: 'Task 2',
        type: 'task',
        progress: 100,
        isDisabled: true,
        styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
    },
    // Add more tasks here
];
export default function GanttChart({project}) {
	//project -> milestone -> tasks - flatten into one array and display all
	const tasks_arr = [];
	let id = 0
	for (const milestone of project.milestones) {
		let parent_id = id;
		id += 1;
		tasks_arr.push({
			start: new Date(new Date(milestone.completion_date) - 86400000), //1 day before milestone completion
			end: new Date(milestone.completion_date),
			name:`Milestone ID ${milestone.milestone_id}: ${milestone.milestone_desc}`,
			id:parent_id,
			type:"milestone",
			progress:100,
			isDisabled:true,
			styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
		})
		for (const task of milestone.tasks) {
			tasks_arr.push({
				start: new Date(task.start_time),
				end: new Date(task.end_time),
				name:`Task ${task.task_id} of Milestone ID ${milestone.milestone_id}: ${task.task_desc}`,
				id:-1,
				dependencies:[parent_id],
				type:"task",
				progress:100,
				isDisabled:true,
				styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
			})
		}
	}
    return <Gantt tasks={tasks_arr}/>;
}
