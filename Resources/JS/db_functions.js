	console.log("Functions Loaded")

	function DBConnector () {
		this.rows;
	}
	dbp = DBConnector.prototype;

	dbp.dbname = "unemployment.db";
	dbp.db;
 
	
	dbp.open = function(){
		this.openHandler = function(e){
			console.log("openHandler");
		}
		this.folder = Ti.Filesystem.getResourcesDirectory();
		this.dbFile = this.folder.resolve(this.dbname);
		this.db = Ti.Database.openFile(this.dbFile);
	}
	
	
	dbp.queryByIds = function(ids){
	/*	var q = "SELECT * FROM ser_data WHERE ser_data.ser_id = (SELECT series_id FROM ser_id WHERE g_id LIKE "+ids.g+" AND ed_id  LIKE "+ids.ed+" AND ar_id LIKE "+ids.ar+")"
		rows = this.db.execute(q);
		var obs = JSON.parse(rows.fieldByName("observations"));*/

		obs = this.getData (ids);
		if(obs){
			$.event.trigger({
						type: "FRED",
						observations: obs,
					});
		}else{
			$.event.trigger({
						type: "ERROR",
						text: "no record found in database",
					});
		}
		
	}
	
	dbp.getData = function( ids ){
		var q = "SELECT * FROM ser_data WHERE ser_data.ser_id = (SELECT series_id FROM ser_id WHERE g_id LIKE "+ids.g+" AND ed_id  LIKE "+ids.ed+" AND ar_id LIKE "+ids.ar+")"
		this.rows = this.db.execute(q);
		if(this.rows.rowCount() > 0){
			var obs = JSON.parse(this.rows.fieldByName("observations"));
			console.log("ROWS :"+this.rows)
			$.each(obs,function(i,v){
						console.log("adding dates")
						str = v.date;
						a = str.split("-");
						var _d = new Date(a[0],a[1],a[2]);
						v.jsDate = _d;
				});
				return obs;
		}else{
			return false;
		}
		
	}
	
	Object.defineProperty(dbp, "baseline",{
		get: function(){return this.getData( { "g" : 0, "ed" : 0, "ar" : 0  }) },
		set: function(ds){
			this.data = ds;
			console.log("DATASET RECEIVED");
			this.update();
			}});
	
	

	

