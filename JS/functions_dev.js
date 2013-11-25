

function air(){
	
}

air.trace = function(s){console.log(s)}

function DBConnector () {

}

d = DBConnector.prototype
Object.defineProperty(d, "woot",{
	get: function(){return "foo"},
	set: function(w){console.log("woot"+w) }
} )

DBConnector.prototype.open = function(){	air.trace("fake open");};
DBConnector.prototype.queryByIds = function( ids ){
	air.trace("fake query");
	
	$.each(obs_json,function(i,v){
			v.jsDate = new Date(v.date)
		});
	
	$.event.trigger({
				type: "FRED",
				json: sample_data[ids["g"]],
				time: new Date()
			});
};
