// Set defaults.
var saved = require('sdk/simple-storage').storage;
if (!saved.lastRequest) {
    saved.lastRequest = 0;
}

// Create widget.
require("sdk/widget").Widget({
    id: 'happy-bonobo--cat-signal-firefox',
    label: 'Save the Internet, with Team Future!',
    contentURL: require('sdk/self').data.url('catface.png'),
    onClick: function() {
        saved.lastRequest = 0;
        makeRequest();
    }
});

// Show notification, if there's a new campaign.
function onResponse(res) {
    // Update saved timestamp.
    saved.lastRequest = Date.now();

    // Check for new campaigns.
    var campaigns = res.json.campaigns;
    if (!campaigns.length) {
        return;
    }

    // Select first campaign.
    var campaign = campaigns[0];

    // Get cat signal image.
    var image = require('sdk/self').data.url('catface.png');

    // Shorten description.
    var description = campaign.description.split('\n')[0];

    // Notify.
    var Notifications = require('sdk/notifications');
    Notifications.notify({
        title: campaign.name.toUpperCase(),
        text: 'Save the internet »',
        iconURL: image,
        onClick: function(data) {
            var Tabs = require('sdk/tabs');
            Tabs.open(campaign.url);
        }
    });
}

function makeRequest() {
    var url = 'http://mothership.fightforthefuture.org/campaigns/query?limit=1&since_timestamp=' + saved.lastRequest;
    var Request = require('sdk/request').Request;
    Request({
        url: url,
        onComplete: onResponse
    }).get();
}

makeRequest();
