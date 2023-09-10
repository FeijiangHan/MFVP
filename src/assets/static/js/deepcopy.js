export function deepCopy(object) {
    if (!object || typeof object !== "object") return object;
  
    let newObject = Array.isArray(object) ? [] : {};
  
    for (let key in object) {
      if (object.hasOwnProperty(key)) {
        newObject[key] = deepCopy(object[key]);
      }
    }
  
    return newObject;
  }