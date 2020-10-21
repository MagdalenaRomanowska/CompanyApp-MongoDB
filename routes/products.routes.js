const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/products.controller');

router.get('/products', ProductController.getAll );

router.get('/products/random', ProductController.getRandom );

router.get('/products/:id', ProductController.getById );

router.post('/products', ProductController.post );

router.put('/products/:id', ProductController.put );

router.delete('/products/:id', ProductController.delete );

module.exports = router;

//metoda remove - podobna - ma zastosowanie w przypadku bezpośredniego dostępu do dokumentu.
//Na przykład, jeśli z jakiegoś powodu załadowalibyśmy już dane z bazy:
//const product = await Product.find({ _id: '42423fwfe5435fsdf' });
//i chcielibyśmy taki dokument usunąć, to zamiast korzystać z deleteOne:
//const product = await Product.find({ _id: '42423fwfe5435fsdf' });
//await Product.deleteOne({ _id: product._id });
//moglibyśmy użyć metody remove bezpośrednio na tym dokumencie:
//const product = await Product.find({ _id: '42423fwfe5435fsdf' });
//await product.remove();
//Oczywiście Mongoose wciąż korzystałby tutaj z deleteOne i efekt byłby dokładnie taki sam. 
//To po prostu "skrót", który ma poprawić czytelność kodu. 
//Naturalnie ta metoda ma zastosowanie tylko wtedy, gdy dany dokument jest już załadowany, więc mamy do niego 
//dostęp. W przeciwnym razie, szybszym wyjściem będzie skorzystanie z deleteOne lub deleteMany.
