//* This is the Timer function, in case the user wants to play a timed game.

Timer = function(listener, resolution) {
	this.startTime = 0;
	this.endTime = 0;
	this.totalDuration = 0; // * elapsed number of ms in total
	this.running = false;
	this.listener = listener; //(listener != undefined ? listener : null); // * function to receive onTick events
	this.tickResolution = 1000; // * how long between each tick in milliseconds
	this.tickInterval = null;
}

Timer.prototype.start = function() {
	var delegate = function(that, method) { return function() { return method.call(that) } };
	if(!this.running) {
		this.startTime = new Date().getTime();
		this.endTime = 0;
		this.running = true;
		this.tickInterval = setInterval(delegate(this, this.onTick), this.tickResolution);
	}
}
Timer.prototype.stop = function() {
	if(this.running) {
		this.endTime = new Date().getTime();
		this.running = false;
		var duration = this.endTime - this.startTime;
		this.totalDuration += duration;
		if(this.tickInterval != null)
			clearInterval(this.tickInterval);
	}
	return this.getDuration();
}
Timer.prototype.reset = function() {
	this.totalDuration = 0;
	// * if watch is running, reset it to current time
	this.startTime = new Date().getTime();
	this.endTime = this.startTime;
	if (this.tickInterval != null) {
		var delegate = function(that, method) {
			return function() {
				return method.call(that);
			};
		};
		clearInterval(this.tickInterval);
		this.tickInterval = setInterval(delegate(this, this.onTick),
			this.tickResolution);
	}
}

Timer.prototype.getDuration = function() {
	// * if watch is stopped, use that date, else use now
	var duration = 0;
	if(this.running)
		duration = new Date().getTime() - this.startTime;
	duration += this.totalDuration;

  var hours, mins, secs, ms;
	hours = Math.floor(duration / (1000*60*60));
	duration %= (1000*60*60);
	mins = Math.floor(duration / (1000*60));
	duration %= (1000*60);
  secs = Math.floor(duration / 1000);
	ms = duration % 1000;

	return {
		hours: hours,
		minutes: mins,
		seconds: secs,
		milliseconds: ms
	};
}

Timer.prototype.displayToString = function() {
	var transform = function(number) {
		number = number.toString();
		if(number.length < 2)
			number = '0' + number;
		return number;
	}
	var display = this.getDuration();
	return transform(display.hours) + ":" + transform(display.minutes) + ":" + transform(display.seconds);
}

// triggered every <resolution> ms
Timer.prototype.onTick = function() {
		this.listener(this);
}
