Proletariat.js
==============
<a href="https://codeclimate.com/github/yetithefoot/proletariat.js"><img src="https://codeclimate.com/github/yetithefoot/proletariat.js.png" /></a>

**Proletariat.js** is a microlibrary simplifies and hides routines with WebWorkers.  
It set few rules and constraints to workers.

![Proletariat](https://raw.github.com/yetithefoot/proletariat.js/master/logo.png "Proletariat.js")

###Messages TO Workers


Messages posted TO workers should be in set ["init", "setup", "start", "cancel"] - Proletariat.js defines thуse methods in Worker class.
Proletariat set "type" attribute to data object posted to webworker.  
>NOTE: If your dataObject already contains "type" attribute it will be overwriten by Proletariat.
>Type stored into evt.data.type attribute passed to webworker's onmessage function.
So WebWorker code should listen for this types and split its workflow accordingly.

###Messages FROM Workers

Messages posted FROM workers should be in set ["inited", "setuped", "started", "cancelled", "progressed", "errored", "finished"] - Proletariat listens only  for this events.


###Delegates

*Proletariat.createWorker* method takes delegate as second argument.
delagate variable holds callbacks in one object:

```javascript
delegate = {  
    errored:function(evt){...},  
    finished:function(evt){...},
    ...
}  
```	

but you can set it from your code like this:

  
```javascript
worker.delegate.errored =  function(evt) {console.log("Error: "+evt.data.message);};
worker.delegate.finished = finishedCallback;
...
```

###Crowd

Crowd is a set of workers with similar tasks, it invokes *allFinished* callback, when all workers are finished.


###Usage

For example, your worker code looks like this:

```javascript
// hardjob.js
var name;
var data;

importScripts("sickle.js");
importScripts("hammer.js");

onmessage = function(evt){
    if(evt.data.type == "init"){
		name = evt.data.name;

	} 
	else if(evt.data.type == "setup"){
        data = evt.data.data;
	} 
	else if(evt.data.type == "start"){
		
        var hammer = new Hammer();
        var sickle = new Sickle();
        
        var hammerResult = hammer.run(name, data);
        var sickleResult = sickle.run(name, data);
        
        var totalResult = hammerResult + sickleResult;

        // returning object should specify "type" attribute
		postMessage({type:'finished', total:totalResult});
	}
}
```


You can create one simple worker and assign task to it:

```javascript
var hardworker = Proletariat.createWorker('hardjob.js');
hardworker.delegate.finished = onFinishHandler; // function(event) {...}
hardworker.init().setup({{data:"Lets hardwork!"}}).start();
```

Or create crowd of workers:

```javascript
// create crowd
var hardworkersCrowd = Proletariat.createCrowd(); 

// create workers an put them into crowd
for(var w=0; w<5; w++){
    var hardworker = Proletariat.createWorker('hardjob.js');
    hardworker.delegate.errored = onErrorHandler; // function(event) {...}
    hardworker.delegate.finished = onFinishHandler; // function(event) {...}
    Proletariat.addWorkersToCrowd(hardworkersCrowd, hardworker);
    hardworker.init({name:"Hardworker 1917-"+w}).setup({data:"Lets hardwork!"});
}

// start all workers
var onFinishAllHandler = function() { alert('Done!');}
Proletariat.startCrowd(hardworker, onFinishAllHandler);

```


