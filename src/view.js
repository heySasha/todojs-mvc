import { EventEmitter, createElement } from './helpers';

class View extends EventEmitter {
    constructor() {
        super();

        this.form = document.getElementById('todo-form');
        this.input = document.getElementById('add-input');
        this.list = document.getElementById('todo-list');

        this.form.addEventListener('submit', this.handleAdd.bind(this));

        /*                                                                          */
        this.removeCompletedBtn = document.getElementById('remove-completed');
        this.removeCompletedBtn.addEventListener('click', this.handleRemoveCompleted.bind(this));

        /*                                                                          */
        this.activeLink = document.getElementById('active');
        this.completedLink = document.getElementById('completed');
        this.allLink = document.getElementById('all');


        this.selectedLink = 'all';

        this.activeLink.addEventListener('click', () => { this.showActive() });
        this.completedLink.addEventListener('click', () => { this.showCompleted() });
        this.allLink.addEventListener('click', () => { this.showAll() });

        this.on('active', this.showActive.bind(this));
        this.on('completed', this.showCompleted.bind(this));
    }

    createListItem(todo) {
        const checkbox = createElement('input', { type: 'checkbox', className: 'checkbox', checked: todo.completed ? 'checked' : '' });
        const label = createElement('label', { className: 'title' }, todo.title);
        const editInput = createElement('input', { type: 'text', className: 'textfield' });
        const editButton = createElement('button', { className: 'edit' }, 'Изменить');
        const deleteButton = createElement('button', { className: 'remove' }, 'Удалить');
        const item = createElement('li', { className: `todo-item${todo.completed ? ' completed': ''}`, 'data-id': todo.id }, checkbox, label, editInput, editButton, deleteButton);

        return this.addEventListeners(item);
    }

    addEventListeners(item) {
        const checkbox = item.querySelector('.checkbox');
        const editButton = item.querySelector('button.edit');
        const removeButton = item.querySelector('button.remove');

        checkbox.addEventListener('change', this.handleToggle.bind(this));
        editButton.addEventListener('click', this.handleEdit.bind(this));
        removeButton.addEventListener('click', this.handleRemove.bind(this));

        return item;
    }

    findListItem(id) {
        return this.list.querySelector(`[data-id="${id}"]`);
    }

    handleAdd(event) {
        event.preventDefault();

        if (!this.input.value) return alert('Необходимо ввести название задачи.');

        const value = this.input.value;

        this.emit('add', value);
    }

    handleToggle({ target }) {
        const listItem = target.parentNode;
        const id = listItem.getAttribute('data-id');
        const completed = target.checked;

        this.emit('toggle', { id, completed });

        this.emit(this.selectedLink);
    }

    handleEdit({ target }) {
        const listItem = target.parentNode;
        const id = listItem.getAttribute('data-id');
        const label = listItem.querySelector('.title');
        const input = listItem.querySelector('.textfield');
        const editButton = listItem.querySelector('button.edit');
        const title = input.value;
        const isEditing = listItem.classList.contains('editing');

        if (isEditing) {
            this.emit('edit', { id, title });
        } else {
            input.value = label.textContent;
            editButton.textContent = 'Сохранить';
            listItem.classList.add('editing');
        }
    }

    handleRemove({ target }) {
        const listItem = target.parentNode;

        this.emit('remove', listItem.getAttribute('data-id'));
    }

    handleRemoveCompleted() {
        this.emit('remove-completed');
    }


    show(todos) {
        todos.forEach(todo => {
            const listItem = this.createListItem(todo);

            this.list.appendChild(listItem);
        });
    }

    showActive() {
        this.selectedLink = 'active';

        const listItem = this.list.querySelectorAll('li');

        this.activeLink.classList.add('selected');
        this.completedLink.classList.remove('selected');
        this.allLink.classList.remove('selected');

        listItem.forEach(item => item.style.display = item.querySelector('.checkbox').checked ? 'none' : '');
    }

    showCompleted() {
        this.selectedLink = 'completed';

        const listItem = this.list.querySelectorAll('li');

        this.completedLink.classList.add('selected');
        this.allLink.classList.remove('selected');
        this.activeLink.classList.remove('selected');

        listItem.forEach(item => item.style.display = item.querySelector('.checkbox').checked ? '' : 'none');
    }

    showAll() {
        this.selectedLink = 'all';

        const listItem = this.list.querySelectorAll('li');

        this.allLink.classList.add('selected');
        this.completedLink.classList.remove('selected');
        this.activeLink.classList.remove('selected');

        listItem.forEach(item => item.style.display = '');
    }


    addItem(todo) {
        const listItem = this.createListItem(todo);

        this.input.value = '';
        this.list.appendChild(listItem);
    }

    toggleItem(todo) {
        const listItem = this.findListItem(todo.id);
        const checkbox = listItem.querySelector('.checkbox');

        checkbox.checked = todo.completed;

        listItem.classList.toggle('completed');
    }

    editItem(todo) {
        const listItem = this.findListItem(todo.id);
        const label = listItem.querySelector('.title');
        const input = listItem.querySelector('.textfield');
        const editButton = listItem.querySelector('button.edit');

        label.textContent = todo.title;
        editButton.textContent = 'Изменить';
        listItem.classList.remove('editing');
    }

    removeItem(id) {
        const listItem = this.findListItem(id);

        this.list.removeChild(listItem);
    }

    removeCompleted() {
        this.list.querySelectorAll('li').forEach(item => item.querySelector('.checkbox').checked && this.list.removeChild(item));
    }
}

export default View;