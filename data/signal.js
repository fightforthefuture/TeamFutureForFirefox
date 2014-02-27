// Remove existing notification.
var $notification = $('#team-future-signal');
if ($notification) {
    $notification.parent().remove();
}

// Update template values.
var html = self.options.html;
html = html.replace('$background', self.options.background);
html = html.replace('$image', self.options.image);
html = html.replace('$link', self.options.campaign.url);
html = html.replace('$title', self.options.campaign.name);

// Create notification.
var $notification = $('<div>');
$notification.html(html);
$('body').append($notification);

// Animate in.
$notification.children().animate({
    top: '0px'
});

// Animate spotlight.
if (window.spotlightAnimation) {
    clearInterval(spotlightAnimation);
}
var spotlightAnimation = setInterval(animateSpotlight, 3210);
function animateSpotlight() {
    $('#team-future-signal').toggleClass('tilted');
}
animateSpotlight();


// Event listeners.
$('#team-future-signal').on('click', function(e) {
    window.open(self.options.campaign.url);
    
    destroy(300);
    
    self.port.emit('clicked');

    e.preventDefault();
});

$('#team-future-signal #x').on('click', function(e) {
    destroy(100);

    self.port.emit('clicked');

    e.stopPropagation();
});

self.port.on('destroy', destroy);

function destroy(duration) {
    $notification.children().animate({
        top: '-200px'
    }, duration || 0, function() {
        $notification.remove();
    });

    clearInterval(spotlightAnimation);
}
