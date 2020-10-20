const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectId;// funkcja do konwersji na typ ObjectId, czytelny dla MongoDB.

router.get('/products', (req, res) => {
  req.db.collection('products').find().toArray((err, data) => {
    if(err) res.status(500).json({ message: err });//Jeśli jest błąd, to zwracamy go wraz z kodem statusu informującym o problemie (500). 
    else res.json(data);//Gdy wszystko jest w porządku, zwracamy po prostu znalezione dane.
  });
});

router.get('/products/random', (req, res) => {
  req.db.collection('products').aggregate([ { $sample: { size: 1 } } ]).toArray((err, data) => {
    if(err) res.status(500).json({ message: err });
    else res.json(data[0]);
  });
});

router.get('/products/:id', (req, res) => {
  req.db.collection('products').findOne({ _id: ObjectId(req.params.id) }, (err, data) => {//MongoDB sam dodaje do każdego dokumentu losowe id (właśnie pod atrybutem _id).
    //Wartość może wydawać się taka sama, ale jednak typ jest inny. Należy więc skonwertować req.params.id do typu ObjectId właśnie za pomocą funkcji ObjectId. 
    if(err) res.status(500).json({ message: err });
    else if(!data) res.status(404).json({ message: 'Not found' });//sprawdza, czy w ogóle coś znaleziono.Jeśli żaden dokument nie będzie pasować do warunku, MongoDB nie zwróci błędu, tylko null. Wysłanie w takiej sytuacji komunikatu Not found będzie bardziej eleganckim rozwiązaniem.
    else res.json(data);
  });
});

router.post('/products', (req, res) => {
  const { name } = req.body;
  req.db.collection('products').insertOne({ name: name }, err => {
    if(err) res.status(500).json({ message: err });
    else res.json({ message: 'OK' });
  })
});

router.put('/products/:id', (req, res) => {
  const { name } = req.body;
  req.db.collection('products').updateOne({ _id: ObjectId(req.params.id) }, { $set: { name: name }}, err => {
    if(err) res.status(500).json({ message: err });
    else res.json({ message: 'OK' });
  });
});

router.delete('/products/:id', (req, res) => {
  req.db.collection('products').deleteOne({ _id: ObjectId(req.params.id) }, err => {
    if(err) res.status(500).json({ message: err });
    else res.json({ message: 'OK' });
  });
});

module.exports = router;
