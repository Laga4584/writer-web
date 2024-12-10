import { GetServerSideProps } from 'next';
import { fetchModule, fetchSSRModule } from 'modules/front/FetchModule';
import { useState } from 'react';
import {
	DragDropContext,
	Draggable,
	Droppable,
	DropResult,
} from 'react-beautiful-dnd';
import styled from 'styled-components';

export const getServerSideProps: GetServerSideProps = async (context) => {
	// let apiUrl = `${process.env.SERVER_HOST_URL}/api/admin/main`;
	// //아래는 전체적인 예시 api, 실제 그대로 해당 api를 사용할 필요는 없음
	// const apiData = await fetchSSRModule(
	// 	context,
	// 	{
	// 		url: apiUrl,
	// 		method: 'GET',
	// 	},
	// 	false,
	// );
	const apiData: any = {};

	if (apiData.isError == true) {
		return apiData.data;
	}

	let props: any = {};
	if (typeof apiData.metaInfo != 'undefined') {
		props.metaInfo = apiData.metaInfo;
	}

	return {
		props,
		// ...(!apiData.data.isAdmin && {
		// 	redirect: {
		// 		destination: '/customer',
		// 	},
		// }),
	};
};

export default function IndexPage(props: any) {
	const [list, setList] = useState([
		{ id: 'babo1', content: <h3>바보1</h3> },
		{ id: 'babo2', content: <h3>바보2</h3> },
		{ id: 'babo3', content: <h3>바보3</h3> },
	]);
	const [list2, setList2] = useState([
		{ id: 'babo4', content: <h3>바보4</h3> },
		{ id: 'babo5', content: <h3>바보5</h3> },
		{ id: 'babo6', content: <h3>바보6</h3> },
	]);
	const onDragEnd = (result: DropResult) => {
		if (!result?.destination) return;

		console.log(result);

		const sourceIndex = result.source.index;
		const destinationIndex = result.destination.index;
		const newList = [...list];
		const pickedBabo = newList[sourceIndex];
		newList.splice(sourceIndex, 1);
		newList.splice(destinationIndex, 0, pickedBabo);
		setList(newList);
	};

	return (
		<section className="main-section">
			<DragDropContext onDragEnd={onDragEnd}>
				<div style={{ background: 'white' }}>
					<Droppable droppableId="01" key="01">
						{(provided, snapshot) => (
							<DraggableBox
								ref={provided.innerRef}
								{...provided.droppableProps}
							>
								{list.map((babo, index) => (
									<Draggable key={babo.id} draggableId={babo.id} index={index}>
										{(provided) => (
											<DraggablePoint
												ref={provided.innerRef}
												{...provided.dragHandleProps}
												{...provided.draggableProps}
											>
												{babo.content}
											</DraggablePoint>
										)}
									</Draggable>
								))}
								{provided.placeholder}
							</DraggableBox>
						)}
					</Droppable>
				</div>
				<div style={{ background: 'blue' }}>
					<Droppable droppableId="02" key="02">
						{(provided, snapshot) => (
							<DraggableBox
								ref={provided.innerRef}
								{...provided.droppableProps}
							>
								{list2.map((babo, index) => (
									<Draggable key={babo.id} draggableId={babo.id} index={index}>
										{(provided) => (
											<DraggablePoint
												ref={provided.innerRef}
												{...provided.dragHandleProps}
												{...provided.draggableProps}
											>
												{babo.content}
											</DraggablePoint>
										)}
									</Draggable>
								))}
								{provided.placeholder}
							</DraggableBox>
						)}
					</Droppable>
				</div>
			</DragDropContext>
		</section>
	);
}

const DraggableBox = styled.div`
	display: flex;
	flex-direction: column;
`;

const DraggablePoint = styled.div`
	display: flex;
	justify-contents: center;
	height: 50px;
`;
