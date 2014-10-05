Template.createGame.helpers({
    sessionGameNamePrefix: function() { return Session.get('gameNamePrefix') || Meteor.user().profile.name; },
    sessionGameWidth:      function() { return Session.get('gameWidth') || 20; },
    sessionGameHeight:     function() { return Session.get('gameHeight') || 20; },
    sessionGameBombs:      function() { return Session.get('gameBombs') || 30; },
    sessionCreatingGame:   function() { return Session.get('creatingGame'); }
});

Template.createGame.events({
    'click button.create': function() {
        Session.set('creatingGame', 1 );
    },
    'click button.play': function() {
        var now = new Date();
        // TODO: figure out where to put utility functions like this.
        var yyyymmdd_hhmmss = function(dateIn) {
            var yyyy= dateIn.getFullYear();
            var mm  = dateIn.getMonth()+1; // getMonth() is zero-based
            var dd  = dateIn.getDate();
            var hh  = dateIn.getHours();
            var min = dateIn.getMinutes();
            var ss  = dateIn.getSeconds();
            return '' + (10000*yyyy + 100*mm + dd) + '_' + (10000*hh + 100*min + ss);
        };
        var prefix = $('input[name=gameNamePrefix]').val();
        var height = $('input[name=height]').val();
        var width  = $('input[name=width]').val();
        var bombs  = $('input[name=bombs]').val();
        var fullName = prefix + '_' + yyyymmdd_hhmmss(now);
        Session.set('gameNamePrefix', prefix );
        Session.set('gameWidth', width );
        Session.set('gameHeight', height );
        Session.set('gameBombs', bombs );
        Session.set('creatingGame', undefined );

        Games.insert( {created_at: now, name: fullName, width: width, height: height, bombs: bombs, user: Meteor.userId()},
          function(err,id) {
            if (err) {
                Session.set('currentGame', undefined );
                console.log(err);
                alert('oops, there was an error: ' + err);
            } else {
                Session.set('currentGame', id );
            }
        } );
    }
});
