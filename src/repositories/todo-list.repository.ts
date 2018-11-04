import {
    Getter,
    DefaultCrudRepository,
    juggler,
    HasManyRepositoryFactory,
    repository
} from '@loopback/repository';
import {TodoList, Todo} from '../models';
import {inject} from '@loopback/core';
import {TodoRepository} from './todo.repository';

export class TodoListRepository extends DefaultCrudRepository<TodoList, typeof TodoList.prototype.id> {
    public readonly todos: HasManyRepositoryFactory<Todo, typeof TodoList.prototype.id>;

    constructor(@inject('datasources.db') dataSource: juggler.DataSource,
                @repository.getter(TodoRepository) protected todoRepositoryGetter: Getter<TodoRepository>, ) {

        super(TodoList, dataSource);

        this.todos = this._createHasManyRepositoryFactoryFor(
            'todos',
             todoRepositoryGetter,
        );
    }
}