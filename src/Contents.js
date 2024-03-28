class Contents {
  constructor() {
    this.contents = new Map();
  }

  /**
   * Adds a content object with the specified name. If the name already exists,
   * it updates the existing content.
   * @param {string} name - The name of the content to add.
   * @param {Object} content - The content object to associate with the name.
   */
  addContentByName(name, content) {
    this.contents.set(name, content);
  }

  /**
   * Retrieves a content object by its name.
   * @param {string} name - The name of the content to retrieve.
   * @returns {Object|null} The content object if found, otherwise null.
   */
  getContentByName(name) {
    return this.contents.get(name) || null;
  }

  /**
   * Checks if a content with the specified name exists.
   * @param {string} name - The name of the content to check.
   * @returns {boolean} True if the content exists, false otherwise.
   */
  hasContentByName(name) {
    return this.contents.has(name);
  }

  /**
   * Removes a content by its name. If the content doesn't exist, this method does nothing.
   * @param {string} name - The name of the content to remove.
   */
  removeContentByName(name) {
    this.contents.delete(name);
  }
}
