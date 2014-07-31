	//console.log("Functions Loaded")
	
	var when = require('when')
	var sqlite3 = require('sqlite3').verbose();
	var fs = require("fs");
	
	//var db = new sqlite3.Database('../unemployment.db');

	function DBConnector () {
		this.rows;
		var self = this;
	}
	
	dbp = DBConnector.prototype;


	dbp.db;
	
 
	
	dbp.open = function(){
		
		var dbpath = "unemployment.db";
		this.db = new sqlite3.Database(dbpath);
		console.log("this.db (open)= " + this.db);
		
	}
	
	
	dbp.queryByIds = function(ids){
		console.log("querying by id");
		
		return this.getData(ids);
	}
	
	dbp.getBaseline = function(ids){
		console.log("getting baseline");
		return this.getData( { "g" : 0, "ed" : 0, "ar" : 0  });
			
	}
	
	dbp.getData = function( ids ){
		var dfd = when.defer();
		console.log("this.db (getData)= " + this.db);
		var q = "SELECT * FROM ser_data WHERE ser_data.ser_id = (SELECT series_id FROM ser_id WHERE g_id LIKE "+ids.g+" AND ed_id  LIKE "+ids.ed+" AND ar_id LIKE "+ids.ar+")"
		this.rows = this.db.get(q, function (err, row) {
			var ret = {}
			if (err) {
				console.log("err: " + err);
			}
			
			if (row) {
				obs = JSON.parse(row.observations);
				
				$.each(obs,function(i,v){
								str = v.date;
								a = str.split("-");
								var _d = new Date(a[0],a[1],a[2]);
								v.jsDate = _d;
							});
							
				ser = JSON.parse(row.series);
				ret.observations = obs;
				ret.series = ser.seriess[0]
				dfd.resolve(ret);
			}
		});
		
		return dfd.promise;
	}
	
	Object.defineProperty(dbp, "baseline",{
		get: function(){
			
			data = this.getData( { "g" : 0, "ed" : 0, "ar" : 0  }).then(function (d){console.log("dfd-"); console.log(d)});
			//ret = data.obs;
			//return ret },
			},
		set: function(ds){
			this.data = ds;
			//console.log("DATASET RECEIVED");
			this.update();
			}});
	

	

