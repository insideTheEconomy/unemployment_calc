	console.log("Functions Loaded")

	function DBConnector () {

	}
	dbp = DBConnector.prototype;
//	dbp.statement = new air.SQLStatement();
//	dbp.conn = new air.SQLConnection();
	dbp.dbname = "test.db";
	dbp.db;
	/*dbp.resHandler = function(e){
		//this.statement.removeEventListener(air.SQLEvent.RESULT, this.resHandler);
		var data = e.target.getResult().data[0];
		air.trace(data["observations"])
		var obs = JSON.parse(data["observations"]);
		$.event.trigger({
					type: "FRED",
					json: obs,
					time: new Date()
				});
	}*/
	
	DBConnector.prototype.open = function(){
	//	this.statement.sqlConnection = this.conn;
		this.openHandler = function(e){
			console.log("openHandler");
		
		}
		this.folder = Ti.Filesystem.getResourcesDirectory();
		this.dbFile = this.folder.resolve(this.dbname);
		this.db = Ti.Database.openFile(this.dbFile);
		
		/*this.statement = new air.SQLStatement();
		this.conn = new air.SQLConnection();
		this.statement.sqlConnection = this.conn;*/
	//	this.conn.addEventListener(air.SQLEvent.OPEN,  this.openHandler, false);
	//	this.conn.openAsync(dbFile);
	}
	
	
	DBConnector.prototype.queryByIds = function(ids){
		var q = "SELECT * FROM ser_data WHERE ser_data.ser_id = (SELECT series_id FROM ser_id WHERE g_id LIKE "+ids.g+" AND ed_id  LIKE "+ids.ed+" AND ar_id LIKE "+ids.ar+")"
		rows = this.db.execute(q);
		var obs = JSON.parse(rows.fieldByName("observations"));
//		var ser = JSON.parse(rows.fieldByName("series"));
//		var ser_title = ser.seriess[0].title;
		
		$.each(obs,function(i,v){
				str = v.date;
				a = str.split("-");
				var _d = new Date(a[0],a[1],a[2]);
				v.jsDate = _d;
			});
		$.event.trigger({
					type: "FRED",
					observations: obs,
//title: ser_title
				});
		
	/*	this.statement.clearParameters();
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
		this.statement.execute(); */
	}

	

