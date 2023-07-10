import React, { useEffect, useState } from "react";
import Keyboard from "./components/Keyboard";
import { wordList } from "./constants/data";
import "./App.css";
import BasicModal from "./components/Modal";
// 웹 localStorage를 앱 encryptedStorage로 옮기는 작업. 거기서 생기는 사이드 이펙트 처리해야 함

const App = () => {
  const [boardData, setBoardData] = useState(
    JSON.parse(localStorage.getItem("board-data"))
  );
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(false);
  const [charArray, setCharArray] = useState([]);
  const [stepOver, setStepOver] = useState(false);

  const resetBoard = () => {
    var alphabetIndex = Math.floor(Math.random() * 26);
    var wordIndex = Math.floor(
      Math.random() * wordList[String.fromCharCode(97 + alphabetIndex)].length
    );
    let newBoardData = {
      ...boardData,
      solution: wordList[String.fromCharCode(97 + alphabetIndex)][wordIndex],
      rowIndex: 0,
      boardWords: [],
      boardRowStatus: [],
      presentCharArray: [],
      absentCharArray: [],
      correctCharArray: [],
      status: "IN_PROGRESS",
      games: boardData["games"] + 1,
    };
    setBoardData(newBoardData);
    localStorage.setItem("board-data", JSON.stringify(newBoardData));
    setCharArray([]);
    setStepOver(false);
  };

  useEffect(() => {
    // if (!boardData || !boardData.solution) {
    var alphabetIndex = Math.floor(Math.random() * 26);
    var wordIndex = Math.floor(
      Math.random() * wordList[String.fromCharCode(97 + alphabetIndex)].length
    );
    let newBoardData = {
      ...boardData,
      solution: wordList[String.fromCharCode(97 + alphabetIndex)][wordIndex],
      rowIndex: 0,
      boardWords: [],
      boardRowStatus: [],
      presentCharArray: [],
      absentCharArray: [],
      correctCharArray: [],
      status: "IN_PROGRESS",
      games: 1,
      completed: 0,
    };
    setBoardData(newBoardData);
    localStorage.setItem("board-data", JSON.stringify(newBoardData));
    setCharArray([]);
    setStepOver(false);
    // }
  }, []);

  const handleMessage = (message) => {
    setMessage(message);
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };
  const handleError = () => {
    setError(true);
    setTimeout(() => {
      setError(false);
    }, 3000);
  };
  const enterBoardWord = (word) => {
    let boardWords = boardData.boardWords;
    let boardRowStatus = boardData.boardRowStatus;
    let solution = boardData.solution;
    let presentCharArray = boardData.presentCharArray;
    let absentCharArray = boardData.absentCharArray;
    let correctCharArray = boardData.correctCharArray;
    let rowIndex = boardData.rowIndex;
    let rowStatus = [];
    let matchCount = 0;
    let status = boardData.status;

    for (var index = 0; index < word.length; index++) {
      if (solution.charAt(index) === word.charAt(index)) {
        matchCount++;
        rowStatus.push("correct");
        if (!correctCharArray.includes(word.charAt(index))) {
          correctCharArray.push(word.charAt(index));
        }
        if (presentCharArray.indexOf(word.charAt(index)) !== -1) {
          presentCharArray.splice(
            presentCharArray.indexOf(word.charAt(index)),
            1
          );
        }
      } else if (solution.includes(word.charAt(index))) {
        rowStatus.push("present");
        if (
          !correctCharArray.includes(word.charAt(index)) &&
          !presentCharArray.includes(word.charAt(index))
        ) {
          presentCharArray.push(word.charAt(index));
        }
      } else {
        rowStatus.push("absent");
        if (!absentCharArray.includes(word.charAt(index))) {
          absentCharArray.push(word.charAt(index));
        }
      }
    }

    boardRowStatus.push(rowStatus);
    boardWords[rowIndex] = word;
    let newBoardData = {
      ...boardData,
      boardWords: boardWords,
      boardRowStatus: boardRowStatus,
      rowIndex: rowIndex + 1,
      status: status,
      presentCharArray: presentCharArray,
      absentCharArray: absentCharArray,
      correctCharArray: correctCharArray,
    };
    setBoardData(newBoardData);
    localStorage.setItem("board-data", JSON.stringify(newBoardData));

    if (matchCount === 5) {
      // 단어 맞췄을때
      handleMessage("Completed!");
      setStepOver(true);
      let newBoardData = {
        ...boardData,
        completed: boardData["completed"] + 1,
      };
      setBoardData(newBoardData);
      localStorage.setItem("board-data", JSON.stringify(newBoardData));
    } else if (rowIndex + 1 === 6) {
      // 6번 기회 다 썼을때(단어 못맞춤)
      handleMessage("Failed");
      setStepOver(true);
    }
  };

  const enterCurrentText = (word) => {
    let boardWords = boardData.boardWords;
    let rowIndex = boardData.rowIndex;
    console.log(rowIndex);
    boardWords[rowIndex] = word;
    let newBoardData = { ...boardData, boardWords: boardWords };
    setBoardData(newBoardData);
  };

  const handleKeyPress = (key) => {
    console.log(boardData);
    if (boardData.rowIndex > 5 || boardData.status === "WIN") {
      return;
    }
    if (key === "ENTER") {
      if (charArray.length === 5) {
        let word = charArray.join("").toLowerCase();
        if (!wordList[word.charAt(0)].includes(word)) {
          handleError();
          handleMessage("Not in word list");
          return;
        }
        enterBoardWord(word);
        setCharArray([]);
        console.log("========");
        console.log(charArray);
        console.log("========");
      } else {
        handleMessage("Not enough letters");
      }
      return;
    }
    if (key === "⌫") {
      charArray.splice(charArray.length - 1, 1);
      setCharArray([...charArray]);
    } else if (charArray.length < 5) {
      charArray.push(key);
      setCharArray([...charArray]);
    }
    enterCurrentText(charArray.join("").toLowerCase());
  };

  return (
    <div className="container">
      <div className="top">
        <BasicModal modalType="game" />
        {/* <button className="reset-board" onClick={resetBoard}>{"\u27f3"}</button> */}
      </div>
      {message && (
        <div
          className="message"
          style={
            message === "Completed!"
              ? { background: "#3978e9" }
              : { background: "#8974d4" }
          }
        >
          {message}
        </div>
      )}
      <div
        style={{
          marginBottom: "25px",
          marginTop: "10px",
          display: "flex",
          flexDirection: "row",
          gap: "5px",
        }}
      >
        <BasicModal modalType="redButton" />
        <BasicModal modalType="yellowButton" />
        <BasicModal modalType="greenButton" />
      </div>
      <div className="cube">
        {[0, 1, 2, 3, 4, 5].map((row, rowIndex) => (
          <div
            className={`cube-row ${
              boardData && row === boardData.rowIndex && error && "error"
            }`}
            key={rowIndex}
          >
            {/* <span>{row},{boardData.rowIndex}</span> */}
            {[0, 1, 2, 3, 4].map((column, letterIndex) => (
              <div
                key={letterIndex}
                className={`letter ${
                  boardData && boardData.boardRowStatus[row]
                    ? boardData.boardRowStatus[row][column]
                    : ""
                }`}
              >
                {boardData &&
                  boardData.boardWords[row] &&
                  boardData.boardWords[row][column]}
              </div>
            ))}
          </div>
        ))}
      </div>
      {stepOver ? (
        // record 컴포넌트 디자인 꾸미기
        <div
          style={{ textAlign: "center", position: "relative", bottom: "20px" }}
        >
          <div className="answer">{boardData.solution.toUpperCase()}</div>
          <div class="data">
            <div>
              Games
              <br />
              <div style={{ height: "5px" }}></div>
              {boardData["games"]}
            </div>
            <div>
              Completed
              <br />
              <div style={{ height: "5px" }}></div>
              {boardData["completed"]}
            </div>
            <div>
              Win rate
              <br />
              <div style={{ height: "5px" }}></div>
              {((boardData["completed"] / boardData["games"]) * 100).toFixed(0)}
              %
            </div>
          </div>
          <input
            type="button"
            className="nextWord"
            value="NEXT WORD"
            onClick={() => {
              resetBoard();
            }}
          />
        </div>
      ) : (
        <div className="bottom">
          <Keyboard boardData={boardData} handleKeyPress={handleKeyPress} />
        </div>
      )}
    </div>
  );
};

export default App;
