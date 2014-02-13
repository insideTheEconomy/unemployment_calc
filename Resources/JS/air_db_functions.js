	air.trace("Functions Loaded")

	function DBConnector () {

	}

	DBConnector.prototype.statement = new air.SQLStatement();
	DBConnector.prototype.conn = new air.SQLConnection();
	DBConnector.dbname = "test.db";
	DBConnector.prototype.resHandler = function(e){
		//this.statement.removeEventListener(air.SQLEvent.RESULT, this.resHandler);
		var data = e.target.getResult().data[0];
		air.trace(data["observations"])
		var obs = JSON.parse(data["observations"]);
		$.event.trigger({
					type: "FRED",
					json: obs,
					time: new Date()
				});
	}
	DBConnector.prototype.queryByIds = function(ids){
		this.statement.clearParameters();
		this.errHandler = function(e){
			air.trace("Error message:", event.error.message); 
			air.trace("Details:", event.error.details);
		}
		
		
		var q = "SELECT * FROM ser_data WHERE ser_data.ser_id = (SELECT series_id FROM ser_id WHERE g_id LIKE :g_id AND ed_id  LIKE :ed_id AND ar_id LIKE :ar_id)"
		
		this.statement.text = q;
		this.statement.parameters[":g_id"] = ids.g;
		this.statement.parameters[":ed_id"] = ids.ed;
		this.statement.parameters[":ar_id"] = ids.ar;
		//air.trace(q);
		this.statement.addEventListener(air.SQLEvent.RESULT, this.resHandler, false);
		this.statement.addEventListener(air.SQLErrorEvent.ERROR, this.errHandler, false);
		this.statement.execute();
	}

	DBConnector.prototype.open = function(){
		this.statement.sqlConnection = this.conn;
		this.openHandler = function(e){
			air.trace("openHandler");
		
		}
		var folder = air.File.applicationDirectory;
		var dbFile = folder.resolvePath("test.db");
		/*this.statement = new air.SQLStatement();
		this.conn = new air.SQLConnection();
		this.statement.sqlConnection = this.conn;*/
		this.conn.addEventListener(air.SQLEvent.OPEN,  this.openHandler, false);
		this.conn.openAsync(dbFile);
	}


