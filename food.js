class Food {
  #position;
  #type;
  #potential;
  constructor(position, type) {
    this.#position = position.slice();
    this.#type = type;
    this.#potential = type == 'specialFood' ? 10 : 1;
  }

  getState() {
    return {
      position: this.location.slice(),
      type: this.#type,
      point: this.#potential,
    };
  }
  get location() {
    return this.#position.slice();
  }

  get point() {
    return this.#potential;
  }
}
