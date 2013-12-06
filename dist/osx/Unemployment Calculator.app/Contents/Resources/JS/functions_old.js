var result;
var statement;
alert("functions are fun");
var conn = new air.SQLConnection;
function resultHandler(r){
	result = statement.getResult();
	//air.trace(result.data[0]["series_id"]);
	statement.removeEventListener(air.SQLEvent.RESULT, resultHandler);
}

function openHandler(){
	//air.trace("open");
	statement = new air.SQLStatement;
	statement.sqlConnection = conn
	statement.text = "SELECT * FROM ser_id";
	statement.addEventListener(air.SQLEvent.RESULT, resultHandler);
	statement.execute();
}

function appLoad(){ 
		$(function() {
		    $( "#radio" ).buttonset();
		  });
   // air.trace("Hello World"); 
	
	var folder = air.File.applicationDirectory;
	var dbFile = folder.resolvePath("test.db");
	//air.trace(dbFile.nativePath);
	conn.addEventListener(air.SQLEvent.OPEN, openHandler, false);
	conn.openAsync(dbFile);
}  

function loadData(id){
//	air.trace("ID::"+id);
	get_series(id);
}

function get_series(g_id){
	var r;
	statement.text = "SELECT * FROM ser_id WHERE g_id LIKE "+g_id;
	//air.trace(statement.text);
	statement.addEventListener(air.SQLEvent.RESULT, g_idResultHandler, false);
	statement.execute();
}

function g_idResultHandler(r){
	result = statement.getResult();
	//air.trace(result.data);
	s_id = result.data[0]["series_id"];
	statement.removeEventListener(air.SQLEvent.RESULT, g_idResultHandler);
	statement.text = "SELECT * FROM ser_data WHERE ser_id LIKE '"+s_id+"'";
	//air.trace(statement.text);
	statement.addEventListener(air.SQLEvent.RESULT, s_idResultHandler, false);
	statement.execute();
}
function s_idResultHandler(r){
	result = statement.getResult();
	
	data=JSON.parse(result.data[0]["observations"]);			
	statement.removeEventListener(air.SQLEvent.RESULT, s_idResultHandler);
	var newData ="DATA:"
	$("#result").html("");
	$.each(data, function(i, item) { 
		$("#result").append("<p>"+data[i]["value"]+"</p>") 
		});
	
}