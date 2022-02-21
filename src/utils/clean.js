function isObject(obj) {
    return obj === Object(obj);
}

export function clean(obj) {
    if(!isObject(obj)){
        return obj
    }

    for (let propName in obj) {
        if (obj[propName] === null || obj[propName] === undefined) {
          delete obj[propName];
      }
    }
    return obj
}