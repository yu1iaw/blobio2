import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import usePeopleResponsibly from './hook/hook';
import './App.css';


function App() {
  const ingredients = [
    { product: 'pepper', id: '123' },
    { product: 'tomato', id: '345' },
    { product: 'beans', id: '567' },
    { product: 'chili sauce', id: '789' },
    { product: 'some magik', id: '901' }
  ];

  const ingredients2 = [
    { product: 'eggplant', id: '9' },
    { product: 'onion', id: '1' },
    { product: 'carrot', id: '3' },
    { product: 'veal', id: '5' },
    { product: 'dill', id: '1001' },
    { product: 'walnuts', id: '7' },
    { product: 'cilantro', id: '10' }
  ];

  
  const mixfood = JSON.parse(localStorage.getItem('ingredients')) || [ingredients, ingredients2];
  const [foodList, setFoodList] = useState(mixfood);
  const {reorder, move, getItemStyle} = usePeopleResponsibly();

  useEffect(() => {
    localStorage.setItem('ingredients', JSON.stringify(foodList));
  }, [foodList])
  

  function onDragEnd(result) {
    const { source, destination } = result;
    
    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      const items = reorder(foodList[sInd], source.index, destination.index);
      const newState = [...foodList];
      newState[sInd] = items;
      setFoodList(newState);
    } else {
      const result = move(foodList[sInd], foodList[dInd], source, destination);
      const newState = [...foodList];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];

      setFoodList(newState.filter(group => group.length));
    }
  }

  return (
    <div className='app'>
      <DragDropContext onDragEnd={onDragEnd}>
        {foodList.map((item, index) => {
          return (
            <Droppable key={index} droppableId={`${index}`}>
              {provided => (
                <ul {...provided.droppableProps}
                  ref={provided.innerRef}>
                  {index === 0 ? <h3><span>RHCP</span> ingredients</h3> : <h3>Drag your flavour:</h3>}
                  {item.map((el, i) => {
                    const isDragDisabled = index === 1 && item.length < 5 || index === 0 && item.length <= 3;
                    return (
                      <Draggable key={el.id} draggableId={el.id} index={i} 
                                 isDragDisabled={isDragDisabled}>
                        {(provided, snapshot) => (
                          <li ref={provided.innerRef}
                            {...provided.dragHandleProps}
                            {...provided.draggableProps}
                            style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}>
                              {el.product}
                          </li>
                        )}
                      </Draggable>
                    )
                  })}
                  <span style={{ opacity: 0 }}>{provided.placeholder}</span>
                </ul>
              )}
            </Droppable>
          )
        })}
      </DragDropContext>
    </div>
  )
}

export default App;
