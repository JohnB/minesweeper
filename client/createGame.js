Template.createGame.helpers({
    sessionGameNamePrefix: function() { return Session.get('gameNamePrefix'); },
    sessionCreatingGame:   function() { return Session.get('creatingGame'); }
});

Template.createGame.events({
    'click button.create': function() {
        Session.set('creatingGame', 1 );
        alert('oh crap it worked');
    },
    'click button.play': function() {
        var prefix = $('button [name=gameNamePrefix]').val();
        var fullName = prefix + '_' + Date.now();
        Session.set('gameNamePrefix', prefix );
        Session.set('creatingGame', undefined );
        Session.set('currentGame', fullName );

        alert('TODO: Games.insert("'+fullName+'")');
    }
});
