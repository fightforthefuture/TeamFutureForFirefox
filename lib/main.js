// Shortcuts.
var data = require('sdk/self').data;
var tabs = require('sdk/tabs');

// Saved data.
var saved = require('sdk/simple-storage').storage;
if (!saved.lastClicked) {
    saved.lastClicked = 0;
}

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
            campaign: campaign,
            html: data.load('signal.html'),
            image: data.url('catface-white.png')
        }
    });

    // Update click.
    worker.port.on('clicked', function() {
        saved.lastClicked = campaign.id;

        workers.forEach(function(w) {
            if (w && w !== worker) {
                w.port.emit('destroy');
            }
        });

        workers = [];
    });

    workers.push(worker);
}

tabs.on('ready', showNotification);

// Create widget.
var widget = require("sdk/widget").Widget({
    id: 'happy-bonobo--cat-signal-firefox',
    label: 'Save the Internet, with Team Future!',
    contentURL: require('sdk/self').data.url('catface.png'),
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

// Begin!
makeRequest();
