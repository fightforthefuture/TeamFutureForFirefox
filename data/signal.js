// Remove existing notification.
var $notification = $('#team-future-signal');
if ($notification) {
    $notification.parent().remove();
}

// Update template values.
var html = self.options.html;
html = html.replace('$image', self.options.image);
html = html.replace('$title', self.options.campaign.name);

// Create notification.
var $notification = $('<div>');
$notification.html(html);
$('body').append($notification);

// Animate.
$notification.children().animate({
    top: '0px'
});

// Event listeners.
$('#team-future-signal').on('click', function(e) {
    window.open(self.options.campaign.url);
    
    destroy(300);
    
    self.port.emit('clicked');
});

$('#team-future-signal #x').on('click', function(e) {
    destroy(100);

    self.port.emit('clicked');

    e.stopPropagation();
});

self.port.on('destroy', destroy);

function destroy(duration) {
    $notification.children().animate({
        top: '-32px'
    }, duration || 0, function() {
        $notification.remove();
    });
}
