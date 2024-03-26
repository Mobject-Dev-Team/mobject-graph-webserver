class Parameters {
  constructor() {
    this.parameters = new Map();
  }

  /**
   * Adds or updates a parameter with the specified name.
   * @param {string} name - The name of the parameter to add or update.
   * @param {any} value - The value of the parameter.
   */
  addParameterByName(name, value) {
    this.parameters.set(name, value);
  }

  /**
   * Retrieves a parameter value by its name.
   * @param {string} name - The name of the parameter to retrieve.
   * @returns {any|null} The value of the parameter if found, otherwise null.
   */
  getParameterByName(name) {
    return this.parameters.has(name) ? this.parameters.get(name) : null;
  }

  /**
   * Checks if a parameter with the specified name exists.
   * @param {string} name - The name of the parameter to check.
   * @returns {boolean} True if the parameter exists, false otherwise.
   */
  hasParameterByName(name) {
    return this.parameters.has(name);
  }

  /**
   * Removes a parameter by its name. If the parameter doesn't exist, this method does nothing.
   * @param {string} name - The name of the parameter to remove.
   */
  removeParameterByName(name) {
    this.parameters.delete(name);
  }
}
