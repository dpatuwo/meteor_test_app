var require = meteorInstall({"client":{"template.main.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// client/template.main.js                                                                            //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
                                                                                                      // 1
Template.body.addContent((function() {                                                                // 2
  var view = this;                                                                                    // 3
  return HTML.DIV({                                                                                   // 4
    "class": "container"                                                                              // 5
  }, "\n  ", HTML.HEADER("\n  ", HTML.Raw("<h1>Basic Chat Application</h1>"), "\n  ", Spacebars.include(view.lookupTemplate("loginButtons")), "\n  ", HTML.Raw("<!-- template loginButtons -->"), "\n  "), "\n\n  ", HTML.UL("\n  ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("recentMessages"));                                             // 7
  }, function() {                                                                                     // 8
    return [ "\n  ", HTML.Comment(" handle bar syntax "), "\n  ", HTML.LI("\n  ", HTML.DIV({          // 9
      "class": "username"                                                                             // 10
    }, Blaze.View("lookup:username", function() {                                                     // 11
      return Spacebars.mustache(view.lookup("username"));                                             // 12
    })), "\n  ", HTML.DIV({                                                                           // 13
      "class": "message"                                                                              // 14
    }, Blaze.View("lookup:message", function() {                                                      // 15
      return Spacebars.mustache(view.lookup("message"));                                              // 16
    })), "\n  "), "\n  " ];                                                                           // 17
  }), "\n  "), "\n  ", HTML.FOOTER("\n  ", Blaze.If(function() {                                      // 18
    return Spacebars.call(view.lookup("currentUser"));                                                // 19
  }, function() {                                                                                     // 20
    return [ "\n  ", HTML.Comment(" helper from accounts package; renders form only if user is logged in, otherwise hides form "), "\n\n  ", HTML.FORM({
      "class": "new message"                                                                          // 22
    }, "\n  ", HTML.INPUT({                                                                           // 23
      type: "text",                                                                                   // 24
      name: "text",                                                                                   // 25
      placeholder: "Add a message"                                                                    // 26
    }), "\n  "), "\n\n  " ];                                                                          // 27
  }), "\n  "), "\n\n  ");                                                                             // 28
}));                                                                                                  // 29
Meteor.startup(Template.body.renderToDocument);                                                       // 30
                                                                                                      // 31
////////////////////////////////////////////////////////////////////////////////////////////////////////

},"main.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                    //
// client/main.js                                                                                     //
//                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                      //
Messages = new Mongo.Collection("msgs");                                                              // 1
// This code runs on both client (mini Mongo, Meteor's client-side cache; mini Mongo will keep a subset of the data that's on the server) and server (Production MongoDB database)
                                                                                                      //
if (Meteor.isServer) {                                                                                // 4
  // This code only runs on the server                                                                //
  // "Meteor.publish" gets data from the server to the client                                         //
  Meteor.publish("messages", function () {                                                            // 7
    return Messages.find({}, { sort: { createdAt: -1 }, limit: 5 });                                  // 8
    // 5 most recent messages to be sent to client                                                    //
  });                                                                                                 // 7
}                                                                                                     //
                                                                                                      //
if (Meteor.isClient) {                                                                                // 14
  // This code only runs on the client                                                                //
  // Subscribe to Meteor.publish (publication) to recieve messages; similar to a REST end point       //
  Meteor.subscribe("messages");                                                                       // 17
}                                                                                                     //
                                                                                                      //
// This code sends data (messages) from the client to the server                                      //
Meteor.methods({                                                                                      // 21
  sendMessage: function () {                                                                          // 22
    function sendMessage(message) {                                                                   // 22
      if (!Meteor.userId()) {                                                                         // 23
        throw new Meteor.Error("not-authorized");                                                     // 24
      } // user authentication                                                                        //
      //prevents users from sending messages when not logged in                                       //
                                                                                                      //
      Messages.insert({                                                                               // 22
        text: message,                                                                                // 29
        createdAt: new Date(),                                                                        // 30
        username: Meteor.user().username // user authentication                                       // 31
      });                                                                                             // 28
    }                                                                                                 //
                                                                                                      //
    return sendMessage;                                                                               //
  }()                                                                                                 //
});                                                                                                   //
                                                                                                      //
if (Meteor.isClient) {                                                                                // 36
  Template.body.helpers({ // publishes an array of messages, displayed in forward chronological order
    recentMessages: function () {                                                                     // 38
      function recentMessages() {                                                                     // 38
        return Messages.find({}, { sort: { createdAt: 1 } });                                         // 39
      }                                                                                               //
                                                                                                      //
      return recentMessages;                                                                          //
    }()                                                                                               //
  });                                                                                                 //
                                                                                                      //
  Template.body.events({ // event handler                                                             // 43
    "submit .new-message": function () {                                                              // 44
      function submitNewMessage(event) {                                                              // 44
        var text = event.target.text.value;                                                           // 45
                                                                                                      //
        Meteor.call('sendMessage', text);                                                             // 47
                                                                                                      //
        event.target.text.value = "";                                                                 // 49
        return false;                                                                                 // 50
      }                                                                                               //
                                                                                                      //
      return submitNewMessage;                                                                        //
    }()                                                                                               //
  }); // replicates to multiple clients at the same time, clients connected to the server; when we save to the db, it reactively changes our interface, and then when the data gets up to the db, it will push down any changes to any connected clients
                                                                                                      //
  Accounts.ui.config({                                                                                // 36
    passwordSignupFields: "USERNAME_ONLY"                                                             // 55
  });                                                                                                 //
}                                                                                                     //
                                                                                                      //
// code taken from "An Introduction to Meteor" video:                                                 //
// https://www.youtube.com/watch?v=dOCMpoeuwTI                                                        //
                                                                                                      //
// import { Template } from 'meteor/templating';                                                      //
// import { ReactiveVar } from 'meteor/reactive-var';                                                 //
                                                                                                      //
// import './main.html';                                                                              //
                                                                                                      //
// Template.hello.onCreated(function helloOnCreated() {                                               //
//   // counter starts at 0                                                                           //
//   this.counter = new ReactiveVar(0);                                                               //
// });                                                                                                //
                                                                                                      //
// Template.hello.helpers({                                                                           //
//   counter() {                                                                                      //
//     return Template.instance().counter.get();                                                      //
//   },                                                                                               //
// });                                                                                                //
                                                                                                      //
// Template.hello.events({                                                                            //
//   'click button'(event, instance) {                                                                //
//     // increment the counter when button is clicked                                                //
//     instance.counter.set(instance.counter.get() + 1);                                              //
//   },                                                                                               //
// });                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},{"extensions":[".js",".json",".html",".css"]});
require("./client/template.main.js");
require("./client/main.js");