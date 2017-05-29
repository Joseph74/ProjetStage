var faker = require('faker');
var express = require('express');

var jsdom = require('jsdom');
var $ = require('jquery');

/*var jsdom = require('jsdom').jsdom
  , myWindow = jsdom().createWindow()
  , $ = require('jQuery')
  , jq = require('jQuery').create()
  , jQuery = require('jQuery').create(myWindow)
  ;*/

var app = express();

app.use(express.static(__dirname + '/'));

app.use(function(req, res, next) {
	console.log('Il se passe quelque chose.');
	next();
});

app.get('/', function(req, res) {
	res.json({ message: 'Ca marche.' });	
});

/*192.168.1.14:5601*/
 
app.get('/getData', function (req, res) {
	/*var number = faker.random.number(5000);
	var number2 = faker.random.number(5000);*/
	
	/*var arrayElement = faker.random.arrayElement(["12 pm", "3 am", "6 am", "9 am", "12 am", "3 pm", "6 pm", "9 pm"]);
	var arrayElement2 = faker.random.arrayElement(["12 pm", "3 am", "6 am", "9 am", "12 am", "3 pm", "6 pm", "9 pm"]);*/

	/*res.sendfile(__dirname + '/index.html');*/
	
	/*var nb = Math.floor(Math.random() * 51);*/
		
	res.json(data_json = [  
  {  
	"key":"Ressource 1",
    "values":[  
      {  
        "axis":"12 am",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"3 am",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"6 am",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"9 am",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"12 pm",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"3 pm",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"6 pm",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"9 pm",
        "value":Math.floor(Math.random() * 5000)
      }
    ]
  },
  {  
    "key":"Ressource 2",
    "values":[  
      {  
        "axis":"12 am",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"3 am",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"6 am",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"9 am",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"12 pm",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"3 pm",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"6 pm",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"9 pm",
        "value":Math.floor(Math.random() * 5000)
      }
    ]
  },
  {  
    "key":"Ressource 3",
    "values":[  
      {  
        "axis":"12 am",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"3 am",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"6 am",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"9 am",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"12 pm",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"3 pm",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"6 pm",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"9 pm",
        "value":Math.floor(Math.random() * 5000)
      }
    ]
  },
  {  
    "key":"Ressource 4",
    "values":[  
      {  
        "axis":"12 am",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"3 am",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"6 am",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"9 am",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"12 pm",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"3 pm",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"6 pm",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"9 pm",
        "value":Math.floor(Math.random() * 5000)
      }
    ]
  },
  {  
    "key":"Ressource 5",
    "values":[  
      {  
        "axis":"12 am",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"3 am",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"6 am",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"9 am",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"12 pm",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"3 pm",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"6 pm",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"9 pm",
        "value":Math.floor(Math.random() * 5000)
      }
    ]
  },
  {  
    "key":"Ressource 6",
    "values":[  
      {  
        "axis":"12 am",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"3 am",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"6 am",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"9 am",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"12 pm",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"3 pm",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"6 pm",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"9 pm",
        "value":Math.floor(Math.random() * 5000)
      }
    ]
  },
  {  
    "key":"Ressource 7",
    "values":[  
      {  
        "axis":"12 am",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"3 am",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"6 am",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"9 am",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"12 pm",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"3 pm",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"6 pm",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"9 pm",
        "value":Math.floor(Math.random() * 5000)
      }
    ]
  },
  {  
    "key":"Ressource 8",
    "values":[  
      {  
        "axis":"12 am",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"3 am",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"6 am",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"9 am",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"12 pm",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"3 pm",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"6 pm",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"9 pm",
        "value":Math.floor(Math.random() * 5000)
      }
    ]
  },
  {  
    "key":"Ressource 9",
    "values":[  
      {  
        "axis":"12 am",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"3 am",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"6 am",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"9 am",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"12 pm",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"3 pm",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"6 pm",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"9 pm",
        "value":Math.floor(Math.random() * 5000)
      }
    ]
  },
  {  
    "key":"Ressource 10",
    "values":[  
      {  
        "axis":"12 am",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"3 am",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"6 am",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"9 am",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"12 pm",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"3 pm",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"6 pm",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"9 pm",
        "value":Math.floor(Math.random() * 5000)
      }
    ]
  }
]);
						
	res.end();
});

app.get('/getIndex', function (req, res) {
	
	res.sendfile(__dirname + '/index.html');
});

app.get('/getData1', function (req, res) {

	res.json(data_json = [  
  {  
	"key":"Ressource 1",
    "values":[  
      {  
        "axis":"12 am",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"3 am",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"6 am",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"9 am",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"12 pm",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"3 pm",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"6 pm",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"9 pm",
        "value":Math.floor(Math.random() * 5000)
      }
    ]
  }
]);
						
	res.end();
});

app.get('/getData2', function (req, res) {

	res.json(data_json = [
  {  
	"key":"Ressource 1",
    "values":[  
      {  
        "axis":"12 am",
        "value":null
      },
      {  
        "axis":"3 am",
        "value":null
      },
      {  
        "axis":"6 am",
        "value":null
      },
      {  
        "axis":"9 am",
        "value":null
      },
      {  
        "axis":"12 pm",
        "value":null
      },
      {  
        "axis":"3 pm",
        "value":null
      },
      {  
        "axis":"6 pm",
        "value":null
      },
      {  
        "axis":"9 pm",
        "value":null
      }
    ]
  },
  {  
	"key":"Ressource 2",
    "values":[  
      {  
        "axis":"12 am",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"3 am",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"6 am",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"9 am",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"12 pm",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"3 pm",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"6 pm",
        "value":Math.floor(Math.random() * 5000)
      },
      {  
        "axis":"9 pm",
        "value":Math.floor(Math.random() * 5000)
      }
    ]
  }
]);
						
	res.end();
});

app.listen(3000);
console.log('Le serveur est en marche.');

	