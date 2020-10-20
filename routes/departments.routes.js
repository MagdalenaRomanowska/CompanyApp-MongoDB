const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectId;// funkcja do konwersji na typ ObjectId, czytelny dla MongoDB.

router.get('/departments', (req, res) => {//toArray = konwertujemy wynik do tablicy. Bo efekt ma być taki sam jak wcześniej – wciąż chcemy, żeby ten endpoint zwracał tablicę danych (a nie Cursor). Po prostu powinien pobierać ją teraz z bazy danych.
  req.db.collection('departments').find().toArray((err, data) => {
    if(err) res.status(500).json({ message: err });//Jeśli jest błąd, to zwracamy go wraz z kodem statusu informującym o problemie (500). 
    else res.json(data);//Gdy wszystko jest w porządku, zwracamy po prostu znalezione dane.
  });
});

router.get('/departments/random', (req, res) => {//aggregate może zwrócić zbiór jedno, dwu, lub stuelementowy, ale zawsze będzie to zbiór danych, a nie pojedynczy dokument.
  req.db.collection('departments').aggregate([ { $sample: { size: 1 } } ]).toArray((err, data) => {
    if(err) res.status(500).json({ message: err });
    else res.json(data[0]);
  });
});

router.get('/departments/:id', (req, res) => {//Tym razem .toArray nie jest nam potrzebne, bo findOne zwróci od razu tylko jeden obiekt (dokument) lub null.
  req.db.collection('departments').findOne({ _id: ObjectId(req.params.id) }, (err, data) => {//MongoDB sam dodaje do każdego dokumentu losowe id (właśnie pod atrybutem _id).
    //Wartość może wydawać się taka sama, ale jednak typ jest inny. Należy więc skonwertować req.params.id do typu ObjectId właśnie za pomocą funkcji ObjectId. 
    if(err) res.status(500).json({ message: err });
    else if(!data) res.status(404).json({ message: 'Not found' });//sprawdza, czy w ogóle coś znaleziono.Jeśli żaden dokument nie będzie pasować do warunku, MongoDB nie zwróci błędu, tylko null. Wysłanie w takiej sytuacji komunikatu Not found będzie bardziej eleganckim rozwiązaniem.
    else res.json(data);
  });
});

router.post('/departments', (req, res) => {
  const { name } = req.body;
  req.db.collection('departments').insertOne({ name: name }, err => {
    if(err) res.status(500).json({ message: err });
    else res.json({ message: 'OK' });
  })
});

router.put('/departments/:id', (req, res) => {
  const { name } = req.body;
  req.db.collection('departments').updateOne({ _id: ObjectId(req.params.id) }, { $set: { name: name }}, err => {
    if(err) res.status(500).json({ message: err });
    else res.json({ message: 'OK' });
  });
});

router.delete('/departments/:id', (req, res) => {
  req.db.collection('departments').deleteOne({ _id: ObjectId(req.params.id) }, err => {
    if(err) res.status(500).json({ message: err });
    else res.json({ message: 'OK' });
  });
});

module.exports = router;
