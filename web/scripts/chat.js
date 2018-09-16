/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var messageListElement = $("#messages-card-container");

$("#submit").click(function(){
  saveMessage();
});

// Loads chat messages history and listens for upcoming ones.
function loadMessages() {
  console.log("Loading Messages");
  // Loads the last 12 messages and listen for new ones.
  var callback = function(snap) {
    var data = snap.val();
    console.log(snap.key);
    console.log(getConversationId());
    if (data.convoid==getConversationId()){
      displayMessage(snap.key, data.email, data.text);
    }
  };

  firebase.database().ref('/messages/').limitToLast(100).on('child_added', callback);
  firebase.database().ref('/messages/').limitToLast(100).on('child_changed', callback);
}

// Saves a new message on the Firebase DB.
function saveMessage() {
  console.log("Save message")
  // Add a new message entry to the Firebase database.

  //Add message to file
  var file = new File(messages_to_be_analyzed.txt);
  var str = $("#message").val();
  file.open("w"); // open file with write access
  file.writeln(str);
  file.close();

  return firebase.database().ref('/messages/').push({
    convoid: getConversationId(),
    email: firebase.auth().currentUser.email,
    text: $("#message").val(),
  }).catch(function(error) {
    console.error('Error writing new message to Firebase Database', error);
  });
}
function getConversationId(){
  var url_string = window.location.href;
  var url = new URL(url_string);
  return url.searchParams.get("id");
}

// Triggered when the send new message form is submitted.
function onMessageFormSubmit(e) {
  e.preventDefault();
  // Check that the user entered a message and is signed in.
  if (messageInputElement.value && checkSignedInWithMessage()) {
    saveMessage(messageInputElement.value).then(function() {
      // Clear message text field and re-enable the SEND button.
      resetMaterialTextfield(messageInputElement);
    });
  }
}

// Resets the given MaterialTextField.
function resetMaterialTextfield(element) {
  element.value = '';
  element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
}

// Template for messages.
var MESSAGE_TEMPLATE =
    '<div class="message-container">' +
      '<div class="spacing"></div>' +
      '<div class="message"></div>' +
    '</div>';


// Displays a Message in the UI.
function displayMessage(key, name, text) {
  var div = document.getElementById(key);
  // If an element for that message does not exists yet we create it.
  if (!div) {
    var container = document.createElement('div');
    container.innerHTML = MESSAGE_TEMPLATE;
    div = container.firstChild;
    div.setAttribute('id', key);
    messageListElement.appendChild(div);
  }
  var messageElement = div.querySelector('.message');
  if (text) { // If the message is text.
    messageElement.textContent = text;
    // Replace all line breaks by <br>.
    messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
    firebase.auth().onAuthStateChanged(function (user) {
      if (user && name == user.email) {
        console.log("My message");
        console.log(container);
        div.classList.add('my-message');
      }
      else{
        div.classList.add('their-message');
      }
  });

  }
  // Show the card fading-in and scroll to view the new message.
  setTimeout(function() {div.classList.add('visible')}, 1);
  messageListElement.scrollTop = messageListElement.scrollHeight;
  messageInputElement.focus();
}
// We load currently existing chat messages and listen to new ones.
loadMessages();
var messageListElement = document.getElementById('messages');
var messageFormElement = document.getElementById('message-form');
var messageInputElement = document.getElementById('message');
var submitButtonElement = document.getElementById('submit');
var imageButtonElement = document.getElementById('submitImage');
var imageFormElement = document.getElementById('image-form');
var mediaCaptureElement = document.getElementById('mediaCapture');
var userPicElement = document.getElementById('user-pic');
var userNameElement = document.getElementById('user-name');
var signInButtonElement = document.getElementById('sign-in');
var signOutButtonElement = document.getElementById('sign-out');
var signInSnackbarElement = document.getElementById('must-signin-snackbar');
