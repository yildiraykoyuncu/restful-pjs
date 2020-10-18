import { logger } from '../lib/logger.js'
export class Todo {

    constructor(text, estCycles = 1, id) {
        this.text = text;
        this.estCycles = estCycles;
        this.id = id;
        this.isCompleted = false;
    }

    render() {
        const li = document.createElement('li');
        li.classList.add('todoItem');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.dataset.index = this.id;

        if (this.isCompleted) {
            checkbox.checked = true;
        }

        checkbox.addEventListener('click', this.toggleCompleted.bind(this))

        const body = document.createElement('span');
        body.textContent = this.text;

        li.appendChild(checkbox);
        li.appendChild(body);
        return li;

    }

    toggleCompleted(event) {

        this.isCompleted = !this.isCompleted

        logger.push({
            action: 'toggle complete',
            todo: this,
            event
        })

    }
}