import React from 'react';
import ReactDOM from 'react-dom';
import { List, Map } from 'immutable';

class TodoApp extends React.Component {
  constructor(props) {
    super(props);
    this.changeFilter = this.changeFilter.bind(this);
    this.newItemChange = this.newItemChange.bind(this);
    this.newItemEnter = this.newItemEnter.bind(this);
    this.killCompleted = this.killCompleted.bind(this);
    this.currentKey = 0;
    this.state = {
      newItemText: '',
      cond: 'all',
      items: List([]),
    };
  }
  killCompleted() {
    this.setState({
      items: this.state.items.filter((item) => !item.get('completed')),
    });
  }
  createItem(text) {
    this.currentKey += 1;
    return Map({
          key: this.currentKey,
          text: text,
          completed: false,
          changing: false
    });
  }
  newItemEnter(e) {
    if (e.key == 'Enter') {
      this.setState({
        newItemText: '',
        items: this.state.items.unshift(this.createItem(this.state.newItemText)),
      })
    }
  }
  newItemChange(e) {
    this.setState({newItemText: e.target.value});
  }
  changeFilter(e) {
    this.setState({cond: e.target.value});
  }
  deleteItem(index) {
    return () => {
      this.setState({
        items: this.state.items.delete(index)
      })
    }
  }
  completeItem(index) {
    return () => {
      var completed = !this.state.items.get(index).get('completed');
      this.setState({
        items: this.state.items.update(index, (item) => item.set('completed', completed))
      })
    }
  }
  changeItem(index) {
    return (e) => {
      var text = e.target.value;
      this.setState({
        items: this.state.items.update(index, (item) => item.set('text', text))
      })
    }
  }
  changeItemEnter(index) {
    return (e) => {
      if (e.key == 'Enter') {
        this.setState({
          items: this.state.items.update(index, (item) => item.set('changing', false))
        })
      }
    }
  }
  itemToInputMode(index) {
    return () => {
      this.setState({
        items: this.state.items.update(index, (item) => item.set('changing', true))
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
            value={this.state.newItemText} onChange={this.newItemChange} onKeyPress={this.newItemEnter}/>
        </div>
        <ul>
          {
            this.state.items.filter(
              (item) => {
                switch (this.state.cond) {
                  case "all":
                    return true;
                  case "completed":
                    return item.get('completed');
                  case "notYet":
                    return !item.get('completed');
                }
              }
            ).map((item, i) => {
              return <Item key={item.get('key')} item={item}
                onComplete={this.completeItem(i)}
                inputMode={this.itemToInputMode(i)} 
                onDelete={this.deleteItem(i)}
                onChange={this.changeItem(i)}
                onChangeItemEnter={this.changeItemEnter(i)} />;
            })
          }
        </ul>
      </div>
    );
  }
  }

class Item extends React.Component {
  componentDidUpdate (prevProps) {
    if ((prevProps.item.get('text') != this.props.item.get('text') || prevProps.item.get('changing') == false) && this.props.item.get('changing')) {
      this.textInput.focus();
    }
  }
  render () {
    return (
      <li>
        <input type="checkbox" name="completed" checked={this.props.item.get('completed')}
          onChange={this.props.onComplete}/>
        { 
          (() => {
              if (this.props.item.get('changing')) {
                return <input type="input" 
                  onChange={this.props.onChange}
                  onKeyPress={this.props.onChangeItemEnter}
                  value={this.props.item.get('text')}
                  ref={(input) => {this.textInput = input;}}/>
            } else {
              return <span onDoubleClick={this.props.inputMode}>{this.props.item.get('text')}</span>
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