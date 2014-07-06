// Shortcuts.
var data = require('sdk/self').data;
var tabs = require('sdk/tabs');

// Saved data.
var saved = require('sdk/simple-storage').storage;
if (!saved.lastClicked) {
    saved.lastClicked = 0;
}

// Image prefix.
var imagePrefix = '';

// Current campaign.
var campaign = false;

// Workers (tab interfaces).
var worker = false;
var workers = [];

function showNotification(e) {
    // Has the campaign loaded?
    if (!campaign) {
        return;
    }

    // Is this campaign stale?
    if (campaign.id === saved.lastClicked) {
        return;
    }

    // Show!
    worker = tabs.activeTab.attach({
        contentScriptFile: [
            data.url('zepto.js'),
            data.url('zepto.fx.js'),
            data.url('signal.js')
        ],
        contentScriptOptions: {
            background: data.url('stars-smaller.png'),
            campaign: campaign,
            imagePrefix: imagePrefix,
            html: data.load('signal.html'),
            image: data.url('cat-signal-with-tail.png')
        }
    });

    // Update icon.
    widget.contentURL = data.url('catface.png');

    // Click event callback.
    worker.port.on('clicked', function() {
        saved.lastClicked = campaign.id;

        clearWorkers();

        workers = [];

        widget.contentURL = data.url('catface-white.png');
    });

    workers.push(worker);
}

function clearWorkers() {
    workers.forEach(function(w) {
        if (w && w !== worker) {
            w.port.emit('destroy');
        }
    });
}

tabs.on('activate', showNotification);
tabs.on('ready', showNotification);

// Create widget.
var widget = require("sdk/widget").Widget({
    contentURL: data.url('catface-white.png'),
    id: 'happy-bonobo--cat-signal-firefox',
    label: 'Save the Internet, with Team Future!',
    onClick: function() {
        saved.lastClicked = 0;
        makeRequest();
    }
});

// Show notification, if there's a new campaign.
function onResponse(res) {
    // Check for new campaigns.
    var campaigns = res.json.campaigns;
    if (!campaigns.length) {
        return;
    }

    // Update image prefix.
    imagePrefix = res.json.image_url_prefix;
    imagePrefix = imagePrefix.replace(/^http:/, 'https:');

    // Select first campaign.
    campaign = campaigns[0];

    // Notify.
    showNotification();
}

// Call the Mothership API.
function makeRequest() {
    var url = 'https://mothership.fightforthefuture.org/campaigns/query?limit=1&since_timestamp=0';
    var Request = require('sdk/request').Request;
    Request({
        url: url,
        onComplete: onResponse
    }).get();
}

// Make requests every 15m.
var timer = require('sdk/timers');
timer.setInterval(makeRequest, 15 * 60 * 1000);

// Begin in 5s.
timer.setTimeout(makeRequest, 5 * 1000);
