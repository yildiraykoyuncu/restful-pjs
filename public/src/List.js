import { logger } from '../lib/logger.js';


export class List {
    list = []
    listItem = null;
    url = null;


    constructor(url, listItem) {
        this.listItem = listItem;
        this.url = url;
        this.populate(url);


    }

    //routes

    async getAll() {

        try {
            const response = await fetch(this.url)
            const data = await response.json();
            return await data;
        } catch (err) {
            console.log(err)
        };

    }

    async postItem(newItem) {
        try {
            const res = await fetch(this.url, {
                method: 'POST',
                body: JSON.stringify(newItem),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            });
            return await res.json();
        } catch (err) {
            console.log(err);
        };
    }

    async deleteItem(id) {
        try {
            const res = await fetch(this.url + '/' + id, {
                method: 'DELETE'
            });
            return await res.json();
        } catch (err) {
            console.log(err);
        };
    }

    async populate() {

        try {
            const data = await this.getAll();
            const ListItem = this.listItem
            data.forEach(todo => {
                const text = todo.text;
                const estCycles = todo.estCycles;
                const id = todo.id

                const newItem = new ListItem(text, estCycles, id);
                this.list.push(newItem);
            })
            this.render()
        } catch (err) {
            console.log(err)
        }

    }

    async addTodo() {
        const ListItem = this.listItem
        const text = document.getElementById('inputField').value;
        const estCycles = document.getElementById('inputNumber').value;
        // const id = this.idCounter;
        // this.idCounter += 1;
        const response = await fetch('/nextId/1');
        const idObj = await response.json()
        const id = idObj.nextID;

        const newItem = new ListItem(text, estCycles, id);
        this.list.push(newItem);
        await this.postItem(newItem);

        idObj.nextID += 1;

        await fetch('/nextId/1', {
            method: 'PUT',
            body: JSON.stringify(idObj),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
    }


    async addTodoHandler(event) {

        if (event.target.id === 'saveBtn') {
            await this.addTodo()
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

    async deleteHandler(event) {

        if (!event.target.classList.contains('fa-trash')) return

        const id = event.target.id || event.target.parentElement.id

        this.list = this.list.filter(item => {
            return !(item.id === Number(id))
        })

        await this.deleteItem(id);
        this.render();

        logger.push({
            action: 'delete',
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
            const renderedItem = item.render()
            renderedItem.addEventListener('click', this.deleteHandler.bind(this))
            return renderedItem;

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