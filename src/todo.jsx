// 1. 皆以複製進行setState，若更改this.state則componentDidUpdate等等操作中的prevProps, preStates也會被修改
// 2. 降低模組化程度 FunctionBar 沒有理由被切開
import React from 'react';
import ReactDOM from 'react-dom';

class TodoApp extends React.Component {
  constructor(props) {
    super(props);
    this.changeFilter = this.changeFilter.bind(this);
    this.handleNewItemChange = this.handleNewItemChange.bind(this);
    this.handleNewItemEnter = this.handleNewItemEnter.bind(this);
    this.killCompleted = this.killCompleted.bind(this);
    this.currentKey = 0;
    this.state = {
      newItemText: '',
      cond: 'all',
      items: [
        {
          key: -2,
          text: "兜風",
          completed: false,
          changing: false,
        },
        {
          key: -1,
          text: "看漫畫",
          completed: true,
          changing: false,
        }
      ]
    };
  }
  killCompleted() {
    this.setState({
      items: this.state.items.filter((item) => !item.completed),
    });
  }
  handleNewItemEnter(e) {
    if (e.key == 'Enter') {
      var newItems  = [
        {
          key: this.currentKey,
          text: this.state.newItemText,
          completed: false,
          changing: false
        }
      ].concat(this.state.items);
      this.currentKey += 1;
      this.setState({
        newItemText: '',
        items: newItems,
      })
    }
  }
  handleNewItemChange(e) {
    this.setState({newItemText: e.target.value});
  }
  changeFilter(e) {
    this.setState({cond: e.target.value});
  }
  deleteItem(index) {
    return () => {
      this.state.items.splice(index, 1);
      this.setState({
        items: this.state.items
      })
    }
  }
  completeItem(index) {
    return () => {
      this.state.items[index].completed = !this.state.items[index].completed;
      this.setState({
        items: this.state.items
      })
    }
  }
  changeItem(index) {
    return (e) => {
      var clone = JSON.parse(JSON.stringify(this.state.items));
      clone[index].text = e.target.value;
      this.setState({
        items: clone
      })
    }
  }
  changeItemEnter(index) {
    return (e) => {
      if (e.key == 'Enter') {
        this.state.items[index].changing = false;
        this.setState({
          items: this.state.items,
        })
      }
    }
  }
  itemToInputMode(index) {
    return () => {
      this.state.items[index].changing = true;
      this.setState({
        items: this.state.items
      })
    }
  }
  render () {
    return (
      <div>
        <h1> 待辦事項 </h1>
        <div>
          篩選條件
          <input onClick={this.changeFilter} type="radio" id="condAll" name="cond" value="all" defaultChecked/>
          <label htmlFor="condAll">全部</label>
          <input onClick={this.changeFilter} type="radio" id="condCompleted" name="cond" value="completed" />
          <label htmlFor="condCompleted">已完</label>
          <input onClick={this.changeFilter} type="radio" id="condNotYet" name="cond" value="notYet" />
          <label htmlFor="condNotYet">未完</label>
          <br />
          <button onClick={this.killCompleted}>刪除已完成事項</button>
          <br />
          <input className="input" type="text" placeholder="輸入新事項"
            value={this.state.newItemText} onChange={this.handleNewItemChange} onKeyPress={this.handleNewItemEnter}/>
        </div>
        <ul>
          {
            this.state.items.filter(
              (item) => {
                switch (this.state.cond) {
                  case "all":
                    return true;
                  case "completed":
                    return item.completed;
                  case "notYet":
                    return !item.completed;
                }
              }
            ).map((item, i) => {
              // TODO: key之研究
              return <Item key={item.key} item={item}
                completeItem={this.completeItem(i)}
                inputMode={this.itemToInputMode(i)} 
                onDelete={this.deleteItem(i)}
                handleOnChange={this.changeItem(i)}
                changeItemEnter={this.changeItemEnter(i)} />;
            })
          }
        </ul>
      </div>
    );
  }
}

class Item extends React.Component {
  componentDidUpdate (prevProps) {
    if ((prevProps.item.text != this.props.item.text) || prevProps.item.changing == false && this.props.item.changing) {
      this.textInput.focus();
      console.log(this.textInput)
    }
  }
  render () {
    return (
      <li>
        <input type="checkbox" name="completed" checked={this.props.item.completed}
          onChange={this.props.completeItem}/>
        { 
          (() => {
              if (this.props.item.changing) {
                return <input type="input" 
                  onChange={this.props.handleOnChange}
                  onKeyPress={this.props.changeItemEnter}
                  value={this.props.item.text}
                  ref={(input) => {this.textInput = input;}}/>
            } else {
              return <span onDoubleClick={this.props.inputMode}>{this.props.item.text}</span>
            }
          })()
        }
        <button onClick={this.props.onDelete}>刪除</button>
      </li>
    );
  }
}

ReactDOM.render(
  <TodoApp />,
  document.getElementById('root')
);