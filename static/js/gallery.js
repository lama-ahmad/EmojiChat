function getCategory(term){
	$.ajax({
		url: '/api/category/' + term,
		type: 'GET',
		dataType: 'json',
		error: function(data){
			console.log(data);
			alert("Oh No! Try a refresh?");
		},
		success: function(data){
			console.log("WooHoo!");
			console.log(data);

			var theData = data.map(function(d){
				return d.doc;
            });
			
			$("#img").css("display", 'block');
            $('#img').attr('src', theData[Math.floor(Math.random() * theData.length)].image);

		}
	});
}

$(document).ready(function() {  
	getCategory('memory');
	
});

