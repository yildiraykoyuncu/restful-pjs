import { Todo } from './todo.js';
import { logger } from '../../lib/logger';


export class List {
    list = []
    listItem = null;


    constructor(url, listItem) {
        this.listItem = listItem;
        this.populate(data);
        this.url = url;

    }

    async populate(url) {

        try {
            const res = await fetch(url);
            const data = await res.json();
            const ListItem = this.listItem
            data.forEach(todo => {
                const text = todo.text;
                const estCycles = todo.estCycles;
                const id = todo.id

                const newItem = new ListItem(text, estCycles, id);
                this.list.push(newItem);
            })
        } catch (err) {
            console.log(err)
        }

    }

    addTodo() {
        const ListItem = this.listItem
        const text = document.getElementById('inputField').value;
        const estCycles = document.getElementById('inputNumber').value;
        const newItem = new ListItem(text, estCycles, this.list.length);
        this.list.push(newItem)
    }

    addTodoHandler(event) {

        if (event.target.id === 'saveBtn') {
            this.addTodo()
            this.render();
        } else if (event.target.id === 'cancelBtn') {
            this.render();
        } else {
            return;
        }
        //devlogs

        logger.push({
            action: 'add todo',
            list: this.list,
            event
        })

    }

    addTodoScreenCall(event) {

        //call add todo screen
        this.renderAddTodoWindow();
    }

    render() {
        const userInt = document.getElementById('todo')
        userInt.innerHTML = '';

        //todo container
        const todoDiv = document.createElement('div');
        todoDiv.id = 'todoContainer';
        todoDiv.classList.add('container');

        //header
        const headerDiv = document.createElement('div');
        headerDiv.id = 'headerDiv';

        const header = document.createElement('span');
        header.textContent = 'Tasks';

        const optionBtn = document.createElement('button');
        optionBtn.type = 'button';
        optionBtn.id = 'todoOptionBtn';
        optionBtn.innerHTML = '<i class="fas fa-ellipsis-v"></i>';

        headerDiv.appendChild(header);
        headerDiv.appendChild(optionBtn);

        todoDiv.appendChild(headerDiv);


        userInt.appendChild(todoDiv)


        //add todo button

        const addTodoBtn = document.createElement('button');
        addTodoBtn.type = 'button';
        addTodoBtn.id = 'addTodoBtn'
        addTodoBtn.innerHTML = '<i class="fas fa-plus-circle"></i> Add Task'

        userInt.appendChild(addTodoBtn)
        addTodoBtn.addEventListener('click', this.addTodoScreenCall.bind(this))

        //todos


        if (this.list.length === 0) { return }

        const renderedTodos = this.list.map(item => {
            return item.render();

        }).reduce((all, next) => {
            all.appendChild(next);
            return all;
        }, document.createElement('ul'))



        userInt.insertBefore(renderedTodos, addTodoBtn);

    }

    renderAddTodoWindow() {
        //Add todo screen
        const addTodoDiv = document.createElement('div');
        addTodoDiv.id = 'addTodoDiv'
            // input field
        const inputDiv = document.createElement('div');
        inputDiv.id = 'inputDiv'

        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.id = 'inputField';
        inputField.placeholder = 'What are you working on?'
        inputDiv.appendChild(inputField)


        // Number of estimated pomodoros
        const title = document.createElement('span');
        title.textContent = 'Est Pomodoros'
        inputDiv.appendChild(title);

        const estPomodoros = document.createElement('input');
        estPomodoros.type = 'number';
        estPomodoros.min = '0';
        estPomodoros.step = '1';
        estPomodoros.value = '1';
        estPomodoros.id = 'inputNumber'
        inputDiv.appendChild(estPomodoros);

        addTodoDiv.appendChild(inputDiv)

        // save and cancel buttons

        const confirmDiv = document.createElement('div');
        confirmDiv.id = 'confirmationDiv';

        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.id = 'cancelBtn';
        cancelBtn.classList.add('confirmationBtn')
        cancelBtn.textContent = 'Cancel'

        const saveBtn = document.createElement('button');
        saveBtn.type = 'button';
        saveBtn.id = 'saveBtn';
        saveBtn.classList.add('confirmationBtn')
        saveBtn.textContent = 'Save'

        confirmDiv.appendChild(cancelBtn);
        confirmDiv.appendChild(saveBtn);

        addTodoDiv.appendChild(confirmDiv);

        const addTodoBtn = document.getElementById('addTodoBtn');
        addTodoBtn.parentElement.insertBefore(addTodoDiv, addTodoBtn)
        document.getElementById('todo').removeChild(addTodoBtn);
        addTodoDiv.addEventListener('click', this.addTodoHandler.bind(this))
    }
}