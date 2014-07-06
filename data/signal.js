(function() { // :)


var Notification = {
    m: {
        campaign: self.options.campaign,
        image: self.options.image,
        imagePrefix: self.options.imagePrefix,
        port: self.port,
        template: self.options.html
    },
    v: {
        $el: $('<div>'),
        render: function(model) {
            this.$el.html(model.template);

            this.addDynamicValues(model);
            this.addListeners(model);
            this.animateSpotlight();

            // Append.
            $('body').append(this.$el);

            // Animate in.
            this.$el.children().animate({
                opacity: 1
            }, 300);
        },
        addDynamicValues: function(model) {
            this.$el.find('#team-future-signal').css('background-image', 'url(' + model.backgroundUrl + ')');
            this.$el.find('#image').attr('src', model.image);
            this.$el.find('#link').attr('href', model.campaign.url);
            this.$el.find('#link').text(model.campaign.url_title || 'Save the internet');
            this.$el.find('#title').text(model.campaign.name);
            this.$el.find('#description span').text(model.campaign.description);
        },
        addListeners: function(model) {
            var self = this;

            self.$el.find('#team-future-signal').on('click', function(e) {
                e.preventDefault();

                window.open(model.campaign.url);

                Notification.m.port.emit('clicked');

                self.destroy(300);
            });

            self.$el.find('#team-future-signal #x').on('click', function(e) {
                e.stopPropagation();

                Notification.m.port.emit('clicked');

                self.destroy(100);
            });
        },
        spotlightInterval: 0,
        animateSpotlight: function() {
            var self = this;

            function toggleSpotlight() {
                self.$el.find('#team-future-signal').toggleClass('tilted');
            }

            toggleSpotlight();

            self.spotlightInterval = setInterval(toggleSpotlight, 3210);
        },
        destroy: function(duration) {
            var self = this;

            self.$el.children().animate({
                opacity: 0
            }, duration || 0, function() {
                self.$el.remove();
            });

            clearInterval(self.spotlightInterval);
        }
    },
    c: {
        init: function() {
            if (this.reasonToBail()) {
                return;
            }

            // Background URL.
            Notification.m.backgroundUrl = Notification.m.imagePrefix + Notification.m.campaign.image;
            var img = new Image();
            img.src = Notification.m.backgroundUrl;
            img.onload = function() {
                Notification.v.render(Notification.m);
            };

            Notification.m.port.on('destroy', function() {
                Notification.v.destroy();
            });
        },
        reasonToBail: function() {
            // If the page already has a notification.
            if ($('#team-future-signal').length) {
                return true;
            }

            // If the page doesn't have a body tag.
            if (!$('body').length) {
                return true;
            }

            return false;
        }
    }
};

// Let's begin.
Notification.c.init();



}()); // :)
