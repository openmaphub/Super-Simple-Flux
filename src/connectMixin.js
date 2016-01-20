import utils from './utils.js';

module.exports = function (store, options = {}) {
  var key = options.key;
  var noKey = key === undefined;

  return {
    getInitialState: function () {
      if(options.initWithProps){
        var componentInstance = this;
        if(Array.isArray(options.initWithProps)){
          options.initWithProps.forEach(function(prop){
            store.state[prop] =  componentInstance.props[prop];
          });
        }else{ //just load all the props over
          Object.keys(componentInstance.props).map(function (key) {
            store.state[key] =  componentInstance.props[key];
          })
        }

      }
      if (!utils.isFunction(store.getInitialState)) {
        console.warn('component ' + this.constructor.displayName + ' is trying to connect to a store that lacks "getInitialState()" method');
        if(options.initWithProps){
          return componentInstance.props;
        }else{
          return {};
        }
      } else {
        return noKey ? store.state : utils.object([key], [store.state[key]]);
      }
    },
    componentDidMount: function () {

      var componentInstance = this;

      let setStateFunc = state => {
        let newState = noKey ? state : utils.object([key], [state]);

        if (typeof componentInstance.isMounted === "undefined" || componentInstance.isMounted() === true) {
          componentInstance.setState(newState);
        }
      };

      let listener = noKey ? store : store[key];

      this.unsubscribe = listener.listen(setStateFunc);

    },
    componentWillUnmount: function(){this.unsubscribe();}
  }
};
