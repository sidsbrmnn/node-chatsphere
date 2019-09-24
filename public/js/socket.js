$(function() {
  var socket = io();
  $('form').submit(function() {
    socket.emit('chat message', $('#message').val());
    $('#message').val('');
    return false;
  });
  socket.on('chat message', function(message) {
    $('#messages').append($('<li>').text(message));
    window.scrollTo(0, document.body.scrollHeight);
  });
});
