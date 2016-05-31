Messages = new Mongo.Collection("msgs");
// This code runs on both client (mini Mongo, Meteor's client-side cache; mini Mongo will keep a subset of the data that's on the server) and server (Production MongoDB database)

if (Meteor.isServer) {
  // This code only runs on the server
  // "Meteor.publish" gets data from the server to the client
  Meteor.publish("messages", function() {
    return Messages.find({}, {sort: {createdAt: -1}, limit: 5});
    // 5 most recent messages to be sent to client
  });
  }


  if (Meteor.isClient) {
    // This code only runs on the client
    // Subscribe to Meteor.publish (publication) to recieve messages; similar to a REST end point
    Meteor.subscribe("messages");
  }

// This code sends data (messages) from the client to the server
  Meteor.methods({
    sendMessage: function (message) {
      if(! Meteor.userId()) {
        throw new Meteor.Error("not-authorized");
        } // user authentication
        //prevents users from sending messages when not logged in

        Messages.insert({
          text: message,
          createdAt: new Date(),
          username: Meteor.user().username // user authentication
        });
      }
  });

  if (Meteor.isClient) {
    Template.body.helpers({ // publishes an array of messages, displayed in forward chronological order
      recentMessages: function () {
        return Messages.find({}, {sort: {createdAt: 1}});
      }
    });

  Template.body.events({
    "submit .new-message": function (event) {
      var text = event.target.text.value;

      Meteor.call('sendMessage', text);

      event.target.text.value = "";
      return false;
    }
  }); // replicates to multiple clients at the same time, clients connected to the server; when we save to the db, it reactively changes our interface, and then when the data gets up to the db, it will push down any changes to any connected clients

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

}


// code taken from "An Introduction to Meteor" video:
// https://www.youtube.com/watch?v=dOCMpoeuwTI




// import { Template } from 'meteor/templating';
// import { ReactiveVar } from 'meteor/reactive-var';

// import './main.html';

// Template.hello.onCreated(function helloOnCreated() {
//   // counter starts at 0
//   this.counter = new ReactiveVar(0);
// });

// Template.hello.helpers({
//   counter() {
//     return Template.instance().counter.get();
//   },
// });

// Template.hello.events({
//   'click button'(event, instance) {
//     // increment the counter when button is clicked
//     instance.counter.set(instance.counter.get() + 1);
//   },
// });
