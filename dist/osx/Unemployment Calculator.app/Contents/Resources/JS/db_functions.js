	console.log("Functions Loaded")

	function DBConnector () {

	}
	dbp = DBConnector.prototype;

	dbp.dbname = "test.db";
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
		
		$.event.trigger({
					type: "FRED",
					observations: obs,
				});
	}
	
	dbp.getData = function( ids ){
		var q = "SELECT * FROM ser_data WHERE ser_data.ser_id = (SELECT series_id FROM ser_id WHERE g_id LIKE "+ids.g+" AND ed_id  LIKE "+ids.ed+" AND ar_id LIKE "+ids.ar+")"
		rows = this.db.execute(q);
		var obs = JSON.parse(rows.fieldByName("observations"));
		$.each(obs,function(i,v){
				if (v.value == "."){
					console.log("found null data")
					obs.splice(i,1);
				}else{ 
					str = v.date;
					a = str.split("-");
					var _d = new Date(a[0],a[1],a[2]);
					v.jsDate = _d;
				}
			});
		return obs;
	}
	
	Object.defineProperty(dbp, "baseline",{
		get: function(){return this.getData( { "g" : 0, "ed" : 0, "ar" : 0  }) },
		set: function(ds){
			this.data = ds;
			console.log("DATASET RECEIVED");
			this.update();
			}});
	
	

	

