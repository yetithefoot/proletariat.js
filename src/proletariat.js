/*
Copyright (C) 2013 Vlad Tsepelev

Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
and associated documentation files (the "Software"), to deal in the Software without restriction, 
including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


// Worker class extensions

Worker.prototype.inProgress = function(){
	return ((this.type != "canceled") && (this.type != "errored") && (this.type != "finished")); 
}

Worker.prototype.postMessageWithType = function(type, dataObject, refBuffer){
	var object = dataObject || {};
	object.type = type;
	this.type = type;
	this.postMessage(object, refBuffer);
	return this;
}

Worker.prototype.init = function(dataObject, refBuffer){
	return this.postMessageWithType("init", dataObject, refBuffer);
	
}

Worker.prototype.setup = function(dataObject, refBuffer){
	return this.postMessageWithType("setup", dataObject, refBuffer);
}

Worker.prototype.start = function(){
	return this.postMessageWithType("start");
}

Worker.prototype.cancel = function(){
	return this.postMessageWithType("cancel");
}

// Proletariat methods
// TODO: 

Proletariat = {};

Proletariat.createWorker = function(url, delegate){
	var worker = new Worker(url);
	worker.delegate = delegate || {};

	var onMessageHandler = function(event){
		var messageType = event.data.type;
		worker.type = messageType;
		if(messageType == 'inited' && worker.delegate.inited){
			worker.delegate.inited(event);
		}
		else if(messageType == 'setuped' && worker.delegate.setuped){
			worker.delegate.setuped(event);
		}
		else if(messageType == 'started' && worker.delegate.started){
			worker.delegate.started(event);
		}
		else if(messageType == 'cancelled' && worker.delegate.cancelled){
			worker.delegate.cancelled(event);
		}
		else if(messageType == 'progressed' && worker.delegate.progressed){
			worker.delegate.progressed(event);
		}
		else if(messageType == 'errored' && worker.delegate.errored){
			worker.delegate.errored(event);
		}
		else if(messageType == 'finished' && worker.delegate.finished){
			worker.delegate.finished(event);
		}
	}

	worker.onmessage = onMessageHandler;

	return worker;
}


Proletariat.createCrowd = function(workers){
	
	var crowd = [];

	if(workers){
		for (var i = workers.length - 1; i >= 0; i--) {
			crowd.push(workers[i]);
		};
	}

	return crowd;
}


Proletariat.addWorkersToCrowd = function(crowd, workers){
	
	if(workers){

		if(!Array.isArray(workers)){ // add one 
			crowd.push(workers);
		}else{ // add all from array
			for (var i = workers.length - 1; i >= 0; i--) {
				crowd.push(workers[i]);
			};
		}
	}

	return crowd;
}


Proletariat.isCrowdInProgress = function(crowd){
	
	if(crowd){

		for (var i = crowd.length - 1; i >= 0; i--) {
			if(crowd[i].inProgress()) return true;
		};
	}

	return false;
}


Proletariat.startCrowd = function(crowd, allfinished){
	if(crowd){

		for (var i = crowd.length - 1; i >= 0; i--) {

			var originalhandler = crowd[i].delegate.finished;
			crowd[i].delegate.finished = function(evt){
				if(originalhandler) originalhandler(evt);
				if(!Proletariat.isCrowdInProgress(crowd) && allfinished){
					allfinished();
				}
			}
			crowd[i].start();
		};
	}

	return crowd;
}


