	//console.log("Functions Loaded")
	 
	var sqlite3 = require('sqlite3').verbose();
	var fs = require("fs");
	//var db = new sqlite3.Database('../unemployment.db');

	function DBConnector () {
		this.rows;
	}
	
	dbp = DBConnector.prototype;


	dbp.db;
	
 
	
	dbp.open = function(){
		this.openHandler = function(e){
			//console.log("openHandler");
		}
		
		var dbpath = "unemployment.db";
		this.db = new sqlite3.Database(dbpath);
		console.log("this.db (open)= " + this.db);
		
	}
	
	
	dbp.queryByIds = function(ids){
	/*	var q = "SELECT * FROM ser_data WHERE ser_data.ser_id = (SELECT series_id FROM ser_id WHERE g_id LIKE "+ids.g+" AND ed_id  LIKE "+ids.ed+" AND ar_id LIKE "+ids.ar+")"
		rows = this.db.execute(q);
		var obs = JSON.parse(rows.fieldByName("observations"));*/

		obD = this.getData (ids);
		if(obD){
			$.event.trigger({
						type: "FRED",
						observations: obD.obs,
						series: obD.ser.seriess[0]
					});
		}else{
			$.event.trigger({
						type: "ERROR",
						text: "no record found in database",
					});
		}
		
	}
	
	dbp.getData = function( ids ){
		console.log("this.db (getData)= " + this.db);
		var q = "SELECT * FROM ser_data WHERE ser_data.ser_id = (SELECT series_id FROM ser_id WHERE g_id LIKE "+ids.g+" AND ed_id  LIKE "+ids.ed+" AND ar_id LIKE "+ids.ar+")"
		this.rows = this.db.all(q, function (err, rows) {
			if (err) {
				console.log("err: " + err);
			}
			
			if (rows.length > 0) {
				//cant figure out how to parse fields out of this row object
				console.log("rows: " rows);
			}
		});
		
		/*
		if(this.rows != null){
			ret = {}
			ret.obs = JSON.parse(this.rows.fieldByName("observations"));
			ret.ser = JSON.parse(this.rows.fieldByName("series"));
			//console.log("ROWS :"+this.rows)
			$.each(ret.obs,function(i,v){
						//console.log("adding dates")
						str = v.date;
						a = str.split("-");
						var _d = new Date(a[0],a[1],a[2]);
						v.jsDate = _d;
				});
				return ret;
		}else{
			return false;
		}*/
		
	}
	
	Object.defineProperty(dbp, "baseline",{
		get: function(){
			data = this.getData( { "g" : 0, "ed" : 0, "ar" : 0  });
			ret = data.obs;
			return ret },
		set: function(ds){
			this.data = ds;
			//console.log("DATASET RECEIVED");
			this.update();
			}});
	

	

