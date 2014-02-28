(function() { // :)



// Shortcuts.
var campaign = self.options.campaign;

// Ignore pages that have the Cat Signal.
var $notification = $('#team-future-signal');
if ($notification.length) {
    return;
}

// Ignore pages without a body.
if (!$('body').length) {
    return;
}

// Create element.
var $notification = $('<div>');
$notification.html(self.options.html);
$('body').append($notification);

// Templating.
$('#team-future-signal').css('background-image', 'url('+self.options.background+')');
$('#image').attr('src', self.options.image);
$('#link').attr('href', campaign.url);
$('#link').text(campaign.url_title || 'Save the internet');
$('#title').text(campaign.name);
$('#description span').text(campaign.description);

// Animate in.
$notification.children().animate({
    opacity: 1
}, 100);

// Animate spotlight.
var spotlightAnimation = setInterval(animateSpotlight, 3210);
function animateSpotlight() {
    $('#team-future-signal').toggleClass('tilted');
}
animateSpotlight();


// Event listeners.
$('#team-future-signal').on('click', function(e) {
    window.open(campaign.url);
    
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
        opacity: 0
    }, duration || 0, function() {
        $notification.remove();
    });

    clearInterval(spotlightAnimation);
}



}()); // :)
