import { GetServerSideProps } from 'next';
import { fetchModule, fetchSSRModule } from 'modules/front/FetchModule';
import { useCallback, useState } from 'react';
import {
	DragDropContext,
	Draggable,
	Droppable,
	DropResult,
} from 'react-beautiful-dnd';
import styled from 'styled-components';
import Column from 'ts-components/draggable/Column';
import { resetServerContext } from 'react-beautiful-dnd';

const Container = styled.div`
	display: flex;
`;
interface IData {
	tasks: {
		[key: string]: { id: string; content: string };
	};
	columns: {
		[key: string]: { id: string; title: string; taskIds: string[] };
	};
	columnOrder: string[];
}
export default function IndexPage(props: any) {
	const initialData = {
		tasks: {
			'task-1': { id: 'task-1', content: 'Take out the garbage' },
			'task-2': { id: 'task-2', content: 'Watch my favorite show' },
			'task-3': { id: 'task-3', content: 'Charge my phone' },
			'task-4': { id: 'task-4', content: 'Cook dinner' },
		},
		columns: {
			'column-1': {
				id: 'column-1',
				title: 'To do',
				taskIds: ['task-1', 'task-2', 'task-3', 'task-4'],
			},
			'column-2': {
				id: 'column-2',
				title: 'In progress',
				taskIds: [],
			},
			'column-3': {
				id: 'column-3',
				title: 'Done',
				taskIds: [],
			},
		},
		// Facilitate reordering of the columns
		columnOrder: ['column-1', 'column-2', 'column-3'],
	};

	const [data, setData] = useState<IData>(initialData);
	const onDragEnd = useCallback(
		(result: DropResult) => {
			const { destination, source, draggableId, type } = result;
			if (!destination) return;
			if (
				destination.droppableId === source.droppableId &&
				source.index === destination.index
			)
				return;

			if (type === 'column') {
				const newColumnOrder = Array.from(data.columnOrder);
				newColumnOrder.splice(source.index, 1);
				newColumnOrder.splice(destination.index, 0, draggableId);

				const newData = {
					...data,
					columnOrder: newColumnOrder,
				};
				setData(newData);
				return;
			}
			const startColumn = data.columns[source.droppableId];
			const finishColumn = data.columns[destination.droppableId];

			if (startColumn === finishColumn) {
				const newTaskIds = Array.from(startColumn.taskIds);
				newTaskIds.splice(source.index, 1);
				newTaskIds.splice(destination.index, 0, draggableId);

				const newColumn = {
					...startColumn,
					taskIds: newTaskIds,
				};

				const newData = {
					...data,
					columns: {
						...data.columns,
						[newColumn.id]: newColumn,
					},
				};

				setData(newData);
			} else {
				const startTaskIds = Array.from(startColumn.taskIds);
				startTaskIds.splice(source.index, 1);
				const newStartColumn = {
					...startColumn,
					taskIds: startTaskIds,
				};

				const finishTaskIds = Array.from(finishColumn.taskIds);
				finishTaskIds.splice(destination.index, 0, draggableId);
				const newFinishColumn = {
					...finishColumn,
					taskIds: finishTaskIds,
				};

				const newData = {
					...data,
					columns: {
						...data.columns,
						[newStartColumn.id]: newStartColumn,
						[newFinishColumn.id]: newFinishColumn,
					},
				};

				setData(newData);
			}
		},
		[data],
	);

	resetServerContext();
	return (
		<section className="main-section">
			<div className="App-header">
				<DragDropContext onDragEnd={onDragEnd}>
					<Droppable
						droppableId="all-columns"
						direction="horizontal"
						type="column"
					>
						{(provided) => (
							<Container {...provided.droppableProps} ref={provided.innerRef}>
								{data.columnOrder.map((columnId, index) => {
									const column = data.columns[columnId];
									const tasks = column.taskIds.map(
										(taskId) => data.tasks[taskId],
									);
									return (
										<Column
											column={column}
											tasks={tasks}
											key={column.id}
											index={index}
										/>
									);
								})}
								{provided.placeholder}
							</Container>
						)}
					</Droppable>
				</DragDropContext>
			</div>
		</section>
	);
}
