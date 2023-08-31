const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
};

document.querySelectorAll(".content--input").forEach(input => {
    const elinput = input.closest(".content");

    elinput.addEventListener("click", e => {
        input.click();
    });

    input.addEventListener("change", e => {
        if (input.files.length) {
            updateFile(elinput, input.files[0]);
        }
    });

    elinput.addEventListener("dragover", e => {
        e.preventDefault();
        elinput.classList.add("content--over");
    });

    ["dragleave", "dragend"].forEach(type => {
        elinput.addEventListener(type, e => {
            elinput.classList.remove("content--over");
        });
    });

    elinput.addEventListener("drop", e => {
        e.preventDefault();
        elinput.classList.remove("content--over");
        // console.log(e.dataTransfer.files);

        if (e.dataTransfer.files.length) {
            elinput.files = e.dataTransfer.files;
            updateFile(elinput, e.dataTransfer.files[0]);
        }
    });
});

function removeFile() {
    var embed = document.getElementById("pdf");
    embed.remove();
    var text = document.getElementById("floatingTextarea2");
    text.value = "";
    text.innerText = "";
    document.getElementById("file").value = '';
    // document.getElementsByClassName("rem")[0].style.display = 'none';
    document.getElementsByClassName("content--text")[0].style.display = 'block';
    document.getElementById("delete").style.visibility = "hidden";
}

function updateFile(elinput, file) {
    // if (elinput.querySelector(".content--text")) {
    //     elinput.querySelector(".content--text").remove();
    // }
    // document.getElementsByClassName("rem")[0].style.display = 'block';
    document.getElementById("delete").style.visibility = "visible";
    document.getElementsByClassName("content--text")[0].style.display = 'none';
    var content = document.getElementsByClassName("content");
    var src = URL.createObjectURL(file);
    content[0].insertAdjacentHTML('beforeend',
        '<embed id="pdf" src="' + src + '" type="application/pdf" frameBorder="0" scrolling="auto" height="100%" width="100%"></embed>'
    );

    var text = document.getElementById("floatingTextarea2");
    // text.innerText = file.name.replace(".pdf", "");
    text.value = file.name.replace(".pdf", "");
}


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


function upload() {
    if (document.getElementById("floatingTextarea2").textContent === "" && document.getElementById("floatingTextarea2").value === "" && document.getElementById("file").value === "") {
        alert("Need File");
    }
    else {
        var std = document.getElementById("std");
        var sub = document.getElementById("sub");
        var storageRef = storage.ref("uploadFiles/" + std.value + "/" + sub.value + "/" + "");
        var filename = "File_" + new Date().getTime() + ".pdf";
        var fileRef = storageRef.child(filename);

        var getName = document.getElementById("floatingTextarea2");
        var name = getName.value;

        var file = document.getElementById("file").files[0];
        // Displaying uploading...
        document.getElementById("uploading").style.display = "flex";


        fileRef.put(file).then(res => {
            // Uploading to firebase realtime database
            // var urlFile;
            // console.log("good");
            res.ref.getDownloadURL().then(function (downloadURL) {
                var urlFile = downloadURL;
                // console.log(downloadURL);
                var databaseRef = database.ref("myDocs/" + std.value + "/" + sub.value + "/" + "");
                // console.log(databaseRef.push().key);
                // console.log(name);
                databaseRef.child(databaseRef.push().key).set({
                    name: name,
                    url: urlFile
                });
            });
            document.getElementById("uploading").style.display = "none";
            // console.log(res);
            // https://stackoverflow.com/questions/45158238/javascript-alert-when-function-process-is-complete
            // alert("File Uploaded Successfully");
            removeFile();
        }).catch(e => {
            console.log(e);
        });

        // var percent = document.getElementById("percent");
        // fileRef.put(file).on('state_changed', (snapshot) => {
        //     var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //     percent.innerText = progress;
        //     console.log(progress);
        // }, function () {
        //     // get the uploaded image url back
        //     fileRef.snapshot.ref.getDownloadURL().then(
        //         function (downloadURL) {

        //             // You get your url from here
        //             console.log('File available at', downloadURL);
        //         });
        //     document.getElementById("uploading").style.display = "none";
        // });

        // fileRef.put(file).on('state_changed', (snapshot) => {
        //     var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //     percent.innerText = progress.toFixed(2);
        //     // console.log(progress);
        // }, (error) => {
        //     // Handle unsuccessful uploads
        //     console.log(error);
        // }, () => {
        //     // Handle successful uploads on complete
        //     // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        //     fileRef.snapshot.ref.getDownloadURL().then((downloadURL) => {
        //         console.log(downloadURL);
        //     });
        //     document.getElementById("uploading").style.display = "none";
        // });
    }
}