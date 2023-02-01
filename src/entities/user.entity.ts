import { Entity } from "./base.entity";

export interface UserProps {
  name: string;
  type: 'manager' | 'technician';
}

export class User extends Entity {
  private _props: UserProps;

  get name() {
    return this._props.name;
  }

  get type() {
    return this._props.type;
  }

  constructor(props: UserProps) {
    super();
    this._props = props;
  }
}