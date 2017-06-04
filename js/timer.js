// This is the Timer function, in case the user wants to play a timed game.

Timer = function(listener) {
	this.startTime = 0;
	this.endTime = 0;
	this.totalTimePassed = 0; // * total passed time in ms
	this.running = false;     //* state of the timer
	this.listener = listener; // * function to receive onTick events
	this.tickInterval = null;
}
// Starts the timer
Timer.prototype.start = function() {
	var delegate = function(that, method) { return function() { return method.call(that) } };
	if(!this.running) {
		this.startTime = new Date().getTime();
		this.endTime = 0;
		this.running = true;
		this.tickInterval = setInterval(delegate(this, this.onTick), 1000);
	}
}
// Stops the timer
Timer.prototype.stop = function() {
	if(this.running) {
		this.endTime = new Date().getTime();
		this.running = false;
		var timePassed = this.endTime - this.startTime;
		this.totalTimePassed += timePassed;
		if(this.tickInterval != null)
			clearInterval(this.tickInterval);
	}
	return this.getDuration();
}
// Resets the timer to 0
Timer.prototype.reset = function() {
	this.totalTimePassed = 0;
	this.startTime = new Date().getTime();
	this.endTime = this.startTime;
	if (this.tickInterval != null) {
		var delegate = function(that, method) {
			return function() {
				return method.call(that);
			};
		};
		clearInterval(this.tickInterval);
		this.tickInterval = setInterval(delegate(this, this.onTick), 1000);
	}
}
// Returns the total time passed in h, min, sec
Timer.prototype.getDuration = function() {
	//  if watch is stopped, use that date, else use now
	var timePassed = 0;
	if(this.running)
		timePassed = new Date().getTime() - this.startTime;
	timePassed += this.totalTimePassed;

  var hours, min, sec, ms;
	hours = Math.floor(timePassed / (1000*60*60));
	timePassed %= (1000*60*60);
	min = Math.floor(timePassed / (1000*60));
	timePassed %= (1000*60);
  sec = Math.floor(timePassed / 1000);
	ms = timePassed % 1000;

	return {
		hours: hours,
		minutes: min,
		seconds: sec,
		milliseconds: ms
	};
}
// Function that turns the display of the timer from int to string
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

// Triggered every 1000 ms
Timer.prototype.onTick = function() {
		this.listener(this);
}
