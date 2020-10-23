const express = require('express');
const router = express.Router();
const EmployeeController = require('../controllers/employees.controller');

router.get('/employees', EmployeeController.getAll);
router.get('/employees/random', EmployeeController.getRandom);
router.get('/employees/:id', EmployeeController.getById);
router.post('/employees', EmployeeController.post);
router.put('/employees/:id', EmployeeController.put);
router.delete('/employees/:id', EmployeeController.delete);

module.exports = router;

//metoda remove - podobna - ma zastosowanie w przypadku bezpośredniego dostępu do dokumentu.
//Na przykład, jeśli z jakiegoś powodu załadowalibyśmy już dane z bazy:
//const employee = await Employee.find({ _id: '42423fwfe5435fsdf' });
//i chcielibyśmy taki dokument usunąć, to zamiast korzystać z deleteOne:
//const employee = await Employee.find({ _id: '42423fwfe5435fsdf' });
//await Employee.deleteOne({ _id: employee._id });
//moglibyśmy użyć metody remove bezpośrednio na tym dokumencie:
//const employee = await Employee.find({ _id: '42423fwfe5435fsdf' });
//await employee.remove();
//Oczywiście Mongoose wciąż korzystałby tutaj z deleteOne i efekt byłby dokładnie taki sam. 
//To po prostu "skrót", który ma poprawić czytelność kodu. 
//Naturalnie ta metoda ma zastosowanie tylko wtedy, gdy dany dokument jest już załadowany, więc mamy do niego 
//dostęp. W przeciwnym razie, szybszym wyjściem będzie skorzystanie z deleteOne lub deleteMany.
