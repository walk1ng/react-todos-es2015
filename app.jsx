class App extends React.Component {

	constructor() {
		super();
		this.state = {
			// TODO: using localdb to store the todo item rather than cleared every refresh
			todos: [],
			isAllDone: false
		}
	}

	allDone() {
		console.log('check if all done')
		let isAllDone = false;
		if(this.state.todos.every((todo) => todo.isDone)){
			isAllDone = true;
		}
		console.log('after check isAllDone=', isAllDone)
		this.setState({
			todos: this.state.todos,
			isAllDone: isAllDone
		})
	}

	clearDone() {
		let todos_undone = this.state.todos.filter((todo) => !todo.isDone);
		console.log('enter into clear done')
		console.log(todos_undone);
		this.setState({
			todos: todos_undone,
			isAllDone: false
		});
	}


	deleteTodo(index) {
		this.state.todos.splice(index, 1);
		/*this.setState({
			todos: this.state.todos
		});*/
		this.allDone();
	}

	addTodo(newtodoitem) {
		this.state.todos.push(newtodoitem);
		this.allDone();
	}

	changeTodoState(index, isDone, isChangeAll=false) {

		if(isChangeAll){
			this.setState({
				todos: this.state.todos.map((todo) => {
					todo.isDone = isDone;
					return todo;
				}),
				isAllDone: isDone
			})
		}else{
			this.state.todos[index].isDone = isDone;
			this.allDone();
		}
	}


	render() {

		console.log('render app')

		var todostatus = {
			total: this.state.todos.length || 0,
			finish: (this.state.todos && this.state.todos.filter((todo) => todo.isDone)).length || 0,
		};

		return (
			<div>
				<TodoHeader addTodo={(newtodoitem) => {this.addTodo(newtodoitem)}}/>
				<TodoMain todos={this.state.todos} 
					deleteTodo={(index) => this.deleteTodo(index)} 
					changeTodoState={(index, isDone, isChangeAll) => {this.changeTodoState(index, isDone, isChangeAll)}}/>
				<TodoFooter {...todostatus} 
					changeTodoState={(index, isDone, isChangeAll) => {this.changeTodoState(index, isDone, isChangeAll)}} 
					clearDone={() => {this.clearDone()}} isAllDone={this.state.isAllDone}/>
			</div>
		)
	}
}


class TodoHeader extends React.Component {

	handleKeyUp(e) {
		if(e.keyCode === 13){
			let value = e.target.value;

			if(!value) return false;

			let newtodoitem = {
				text: value,
				isDone: false
			};

			e.target.value = "";
			this.props.addTodo(newtodoitem);
		}
	}

	render() {
		return (
			<div>
				<input type='text' placeholder='what is your task?' onKeyUp={(e) => {this.handleKeyUp(e)}} />
			</div>
		)
	}
}

class TodoItem extends React.Component {

	handleMouseOver() {
		React.findDOMNode(this.refs.deleteBtn).style.display = "inline";
	}

	handleMouseOut() {
		React.findDOMNode(this.refs.deleteBtn).style.display = "none";
	}

	handleChange() {
		console.log('single todo item checkbox changed');
		this.props.changeTodoState(this.props.index, !this.props.isDone);
		
	}

	handleClick() {
		console.log('single todo item remove button click');
		this.props.deleteTodo(this.props.index);
	}

	render() {
		return (
			<li
			onMouseOver={() => this.handleMouseOver()}
			onMouseOut={() => this.handleMouseOut()}
			>
				<input type='checkbox' checked={this.props.isDone} onChange={() => {this.handleChange()}}/>
				<span>{this.props.text}</span>
				<button ref="deleteBtn" style={{'display':'none'}} onClick={() => this.handleClick()}>删除</button>
			</li>
		)
	}
}


class TodoMain extends React.Component {

	render() {

		return (
			<ul>
				{this.props.todos.map((todo, index) => {
					return <TodoItem isDone={todo.isDone} key={'item-' + index } index={index} text={todo} deleteTodo={this.props.deleteTodo} changeTodoState={this.props.changeTodoState} />
				})}
			</ul>
		)

		console.log('main render')
	}
}

class TodoFooter extends React.Component {

	handleChange(e) {
		console.log('checkbox for all select');
		this.props.changeTodoState(null, e.target.checked, true);
	}

	handleClick() {
		console.log('remove all done button click');
		this.props.clearDone();
	}

	render() {
		return (
			<div>
				<input type='checkbox' onChange={(e) => {this.handleChange(e)}} checked={this.props.isAllDone}/>
				<span>{this.props.finish}完成/{this.props.total}总计</span>
				<button onClick={() => {this.handleClick()}}>清除已完成</button>
			</div>	
		)
	}	
}

app = React.render(
	<App/>, document.getElementById('content')
);