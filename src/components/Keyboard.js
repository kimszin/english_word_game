import React from 'react';
import { keys } from '../constants/constants';
import '../style/Keyboard.css';

const Keyboard = ({ boardData, handleKeyPress }) => {
  // console.log('this')
  return (
    <div className='keyboard-rows' >
      {keys.map((item,index) => (
        <div className='row' key={index}>
          {
            item.map((key,keyIndex) => (
              <button key={keyIndex} 
                className={`${boardData && boardData.correctCharArray.includes(key) ? "key-correct":
                (boardData && boardData.presentCharArray.includes(key) ? "key-present":
                boardData && boardData.absentCharArray.includes(key) ? "key-absent" : "")}`} 
                onClick={()=>{handleKeyPress(key)}}
              >
                {key}
              </button>
            ))
          }
        </div>
      ))}           
    </div>
  );
};

export default Keyboard;