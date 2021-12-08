# Acá irán los controllers.js

Los controllers estarán ubicados en carpetas (users, products, etc) y cada uno tendrá un nombre con este formato:

- _method_ -**nombreDeLaFuncionEnCamelCase**-controller.js

El **_method_** puede ser get, post, put, delete, etc.

## El template para el controller es algo así:

```javascript
const createJsonError = require('../'); // completar
const throwJsonError = require('../'); // completar
// require function from repositories (DB)

async function nombreFuncion(req, res) {
  try {
    // VALIDACION PARAMETROS ENTRADA
    // LLAMADA BASE DE DATOS
    // VALIDAR RESULTADO
    res.status(200);
    res.send();
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = nombreFuncion;
```
