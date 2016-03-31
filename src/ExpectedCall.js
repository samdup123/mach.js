'use strict';

var Any = require('./Any.js');
var Same = require('./Same.js');

class ExpectedCall {
  // TODO: pass in expectation
  constructor(mock, args, required, checkArgs) {
    this.mock = mock;
    this.completed = false;
    this.strictlyOrdered = false;
    this.checkArgs = checkArgs;
    this.required = required;
    this.expectedArgs = args;
    this.actualArgs = undefined;
    this.returnValue = undefined;
    this.throwValue = undefined;
  }

  complete(args) {
    this.completed = true;
    this.actualArgs = args;
  }

  matchesFunction(mock) {
    return mock === this.mock;
  }

  matchesArguments(args) {
    if (!this.checkArgs) {
      return true;
    }

    if (args.length !== this.expectedArgs.length) {
      return false;
    }

    for (let i = 0; i < args.length; i++) {
      if (this.expectedArgs[i] instanceof Any) {
        continue;
      }

      if (this.expectedArgs[i] instanceof Same) {
        if (!this.expectedArgs[i].matcher(args[i], this.expectedArgs[i].value)) {
          return false;
        } else {
          continue;
        }
      }

      if (args[i] !== this.expectedArgs[i]) {
        return false;
      }
    }

    return true;
  }

  matches(mock, args) {
    return this.matchesFunction(mock) && this.matchesArguments(args);
  }

  get name() {
    return this.mock._name;
  }

  clone() {
    let clone = new ExpectedCall(this.mock, this.expectedArgs, this.required, this.checkArgs);
    clone.returnValue = this.returnValue;
    return clone;
  }
}

module.exports = ExpectedCall;
