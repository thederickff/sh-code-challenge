export class Entity {
  private _id?: number;

  get id() {
    return this._id;
  }

  set id(id: number | undefined) {
    this._id = id;
  }
}