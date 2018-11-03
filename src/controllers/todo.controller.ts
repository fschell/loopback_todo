import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getWhereSchemaFor,
  patch,
  del,
  requestBody,
} from '@loopback/rest';
import {inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {Todo} from '../models';
import {TodoRepository} from '../repositories';

import {GeocoderService} from '../services';

export class TodoController {
  constructor(
      @repository(TodoRepository) protected todoRepository: TodoRepository,
      @inject('services.GeocoderService') protected geoService: GeocoderService,
  ) {}

    @post('/todos')
    async createTodo(@requestBody() todo: Todo): Promise<Todo> {
        if (!todo.title) {
            throw new HttpErrors.BadRequest('title is required');
        }
        if (todo.remindAtAddress) {
            console.log('looking for Adress:', todo.remindAtAddress);
            // TODO(bajtos) handle "address not found"
            const geo = await this.geoService.geocode(todo.remindAtAddress);
            // Encode the coordinates as "lat,lng" (Google Maps API format). See also
            // https://stackoverflow.com/q/7309121/69868
            // https://gis.stackexchange.com/q/7379
            console.log('GEO RES', geo);
            if (geo && geo.length) {
                todo.remindAtGeo = `${geo[0].y},${geo[0].x}`;
            }
        }
        return await this.todoRepository.create(todo);
    }

  @get('/todos/count', {
    responses: {
      '200': {
        description: 'Todo model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Todo)) where?: Where,
  ): Promise<Count> {
    return await this.todoRepository.count(where);
  }

  @get('/todos', {
    responses: {
      '200': {
        description: 'Array of Todo model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Todo}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Todo)) filter?: Filter,
  ): Promise<Todo[]> {
    return await this.todoRepository.find(filter);
  }

  @patch('/todos', {
    responses: {
      '200': {
        description: 'Todo PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() todo: Todo,
    @param.query.object('where', getWhereSchemaFor(Todo)) where?: Where,
  ): Promise<Count> {
    return await this.todoRepository.updateAll(todo, where);
  }

  @get('/todos/{id}', {
    responses: {
      '200': {
        description: 'Todo model instance',
        content: {'application/json': {'x-ts-type': Todo}},
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Todo> {
    return await this.todoRepository.findById(id);
  }

  @patch('/todos/{id}', {
    responses: {
      '204': {
        description: 'Todo PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody() todo: Todo,
  ): Promise<void> {
    await this.todoRepository.updateById(id, todo);
  }

  @del('/todos/{id}', {
    responses: {
      '204': {
        description: 'Todo DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.todoRepository.deleteById(id);
  }
}
