Messages = new Mongo.Collection("msgs");

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish("messages", function() {
    return Messages.find({}, {sort: {createdAt: -1}, limit: 5});
  });
  }


  if (Meteor.isClient) {
    // This code only runs on the client
    Meteor.subscribe("messages");
  }

  Meteor.methods({
    sendMessage: function (message) {
      if(! Meteor.userId()) {
        throw new Meteor.Error("not-authorized");
        }

        Messages.insert({
          text: message,
          createdAt: new Date(),
          username: Meteor.user().username
        });
      }
  });

  if (Meteor.isClient) {
    Template.body.helpers({
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
  });

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
