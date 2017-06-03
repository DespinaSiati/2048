//* This is the Timer function, in case the user wants to play a timed game.

Timer = function(updateFunction) {
  this.startTime = 0;
  this.endTime = 0;
  this.running = false;  //state of Timer
  this.totalDuration = 0; //time in ms when game ends
  this.functionListener = updateFunction; // function that is called to update the display of the timer
  this.interval = null;
}

 // Starts the timer
  Timer.prototype.start = function() {
    var delegate = function(that, method) {
      return function() {
        return method.call(that);
      };
    }
    if (!this.running) {
      this.startTime = new Date().getTime();
      this.endTime = 0;
      this.running = true;
      this.interval = setInterval(delegate(this, this.onTick), 1000); // every second the display of timer gets updated
    }
  }

  // Resets the timer to 0
  Timer.prototype.reset = function() {
    this.totalDuration = 0;
    this.startTime = new Date().getTime();
    this.endTime = this.startTime;
    if (this.interval != null) {
      var delegate = function(that, method) {
        return function(){
          return method.call(that);
        };
      }
      clearInterval(this.interval);
      this.interval = setInterval(delegate(this, this.onTick), 1000);
    }
  }

  // Stops the timer
  Timer.prototype.stop = function () {
    if (this.running) {
      this.endTime = new Date().getTime();
      this.running = false;
      var duration = this.endTime - this.startTime;
      this.totalDuration += duration;
      if (this.interval != null) {
        clearInterval(this.interval);
    }
    return this.getDuration();
  }

  Timer.prototype.getDuration = function() {
    var duration = 0;
    if(this.running) {   //if the timer is still runnning we have to use the current time
      duration = new Date().getTime - this.startTime;
    }
    duration = duration + this.totalDuration;

    var hours, min, sec, ms;
    hours = Math.floor(duration / (1000*60*60)); // 1h = 1000*60*60 ms
    duration = duration % (1000*60*60); // get the remaining minutes

    min = Math.floor(duration / (1000*60)); // 1min = 1000*60 ms
    duration = duration % (1000*60); // get the remaining seconds

    sec = Math.floor(duration / 1000); // 1sec = 1000 ms
    ms = duration % 1000; // get the remaining ms

    return {
      hours: hours,
      min: min,
      sec: sec,
      millisec: ms
    };
  }

  // Turns the display of the timer into a string
  Timer.prototype.displayToString = function() {
    // functiom that transforms int hours, minutes, seconds to string
    var transform = function(number) {
      number = number.toString();
      if (number.length < 2) {
        number = '0' + number;
      }
      return number;
    }
    var display = this.getDuration();
    return transform(display.hours) + ':' + transform(display.min) + ':' + transform(display.sec);
  }

  // Triggered every 1000ms
  Timer.prototype.onTick = function() {
    this.functionListener(this);
  }
