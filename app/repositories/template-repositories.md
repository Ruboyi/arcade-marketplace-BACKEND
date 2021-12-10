# Acá irán los repositories.js

Cada repository tendrá un nombre con este formato:

- **_table_** -repository.js

El **_table_** puede ser users, products, orders, etc.

Una vez dentro del archivo y antes que nada, se hace un require a la función getPool():

    const getPool = require('../infrastructure/database-infrastructure');

## El template para las funciones del repository es algo así:

```javascript
async function nombreFuncion() {
  const pool = await getPool();
  const sql = `SELECT * FROM table`;
  const loQueNecesitemos = await pool.query(sql);
  return loQueNecesitemos;
}

// AÑADIR LA FUNCIÓN AL OBJETO DE MODULE.EXPORTS

module.exports = {
  nombreFuncion,
};
```
