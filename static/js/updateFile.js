const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
};


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyADJUChmUPrfZT6wwYtSdrc8ANWhbIZoQU",
    authDomain: "xlent-academy.firebaseapp.com",
    databaseURL: "https://xlent-academy-default-rtdb.firebaseio.com",
    projectId: "xlent-academy",
    storageBucket: "xlent-academy.appspot.com",
    messagingSenderId: "851179064801",
    appId: "1:851179064801:web:85582aa07b2ed89ce5d6a0",
    measurementId: "G-T5T13PRT76"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();
var storage = firebase.storage();

function updateFile() {
    if (document.getElementById("floatingTextarea2").textContent === "" && document.getElementById("floatingTextarea2").value === "") {
        alert("Need File");
    }
    else {
        var std = document.getElementById("std");
        var sub = document.getElementById("sub");
        var key = document.getElementById("key");

        let subject = document.getElementById("subject").value;
        let standard = document.getElementById("standard").value;
        var databaseRef = database.ref("myDocs/" + standard + "/" + subject + "/" + key.value + "/" + "").remove();

        var updates = {
            name: document.getElementById("floatingTextarea2").value,
            url: document.getElementById("fileurl").value
        }
        var databaseRef = database.ref("myDocs/" + std.value + "/" + sub.value + "/" + key.value + "/" + "");
        // console.log(databaseRef.key);
        databaseRef.update(updates);

        alert("Updated!");
    }
}

function deleteFile() {
    let subject = document.getElementById("subject").value;
    let standard = document.getElementById("standard").value;
    // console.log(subject + ":" + standard)
    document.getElementById("deleting").style.display = "flex";
    var databaseRef = database.ref("myDocs/" + standard + "/" + subject + "/" + key.value + "/" + "");
    var fileRef = storage.refFromURL(document.getElementById("fileurl").value);
    // Delete the file using the delete() method
    databaseRef.remove();
    fileRef.delete().then(function () {

        // File deleted successfully
        // console.log("File Deleted")
        document.getElementById("deleting").style.display = "none";
        alert("File deleted!");
        document.getElementById("deleted").submit();
    });
}