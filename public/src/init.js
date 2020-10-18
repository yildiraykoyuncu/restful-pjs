'use strict';

import { timer } from "./timer.js"
import { Todo } from './todo.js'
import { List } from './List.js'


const todoList = new List('/todos', Todo)


timer.render()