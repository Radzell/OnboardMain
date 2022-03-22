function isObject(obj) {
    return obj === Object(obj);
}

export function clean(obj) {
    if(!isObject(obj)){
        return obj
    }

    

    for (let propName in obj) {
        if (obj[propName] === null || obj[propName] === undefined || typeof obj[propName] === "function") {
          delete obj[propName];
      }
    }
    return obj
}

export const cleanFunctions = (obj) =>  {

    Object.keys(obj).forEach(key =>
        (obj[key] && typeof obj[key] === 'object') && clean(obj[key]) ||
        (obj[key] === undefined || obj[key] === null || typeof obj[key] === "function") && delete obj[key]
    )
    return obj

    
}