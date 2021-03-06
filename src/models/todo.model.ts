import {Entity, model, property} from '@loopback/repository';

@model()
export class Todo extends Entity {
    @property({
        type: 'number',
        id: true,
    })
    id?: number;

    @property({
        type: 'string',
        required: true,
    })
    title: string;

    @property({
        type: 'boolean',
    })
    isCompleted?: boolean;

    @property({
        type: 'string',
    })
    remindAtAddress?: string; // address,city,zipcode

    @property({
        type: 'string',
    })
    remindAtGeo?: string; // latitude,longitude

    @property()
    todoListId: number;

    constructor(data?: Partial<Todo>) {
        super(data);
    }
}
