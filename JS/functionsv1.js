air.trace("Functions Loaded")

function DBConnector () {
	this.result = new air.SQLResult;
	this.statement;
	this.conn;
	this.data = {"stupid":"data"};
	this.dbname = "test.db";
	this.evDis =  document.createElement("div");
	this._events = {};
//	this.ev = new window.runtime.flash.events.Event("test");
	
	
	this.open = function(){
		var folder = air.File.applicationDirectory;
		var dbFile = folder.resolvePath("test.db");
		this.statement = new air.SQLStatement();
		this.statement.addEventListener(air.SQLEvent.RESULT, this.resultHandler, false);
		this.conn = new air.SQLConnection();
		this.statement.sqlConnection = this.conn;
		this.conn.addEventListener(air.SQLEvent.OPEN, openHandler, false);
		this.conn.openAsync(dbFile);
		
	}
	
	
	
	function openHandler(){
		air.trace("DB_OPEN");
	}
	
}

DBConnector.prototype = {
  addListener: function(eventName, callback) {
	
      var events = this._events,
          callbacks = events[eventName] = events[eventName] || [];
      callbacks.push(callback);
  },
  raiseEvent: function(eventName, args) {
	air.trace("raising")
      var callbacks = this._events[eventName];
      for (var i = 0, l = callbacks.length; i < l; i++) {
          callbacks[i].apply(null, args);
      }
  },
  test : function() {
    this.raiseEvent('ON_TEST', [1,2,3]); // whatever args to pass to listeners
  },
	open : function(){
		var folder = air.File.applicationDirectory;
		var dbFile = folder.resolvePath("test.db");
		this.statement = new air.SQLStatement();
		this.statement.addEventListener(air.SQLEvent.RESULT, this.resultHandler, false);
		this.conn = new air.SQLConnection();
		this.statement.sqlConnection = this.conn;
		this.conn.addEventListener(air.SQLEvent.OPEN, openHandler, false);
		this.conn.openAsync(dbFile);
		
	},queryByIds : 	function(ids){
		var q = "SELECT * FROM ser_id WHERE g_id LIKE "+ids.g+" AND ed_id  LIKE "+ids.ed+" AND ar_id LIKE "+ids.ar;
		this.statement.text = q;
		this.statement.execute();
	},
	resultHandler : function(e){
		ev = document.createEvent("Events");

		ev.initEvent("test", true, true);
		this.result = e.target.getResult();
		this.data = this.result.data;
	//	air.trace(this.data);
		this.raiseEvent('ON_TEST', [1,2,3]);
	},
	queryByIds : function(ids){
		var q = "SELECT * FROM ser_id WHERE g_id LIKE "+ids.g+" AND ed_id  LIKE "+ids.ed+" AND ar_id LIKE "+ids.ar;
		air.trace(q);
		this.statement.text = q;
		this.statement.execute();
	}
	
	
};


