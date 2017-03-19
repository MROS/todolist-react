import React from 'react';
import ReactDOM from 'react-dom';

class TodoApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { items: ["兜風"] };
  }
  render () {
    return (
      <div>
        <h1> 待辦事項 </h1>
        <FunctionBar />
        <ul>
          { this.state.items.map((i) => <Item name={i} />) }
        </ul>
      </div>
    );
  }
}

class FunctionBar extends React.Component {
  render () {
    return (
      <div>
        篩選條件
        <input type="radio" name="cond"/> 全部
        <input type="radio" name="cond"/> 已完成
        <input type="radio" name="cond"/> 未完成
        <br />
        <button>刪除已完成事項</button>
      </div>
    );
  }
}

class Item extends React.Component {
  render () {
    return (
      <li>
        <input type="checkbox" name="completed"/>
        { this.props.name }
        <button>刪除</button>
      </li>
    );
  }
}

ReactDOM.render(
  <TodoApp />,
  document.getElementById('root')
);