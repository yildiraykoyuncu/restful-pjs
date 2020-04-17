debugger;

(async function RESTfulFetchExample() {

  const start = Date.now();
  const timedMsg = (msg) => `${Date.now() - start} ms.: ${msg}`;


  // for best study results, keep db.json open in VSC
  //  keep an eye on the .json file as you step through each fetch
  //  and take a look at the logs in the console running your app
  //  what's the relationship between fetches, logs & changes in db.json?

  // you'll find that if you run this script without pausing in the debugger
  //  often some random requests will throw errors
  //  this is because of asynchrony
  // because this example uses promises instead of async/await
  //  it's possible to try to access todos before they are created
  //  can you refactor this example to async/await to avoid these errors?



  console.log(timedMsg('--- clearing last example ---'));

  const fetchingAllOld = ' 0 -> fetching old todos';
  try {
    console.log(timedMsg('request' + fetchingAllOld));
    const res = await fetch('/todos');
    const data = await res.json();
    console.log(timedMsg('response' + fetchingAllOld), data);

    for (let todo of data) {
      const deletingMsg = ` 0.${todo.id} -> deleting old todo ${todo.id}`;

      console.log(timedMsg('request' + deletingMsg));
      try {
        const res = await fetch(`/todos/${todo.id}`,
          { method: 'DELETE' });
        const data = await res.json();
        console.log(timedMsg('response' + deletingMsg), data);
      } catch (err) {
        console.log(timedMsg('response' + deletingMsg), err);
      };
    };
  } catch (err) {
    console.log(timedMsg('response' + fetchingAllOld), err);
  };



  console.log('\n' + timedMsg('--- beginning example ---'));

  const exampleStep1 = ' 1 -> creating new todo';
  console.log(timedMsg('request' + exampleStep1));
  // post is used to add a new entry at the end of your collection
  const newTodo = { todoText: 'new todo', completed: false };

  fetch('/todos', {
    method: 'POST',
    body: JSON.stringify(newTodo),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
    .then(res => res.json())
    .then(data => console.log(timedMsg('response' + exampleStep1), data))
    .catch(err => console.log(timedMsg('response' + exampleStep1), err));



  const exampleStep2 = ' 2 -> reading new todo by id param (declaring method)';
  // GET is used to retrieve an entry
  console.log(timedMsg('request' + exampleStep2));
  // you can access an entry by .id using a url parameter
  fetch('/todos/1', {
    method: 'GET',
  })
    .then(res => res.json())
    .then(data => console.log(timedMsg('response' + exampleStep2), data))
    .catch(err => console.log(timedMsg('response' + exampleStep2), err));



  const exampleStep3 = ' 3 -> reading new todo by id query  (default GET method)';
  // GET is the default method, you don't need to specify
  console.log(timedMsg('request' + exampleStep3));
  // you can also get all entries with a specific key/value pair with URL queries
  fetch('/todos?id=1')
    .then(res => res.json())
    .then(data => console.log(timedMsg('response' + exampleStep3), data))
    .catch(err => console.log(timedMsg('response' + exampleStep3), err));



  const bodyQuery = encodeURIComponent('new todo');
  const exampleStep4 = ` 4 -> reading new todo todoText query (${bodyQuery}):`;
  console.log(timedMsg('request' + exampleStep4));

  fetch('/todos?todoText=' + bodyQuery)
    .then(res => res.json())
    .then(data => console.log(timedMsg('response' + exampleStep4), data))
    .catch(err => console.log(timedMsg('response' + exampleStep4), err));



  const exampleStep5 = ' 5 -> adding todo 2 for PUTing';
  console.log(timedMsg('request' + exampleStep5));
  fetch('/todos', {
    method: 'POST',
    body: JSON.stringify({ todoText: 'second todo', completed: false }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
    .then(res => res.json())
    .then(data => console.log(timedMsg('response' + exampleStep5), data))
    .catch(err => console.log(timedMsg('response' + exampleStep5), err));



  const exampleStep6 = ' 6 -> adding todo 3 for PATCHing';
  console.log(timedMsg('request' + exampleStep6));
  fetch('/todos', {
    method: 'POST',
    body: JSON.stringify({ todoText: 'third todo', completed: false }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
    .then(res => res.json())
    .then(data => console.log(timedMsg('response' + exampleStep6), data))
    .catch(err => console.log(timedMsg('response' + exampleStep6), err));



  const exampleStep7 = ' 7 -> updating todo 2 with PUT';
  console.log(timedMsg('request' + exampleStep7));
  // PUT is used to completely replace an entry with the new one

  fetch('/todos/2', {
    method: 'PUT',
    body: JSON.stringify({ completed: true }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
    .then(res => res.json())
    .then(data => console.log(timedMsg('response' + exampleStep7), data))
    .catch(err => console.log(timedMsg('response' + exampleStep7), err));



  const exampleStep8 = ' 8 -> updating todo 3 with PATCH';
  console.log(timedMsg('request' + exampleStep8));
  // PATCH is used to update only specific key/value pairs

  fetch('/todos/3', {
    method: 'PATCH',
    body: JSON.stringify({ completed: true }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
    .then(res => res.json())
    .then(data => console.log(timedMsg('response' + exampleStep8), data))
    .catch(err => console.log(timedMsg('response' + exampleStep8), err));


  const exampleStep9 = 'adding seven random todos';
  console.log(timedMsg(exampleStep9 + ' ...'));

  for (let i = 1; i <= 7; i++) {

    const randomTodoMsg = ` ${i + 8} -> new random todo ${i + 3}:`;

    console.log(timedMsg('request' + randomTodoMsg));
    const completed = (Math.random() > 0.5) ? true : false;
    const todoText = Math.random().toString(36).substring(8);
    fetch('/todos', {
      method: 'POST',
      body: JSON.stringify({ completed, todoText }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
      .then(res => res.json())
      .then(data => console.log(timedMsg('response' + randomTodoMsg), data))
      .catch(err => console.log(timedMsg('response' + randomTodoMsg), err));
  };

  console.log(timedMsg('... ' + exampleStep9));



  const exampleStep10 = ' 16 -> deleting the 5th todo';
  console.log(timedMsg('request' + exampleStep10));
  fetch('/todos/5', {
    method: 'DELETE'
  })
    .then(res => res.json())
    .then(data => console.log(timedMsg('response' + exampleStep10), data))
    .catch(err => console.log(timedMsg('response' + exampleStep10), err));



  const exampleStep11 = ' 17 -> fetching all todos';
  console.log(timedMsg('request' + exampleStep11));
  fetch('/todos?completed=true')
    .then(res => res.json())
    .then(data => console.log(timedMsg('response' + exampleStep11), data))
    .catch(err => console.log(timedMsg('response' + exampleStep11), err));



  const exampleStep12 = ' 18 -> fetching all completed todos';
  console.log(timedMsg('request' + exampleStep12));
  fetch('/todos?completed=true')
    .then(res => res.json())
    .then(data => console.log(timedMsg('response' + exampleStep12), data))
    .catch(err => console.log(timedMsg('response' + exampleStep12), err));


})();

