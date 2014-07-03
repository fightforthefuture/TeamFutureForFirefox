(function() { // :)



// Shortcuts.
var campaign = self.options.campaign;
var port = self.port;
var spotlightAnimation = null;

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

// Animate in, when ready.
function animateIn() {
    $notification.find('#team-future-signal').css('background-image', 'url(' + backgroundUrl + ')');
    $notification.find('#image').attr('src', self.options.image);
    $notification.find('#link').attr('href', campaign.url);
    $notification.find('#link').text(campaign.url_title || 'Save the internet');
    $notification.find('#title').text(campaign.name);
    $notification.find('#description span').text(campaign.description);


    // Animate spotlight.
    spotlightAnimation = setInterval(animateSpotlight, 3210);
    function animateSpotlight() {
        $notification.find('#team-future-signal').toggleClass('tilted');
    }
    animateSpotlight();


    // Event listeners.
    $notification.find('#team-future-signal').on('click', function(e) {
        e.preventDefault();

        window.open(campaign.url);

        port.emit('clicked');

        destroy(300);
    });

    $notification.find('#team-future-signal #x').on('click', function(e) {
        e.stopPropagation();

        port.emit('clicked');

        destroy(100);
    });

    $('body').append($notification);

    // Animate in.
    $notification.children().animate({
        opacity: 1
    }, 300);
}

// Background URL.
var backgroundUrl = self.options.imagePrefix + campaign.image;
var img = new Image();
img.src = backgroundUrl;
img.onload = animateIn;

port.on('destroy', destroy);

function destroy(duration) {
    $notification.children().animate({
        opacity: 0
    }, duration || 0, function() {
        $notification.remove();
    });

    clearInterval(spotlightAnimation);
}



}()); // :)
