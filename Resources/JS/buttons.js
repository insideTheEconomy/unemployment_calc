var unButtons = function(){
	this.radioChecked = false;
	this.$tRadio = null;
	this.$tDiv = null;
	this.EV = {"event":"undefined"};
	
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
	
	self = this;
	
	var isChecked = function(e){
		//console.log(e);
		self.EV = e;
		//console.log("checking button state")
		self.$lab = $(e.currentTarget);
		var lab_sel = self.$lab.attr("for");
		//console.log(" button is "+lab_sel);
		self.$tRadio = $("[id="+lab_sel+"]");
		self.$tDiv = self.$tRadio.parent();
		self.radioChecked = $("[id="+lab_sel+"]").prop('checked');
		console.log(" button state : checked is "+self.radioChecked);
	}
	
	var buildObj = function(e){
		var b = $(e.target).is("input");
		if (b){
			console.log("target is input");
			var val;
			var cat = $(e.target).parent().attr("category");
			if (self.radioChecked) {
		        self.$tRadio.prop('checked', false);
				self.$tDiv.buttonset("refresh");
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
		var dataLabel = "";
		var _labels = {};
		self.$btns.find("input:checked").each(function(){
			_labels[$(this).parent().attr("category")] = $(this).attr("labelname");
			dataLabel += $(this).attr("labelname");
			dataLabel += "<br>";
		})
		$.event.trigger({
					type: "LABEL",
					text: dataLabel,
					labels: _labels
				});
	}
	
	$("label").bind({
		"mousedown" : isChecked,
	
	});
	
	$("#buttonsets").bind({"click":buildObj});
}






	
	



