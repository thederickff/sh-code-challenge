import { Entity } from "./base.entity";

export interface TaskProps {
  createdAt: Date;
  summary: string;
  userId: number;
}

export class Task extends Entity {
  private _props: TaskProps;

  get createdAt() {
    return this._props.createdAt;
  }

  get summary() {
    return this._props.summary;
  }

  get userId() {
    return this._props.userId;
  }

  constructor(props: TaskProps) {
    super();
    this._props = props;
  }
}