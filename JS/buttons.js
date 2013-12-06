var unButtons = function(){
	this.radioChecked = false;
	this.$tRadio;
	this.$tDiv;
	
}

qbP = unButtons.prototype;

qbP.build = function ( sel ){
	this.$btns = $( sel );
	this.$forms = this.$btns.find("form");
	this.$forms.find("div").each(function(){
		$(this).buttonset();
	})
	this.bind();
	
}

qbP.bind = function ( sel ){
	var ids = {g:0,ed:0,ar:0}
	
	
	var isChecked = function(e){
		$lab = $(e.target);
		var lab_sel = $lab.attr("for");
		$tRadio = $("[id="+lab_sel+"]");
		$tDiv = $tRadio.parent();
		radioChecked = $("[id="+lab_sel+"]").prop('checked');
	}
	
	var buildObj = function(e){
		var b = $(e.target).is("input");
		if (b){
			var val;
			var cat = $(e.target).parent().attr("category");
			if (radioChecked) {
		        $tRadio.prop('checked', false);
				$tDiv.buttonset("refresh");
				val =  0;
		    }else{
				val =  $(e.target).attr("_id");
			}
			ids[cat] = val;
			$.event.trigger({
						type: "BUTTON",
						ids: ids
					});
		}		
	}
	
	$("label").bind({
		"mousedown" : isChecked,
	
	});
	
	$("#buttonsets").bind({"click":buildObj});
}






	
	



