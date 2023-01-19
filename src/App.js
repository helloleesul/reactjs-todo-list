import { useState, useEffect, useRef } from "react";
import "./App.css";
import Header from "./Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPen, faXmark } from "@fortawesome/free-solid-svg-icons";

function App() {
  const [newTodo, setNewTodo] = useState("");
  const [updateTodo, setUpdateTodo] = useState("");
  const [toDoList, setToDoList] = useState([]);
  const [inputShow, setInputShow] = useState(false);
  const [errorShow, setErrorShow] = useState(false);
  const focusTodo = useRef();

  // 저장된 toDoList 불러오기
  useEffect(() => {
    const localData = localStorage.getItem("to-do");

    if (localData !== null) {
      const getToDoData = JSON.parse(localData);
      const getToDoList = getToDoData.map((list) =>
        list.modify === true ? { ...list, modify: false } : list
      );

      setToDoList(getToDoList);
      // console.log("toDoList 불러오기");
    }
  }, []);

  // toDoList 변경되었을 때 다시 저장하기
  useEffect(() => {
    if (toDoList?.length === 0) {
      return;
    }
    localStorage.setItem("to-do", JSON.stringify(toDoList));
    // console.log("toDoList 변경");
  }, [toDoList]);

  // 유니크 ID생성기
  function randomID() {
    return Math.random().toString(36).substring(2, 16);
  }

  // newTodo 입력 시 state 연결
  function onNewTodo(e) {
    setNewTodo(e.target.value);
  }

  // newTodo 입력 완료했을 때
  function onSubmit(e) {
    e.preventDefault();
    if (newTodo !== "") {
      // toDoList state 연결
      setToDoList((currentArray) => [
        {
          id: randomID(),
          name: newTodo,
          modify: false,
          check: false,
        },
        ...currentArray,
      ]);
    } else {
      // console.log("빈 값");
      return;
    }
    // newTodo 다시 빈 값으로 설정
    setNewTodo("");
    setInputShow(false);
  }

  // updateTodo 입력 시 state 연결
  function onUpdatTodo(e) {
    setUpdateTodo(e.target.value);
  }

  // 수정 버튼 활성화
  function onModify(id, name) {
    setToDoList(
      toDoList.map((list) =>
        list.id === id ? { ...list, modify: true } : { ...list, modify: false }
      )
    );
    // updateTodo 연결
    setUpdateTodo(name);
  }

  // updateTodo 입력 완료했을 때
  function onUpdate(e) {
    e.preventDefault();
    if (updateTodo !== "") {
      setToDoList(
        toDoList.map((list) =>
          list.modify === true
            ? { ...list, name: updateTodo, modify: false }
            : list
        )
      );
    } else {
      // console.log("빈 값");
      setErrorShow(true);
      setTimeout(() => setErrorShow(false), 700);
      return;
    }
  }

  // check 값 토글
  function onCheck(id) {
    setToDoList(
      toDoList.map((list) =>
        list.id === id ? { ...list, check: !list.check } : list
      )
    );
  }

  // toDoItem 삭제
  function onDelete(id) {
    setToDoList(toDoList.filter((list) => list.id !== id));
    localStorage.setItem("to-do", JSON.stringify([]));
  }

  // toDoList 전체삭제
  function onDeleteAll() {
    setToDoList([]);
    localStorage.setItem("to-do", JSON.stringify([]));
  }

  return (
    <div id="wrap">
      <Header />
      <main>
        <div className="info">
          <button onClick={onDeleteAll} className="allReset">
            All Reset
          </button>
          <span className="total">
            total <span>{toDoList.length}</span>
          </span>
        </div>

        {toDoList.length !== 0 ? (
          <ul>
            {toDoList.map((item) => (
              <li key={item.id} className={item.check ? "checked" : ""}>
                <FontAwesomeIcon
                  icon={faCheck}
                  onClick={() => onCheck(item.id)}
                  className="check btn"
                />
                {item.modify ? (
                  <form onSubmit={onUpdate}>
                    <input
                      type="text"
                      value={updateTodo}
                      onChange={onUpdatTodo}
                    />
                    {errorShow ? (
                      <span className="error">할 일을 입력해주세요.</span>
                    ) : (
                      ""
                    )}
                  </form>
                ) : (
                  <p onClick={() => onCheck(item.id)}>{item.name}</p>
                )}
                <div>
                  {item.modify ? (
                    <button className="edit btn active" onClick={onUpdate}>
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                  ) : (
                    <button
                      className="edit btn"
                      onClick={() => {
                        onModify(item.id, item.name);
                      }}
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                  )}
                  <button
                    className="delete btn"
                    onClick={() => onDelete(item.id)}
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <span className="empty">+버튼을 눌러 할 일을 기록하세요.</span>
        )}
      </main>

      <button
        className="newBtn regular"
        onClick={() =>
          setInputShow((prev) => (prev = !prev), focusTodo.current.focus())
        }
      >
        +
      </button>
      <form
        onSubmit={onSubmit}
        className={inputShow ? "show todo" : "hide todo"}
        onClick={() => setInputShow(false)}
      >
        <input
          ref={focusTodo}
          type="text"
          value={newTodo}
          onChange={onNewTodo}
          placeholder="할 일 목록을 적어보세요."
          onBlur={onSubmit}
        />
      </form>
    </div>
  );
}

export default App;
