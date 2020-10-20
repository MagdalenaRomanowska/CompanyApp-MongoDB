const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectId;// funkcja do konwersji na typ ObjectId, czytelny dla MongoDB.

router.get('/employees', (req, res) => {
  req.db.collection('employees').find().toArray((err, data) => {
    if(err) res.status(500).json({ message: err });//Jeśli jest błąd, to zwracamy go wraz z kodem statusu informującym o problemie (500). 
    else res.json(data);//Gdy wszystko jest w porządku, zwracamy po prostu znalezione dane.
  });
});

router.get('/employees/random', (req, res) => {
  req.db.collection('employees').aggregate([ { $sample: { size: 1 } } ]).toArray((err, data) => {
    if(err) res.status(500).json({ message: err });
    else res.json(data[0]);
  });
});

router.get('/employees/:id', (req, res) => {
  req.db.collection('employees').findOne({ _id: ObjectId(req.params.id) }, (err, data) => {//MongoDB sam dodaje do każdego dokumentu losowe id (właśnie pod atrybutem _id).
    //Wartość może wydawać się taka sama, ale jednak typ jest inny. Należy więc skonwertować req.params.id do typu ObjectId właśnie za pomocą funkcji ObjectId. 
    if(err) res.status(500).json({ message: err });
    else if(!data) res.status(404).json({ message: 'Not found' });//sprawdza, czy w ogóle coś znaleziono.Jeśli żaden dokument nie będzie pasować do warunku, MongoDB nie zwróci błędu, tylko null. Wysłanie w takiej sytuacji komunikatu Not found będzie bardziej eleganckim rozwiązaniem.
    else res.json(data);
  });
});

router.post('/employees', (req, res) => {
  const { name } = req.body;
  req.db.collection('employees').insertOne({ name: name }, err => {
    if(err) res.status(500).json({ message: err });
    else res.json({ message: 'OK' });
  })
});

router.put('/employees/:id', (req, res) => {
  const { name } = req.body;
  req.db.collection('employees').updateOne({ _id: ObjectId(req.params.id) }, { $set: { name: name }}, err => {
    if(err) res.status(500).json({ message: err });
    else res.json({ message: 'OK' });
  });
});

router.delete('/employees/:id', (req, res) => {
  req.db.collection('employees').deleteOne({ _id: ObjectId(req.params.id) }, err => {
    if(err) res.status(500).json({ message: err });
    else res.json({ message: 'OK' });
  });
});

module.exports = router;
