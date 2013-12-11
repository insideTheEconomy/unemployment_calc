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

		obD = this.getData (ids);
		if(obD){
			$.event.trigger({
						type: "FRED",
						observations: obD.obs,
						series: obD.ser
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
		if(this.rows.rowCount() > 0){;
			ret = {}
			ret.obs = JSON.parse(this.rows.fieldByName("observations"));
			ret.ser = JSON.parse(this.rows.fieldByName("series"));
			console.log("ROWS :"+this.rows)
			$.each(ret.obs,function(i,v){
						console.log("adding dates")
						str = v.date;
						a = str.split("-");
						var _d = new Date(a[0],a[1],a[2]);
						v.jsDate = _d;
				});
				return ret;
		}else{
			return false;
		}
		
	}
	
	Object.defineProperty(dbp, "baseline",{
		get: function(){
			data = this.getData( { "g" : 0, "ed" : 0, "ar" : 0  });
			ret = data.obs;
			return ret },
		set: function(ds){
			this.data = ds;
			console.log("DATASET RECEIVED");
			this.update();
			}});
	
	

	

