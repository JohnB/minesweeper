Meteor.publish("games", function () {
    return Games.find({});
});

Meteor.publish("myGames", function () {
    return Games.find({user: this.userId});
});

Meteor.methods({
    addGame: function (hash) {
        var iidd = Games.insert(hash, function(err,id) {
            if (err) {
                Session.set('currentGame', undefined );
                console.log('server oops: ' + err);
            } else {  // success
                console.log('server added: ' + id);
                return []; //Games.find({id: id});
            }
        });
    }
});
