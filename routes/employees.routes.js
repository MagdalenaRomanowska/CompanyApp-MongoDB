const express = require('express');
const router = express.Router();
const Employee = require('../models/employee.model');

router.get('/employees', async (req, res) => {
  try {
    res.json(await Employee.find());//Mongoose'owy find używa po prostu metody find z MongoDB.
  }//w przypadku Mongoose nie musimy się już przejmować konwersją danych do tablicy. Paczka robi to za nas.
  catch(err) {
    res.status(500).json({ message: err });//błąd 500, który informuje użytkownika o winie serwera. 
  }
});

router.get('/employees/random', async (req, res) => {
  try {
    const count = await Employee.countDocuments();//countDocuments zlicza ilość wszystkich dokumentów w kolekcji.
    const rand = Math.floor(Math.random() * count);//losujemy liczbę, ale taką, która nie będzie większa od ilości dokumentów.
    const dep = await Employee.findOne().skip(rand);//wybrać bezwarunkowo jeden element. Metoda skip zapewnia 
    //nas, że wyszukiwanie będzie rozpoczynane z różnego miejsca. Jeśli rand=1, to rozpoczynamy wyszukiwanie od 
    //1go dokumentu. Ten od razu pasuje do warunku, więc zostanie zwrócony. Jeśli jednak rand=100, to wyszukiwanie 
    //pasującego elementu zacznie się od dokumentu nr 100 i to on będzie zwrócony jako 1szy pasujący. 
    if(!dep) res.status(404).json({ message: 'Not found' });//Na końcu upewniamy się, czy udało się coś 
    else res.json(dep);// znaleźć (kolekcja może być pusta) i zwracamy znaleziony element lub błąd.
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
});

router.get('/employees/:id', async (req, res) => {
  try {
    const dep = await Employee.findById(req.params.id);//nie musimy tym razem korzystać z funkcji ObjectId do konwersji stringu req.params.id do odpowiedniego formatu. Mongoose zajmuje się tym za nas.
    if(!dep) res.status(404).json({ message: 'Not found' });
    else res.json(dep);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
});

router.post('/employees', async (req, res) => {
  try {//Korzystamy z async...await, więc cały kod przechowujemy w bloku try...catch, bo pozwala to wyłapać błędy. 
    const { name } = req.body;//Najpierw "wyciągam" parametr name z req.body i przypisuję go do stałej.
    const newEmployee = new Employee({ name: name });//Mongoose: utwórz nowy obiekt typu Employee. Przekazujemy tylko name, bo _id będzie nadawane automatycznie.
    // Tworzy nowy dokument na bazie modelu Employee. Na tym etapie w bazie jeszcze go nie ma.
    await newEmployee.save();//save powinna zapisać dokument do kolekcji zgodnej z modelem (u nas Employee tyczy się kolekcji employees). Pod maską save korzysta z insertOne. 
    //Na końcu oczekuje na wykonanie metody (await) i jeśli wszystko poszło dobrze, to zwraca komunikat OK.
    res.json({ message: 'OK' });
  } catch(err) {
    res.status(500).json({ message: err });
  }
});

router.put('/employees/:id', async (req, res) => {
  const { name } = req.body;
  try {
    const dep = await(Employee.findById(req.params.id));//znajdź odpowiedni dział po id.
    if(dep) {
      dep.name = name;//zmień jego atrybut name na wartość z req.params.id.
      await dep.save();//zaktualizuj ten dokument w kolekcji.
      res.json({ message: 'OK' });
    }
    else res.status(404).json({ message: 'Not found...' });
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
});

router.delete('/employees/:id', async (req, res) => {
  try {
    const dep = await(Employee.findById(req.params.id));
    if(dep) {//deleteOne to odpowiednik znanego Ci już deleteOne z Mongo Shell.
      await Employee.deleteOne({ _id: req.params.id });
      res.json({ message: 'OK' });
    }
    else res.status(404).json({ message: 'Not found...' });
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
});

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
