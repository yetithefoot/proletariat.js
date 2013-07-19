proletariat.js
==============


Proletariat.js is a microlibrary simplifies and hides routines with WebWorkers.
It set few rules and constraints to workers:

1. Messages posted TO workers should be in set ["init", "setup", "start", "cancel"] - Proletariat determine those methods.
Proletariat set "type" attribute to data object posted to webworker.
NOTE: If your dataObject already contains "type" attribute it will be overwriten by Proletariat.
Type stored into evt.data.type attribute passed to webworker's onmessage function.
So WebWorker code should listen for this types and split its workflow accordingly.


2. Messages posted FROM workers should be in set ["inited", "setuped", "started", "cancelled", "progressed", "errored", "finished"] - Proletariat listens only  for this events.
TODO: use callback with custom event type over all this methods.


3. Proletariat.createWorker method takes delegate as second argument.
delagate variable holds callbacks in one object:
delegate = {
  errored:function(evt){...}, 
	finished:function(evt){...},
	...
}

but you can set it from your code like this:

worker.delegate.errored =  function(evt) {console.log("Error: "+evt.data.message);};
worker.delegate.finished = finishedCallback;

