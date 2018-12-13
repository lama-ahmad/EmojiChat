var FORM_INPUT_DISABLED_COLOR='#000000';
var FORM_INPUT_MSG_COLOR='#ffffff';
var FORM_INPUT_SEND_COLOR='#0000ff';
var MSG_MINE_COLOR='#54C7FC';
var MSG_PARTNER_COLOR='#5BC236';

var socket = io();

var timeout;
var partner_id, partner_username, my_id;
var audio = new Audio('static/sounds/notif.mp3');

//This is hard coded for now, trying to make it so that both users get the same random category ?? 
var curtopic = "Tell me about your favorite memory.";

$("#messages").scrollTop($("#messages")[0].scrollHeight);
$('#partnername').html(" ");
$('#partnerimg').attr("src"," ");
$('#m').css("pointer-events","none");
$('#m').css("background",FORM_INPUT_DISABLED_COLOR);
$('form button').css("pointer-events","none");
$('form button').css("background",FORM_INPUT_DISABLED_COLOR);

function timeoutFunction() {
    socket.emit('typing', false);
}

function isTyping(){
    socket.emit('typing',true);
    clearTimeout(timeout);
    timeout = setTimeout(timeoutFunction, 1000);        
}

socket.on('typing', function(data) {
    if (data) {
        $("#istyping").css("visibility","visible");     // call function to show typing
    } else {
        $("#istyping").css("visibility","hidden");     // call function to stop typing
    }
});

function submitForm(){
    var msg = $('#m').emojioneArea()[0].emojioneArea.getText().trim();
    if(msg!=''){
        socket.emit('chat message', {msg: msg, target: partner_id});
    }
    $('#m').val('');
    $('div.emojionearea-editor').text('');
    return false;
}

socket.on('init',function (data) {
    socket.username=data.username;
    my_id = data.my_id;
    $('#myname').html(socket.username);
});

socket.on('chat message mine',function(msg){
    var output_msg = emojione.shortnameToImage(msg);
    var newData = '<div class="me" style="display:none">'+output_msg+'</div>';
    $(newData).appendTo($('#messages')).slideDown(speed=200,callback = function(){
        $("#messages").scrollTop($("#messages")[0].scrollHeight);
    });
    $('#messages .me').css('background',MSG_MINE_COLOR);
});


socket.on('chat message partner', function (msg) {
    audio.play();
    var output_msg = emojione.shortnameToImage(msg);        
    var newData = '<div class="partner" style="display:none">'+output_msg+'</div>';
    $(newData).appendTo($('#messages')).slideDown(speed=200,callback = function(){
        $("#messages").scrollTop($("#messages")[0].scrollHeight);
    });
    $('#messages .partner').css('background',MSG_PARTNER_COLOR);

});

socket.on('disconnecting now', function (msg) {
    $('#messages').append('<div class="partner">'+msg+"</div>");
    $("#messages").scrollTop($("#messages")[0].scrollHeight);
    $('#partnername').html(" ");
    $('#partnerimg').attr("src"," ");
    $('#m').css("pointer-events","none");
    $('#m').css("background",FORM_INPUT_DISABLED_COLOR);
    $('form button').css("pointer-events","none");
    $('form button').css("background",FORM_INPUT_DISABLED_COLOR);
    $('#m').attr("placeholder","");
});

socket.on('partner', function (partner_data) {
    if(partner_id==null){
        
        //show who you are connected to when you are connected to someone
        $('#messages').append("<div>"+'Connected to '+partner_data.username+"</div>");
        $('#messages').append("<div> Discussion topic: "+ curtopic + " </div>");

        $('#partnername').html(partner_data.username);
        $('#m').css("pointer-events","auto");
        $('#m').css("background",FORM_INPUT_MSG_COLOR);
        $('form button').css("pointer-events","auto");
        $('form button').css("background",FORM_INPUT_SEND_COLOR);
        partner_id = partner_data.id;
        partner_username=partner_data.username;
        $('#m').attr("placeholder","Only use Emoji's Please!");
        $('div.emojionearea-editor').attr("placeholder","Only use Emoji's Please!");
        socket.emit('partner',{target:partner_id,
            data:{id:socket.id,
                username:socket.username}});
    }
});


function saveData(obj){
	$.ajax({
		url: '/save',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(obj),
		error: function(resp){
			console.log("Oh no...");
			console.log(resp);
		},
		success: function(resp){
			console.log('WooHoo!');
			console.log(resp);
		}
	});
}

$("#btnSave").click(function() { 
    html2canvas($("#messagediv").get(0)).then(function (canvas) {
        var base64encodedstring = canvas.toDataURL("image/jpeg", 1);

        var thisObj = {
            category: "memory",
            image: base64encodedstring,
        };

        //this is the line of code that puts the image on the screen
        //I need to make this go to the database instead
        // $('#img').attr('src', base64encodedstring);

        saveData(thisObj);
        });
});

function getAllData(){
	$.ajax({
		url: '/api/all',
		type: 'GET',
		dataType: 'json',
		error: function(data){
			console.log(data);
			alert("Oh No! Try a refresh?");
		},
		success: function(data){
			console.log("We have data");
			console.log(data);
			//Clean up the data on the client
			//You could do this on the server
			var theData = data.map(function(d){
				return d.doc;
			});
			var htmlString = makeHTML(theData);
			$('body').append(htmlString);
		}
	});
}

$(document).ready(function() {        
    $("#m").emojioneArea({
        saveEmojisAs: 'shortname',
        events: {
            keyup: function(editor, event) {
                if (event.which == 13) {
                    $('form').submit();
                } else {
                    isTyping();
                }
            }
        }
    });

});

