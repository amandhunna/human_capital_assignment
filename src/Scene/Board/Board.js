import React, { useReducer, useState, useEffect, useContext } from 'react';
import { UserContext } from '../../userContext';
import "./board.css"

/* 
ref: 
1. https://web.dev/drag-and-drop/?gclid=EAIaIQobChMIi8jiodiP8gIVyX8rCh2oeQueEAAYASAAEgL3rfD_BwE
2. https://www.smashingmagazine.com/2020/02/html-drag-drop-api-react/
*/

const reducer = (state, action) => {
    switch (action.type) {
      case 'SET_DROP_DEPTH':
        return { ...state, dropDepth: action.dropDepth }
      case 'SET_IN_DROP_ZONE':
        return { ...state, inDropZone: action.inDropZone };
      case 'SET_DROPPED_AT': 
        return { ...state, droppedAt: action.droppedAt, updated: false }
      case 'SET_DROPPED_ITEM':
        return { ...state, droppedItem: action.droppedItem, updated: true}
      case 'SET_DEFAULT':
        return { ...state, droppedAt: '', droppedItem: '', updated: false} 
      default:
        return state;
    }
};


function Board(props) {
    const { taskList } = useContext(UserContext);
    const [data, dispatch] = useReducer(reducer, { 
      dropDepth: 0, 
      inDropZone: false, 
      droppedAt: '',
      droppedItem: '',
      updated:false
    });
    const [ list ] = useState([ 
        { label: "Phone screen", value: "screening" },
        { label: "Interview 1", value: "interview-1" },
        { label: "Interview 2", value: "interview-2" },
        { label: "Onsite", value: "onsite" },
        { label: "Decision", value: "decision" },
        ]);
    
        const [cards,  setCards] = useState([
      { id: '1', board: "screening", description: "this is one", label: ["web", "FE"], user : "AS"},
      { id: '2', board: "screening", description: "this is two", label: ["BE"], user : "AS"},
    ]);

    const getCards = (listItem) => {
        const filteredCards = cards.filter(item => item.board === listItem);
        return filteredCards.map(card => (
            <div className="card"
                key={card.id}
                id={card.id}
                draggable={true}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd} 
                >
                <div className='cardDescription'>
                  {card.description}
                </div>
                <div className="cardMetaData">
                  <p>
                    {card.label.map((label,index) => (
                      <span className="card-label" key={label+index}>
                      {label}
                    </span>))}
                  </p>
                  <span className="card-user">
                    {card.user}
                  </span>
                </div>
            </div>));
    }

    /* drop zone methods */    
    function onDragEnter(event) {
      event.preventDefault();
      event.stopPropagation();
      dispatch({ type: 'SET_DROP_DEPTH', dropDepth: data.dropDepth + 1 });
    }

    function onDragLeave(event) {
      event.preventDefault();
      event.stopPropagation();
      dispatch({ type: 'SET_DROP_DEPTH', dropDepth: data.dropDepth - 1 });
      if (data.dropDepth > 0) return
      dispatch({ type: 'SET_IN_DROP_ZONE', inDropZone: false })
    }
    
    function onDragOver(event) {
      event.preventDefault();
      event.stopPropagation()
      const { nodeName, id } = event.target;
      if(nodeName !== 'UL') {
        return;
      }
      dispatch({ type: 'SET_DROPPED_AT', droppedAt: id });  
      dispatch({ type: 'SET_IN_DROP_ZONE', inDropZone: true });
    }

    function onDrop(event) {
      event.preventDefault();
      event.stopPropagation();
      const droppedAt = event.target.id;
      const isAllowedDropAt =  list.map(item => item.value).includes(droppedAt);
      if(isAllowedDropAt) {
        // dispatch({ type: 'SET_DROPPED_AT', droppedAt });
        dispatch({ type: 'SET_DROP_DEPTH', dropDepth: 0 });
        dispatch({ type: 'SET_IN_DROP_ZONE', inDropZone: false });
      }
    }
    
    /* draggable methods */
    function onDragStart(event) {
      //event.preventDefault();
      //event.stopPropagation();
      //console.log("----start----", )
    }

    function onDragEnd(event) {
      event.preventDefault();
      event.stopPropagation();
      const droppedItem = event.target.id;
      const isAllowed = data.droppedAt !== "" && !(data.droppedAt === droppedItem);
      if(isAllowed) {
        dispatch({ type: 'SET_DROPPED_ITEM', droppedItem });
      }
     }

     useEffect(() => {
      if(data.updated) {
        const newSet = cards.map(item => {
          if(item.id === data.droppedItem) {
            item.board = data.droppedAt;
          }
          return item;
        });
        setCards(newSet);
        dispatch({type: 'SET_DEFAULT'})
      }
     }, [data])


     useEffect(() => {
       if(taskList.length) {
         const cardsCopy = JSON.parse(JSON.stringify(list));
         for(let index = 1; index < taskList.length; ++index) {
          cardsCopy.push({
            id: taskList[index][0], 
            board:taskList[index][1],
            description:taskList[index][2],
            label: taskList[index][3].split(','),
            user : taskList[index][4], 
          });
          console.log("--", taskList[index])
         }
         setCards(cardsCopy);
       }
     }, [taskList])
    
    return (
        <div className="board">
            {list.map(listItem => (
                <ul 
                  key={listItem.value} 
                  id={listItem.value}
                  className={`list drop-zone`}
                  onDragEnter={onDragEnter}
                  onDragLeave={onDragLeave}
                  onDragOver={onDragOver} /* without this onDrop will not work */
                  onDrop={onDrop}
                >
                    <span className="listHeader">{listItem.label}</span>
                    <ol className="listCards">{getCards(listItem.value)}</ol>  
                </ul>
            ))}
        </div>
    );
}

export default Board;
