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

// console.log("starting!")

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

var database = firebase.database();

function read() {

    var data_ref = database.ref("myDocs/" + "");
    data_ref.on('value', (snapshot) => {
        // var data = snapshot.val()
        // console.log(data)
        // var div = document.getElementsByClassName("dropend")
        $('.dropend').empty();
        snapshot.forEach((child) => {
            var std = child.key;
            // console.log(std);

            var div = document.getElementsByClassName("dropend");

            // var button = document.createElement("<button type='button' class='btn item-cus dropend-toggle' id='dropdownMenuButton' data-bs-toggle='dropdown'>STD:</button>")
            // var button = document.createElement("button");
            // button.innerHTML = "STD: " + child.key
            // div[0].appendChild(button)
            div[0].insertAdjacentHTML('beforeend',
                "<button type='button' class='btn item-cus dropend-toggle' id='dropdownMenuButton' data-bs-toggle='dropdown'>STD: " + std + "<sup>th</sup></button>"
            );

            div[0].insertAdjacentHTML('beforeend',
                "<ul class='dropdown-menu' aria-labelledby='dropdownMenuButton' id='menu-" + std + "'></ul>"
            );
            var menu = document.getElementById("menu-" + std);
            menu.insertAdjacentHTML('beforeend',
                "<li style='margin-right: 5px !important; font-weight: 100 !important;'>STD: " + std + "<sup>th</sup> </li>"
            );

            // Subject
            var sub_ref = database.ref("myDocs/" + std + "/");
            sub_ref.on('value', (sub_snapshot) => {
                sub_snapshot.forEach((child) => {
                    var sub = child.key;
                    var li = document.createElement("li");

                    var button = document.createElement("button");
                    button.type = "button";
                    button.classList.add("dropdown-item");
                    button.onclick = () => {
                        document.getElementById('STD').innerHTML = std;
                        document.getElementById('SUB').innerHTML = sub;

                        // Files
                        var folder = document.getElementsByClassName("file-content");
                        var file_ref = database.ref("myDocs/" + std + "/" + sub + "/");
                        file_ref.on('value', (file_snapshot) => {
                            $('.file-content').empty();
                            file_snapshot.forEach((child) => {
                                var file = child.val();
                                // Create Form
                                var form = document.createElement("form");
                                form.action = "/nu";
                                form.method = "post";
                                form.insertAdjacentHTML("beforeend",
                                    '<input type="hidden" value="' + file.name + '" name="name">');
                                form.insertAdjacentHTML("beforeend",
                                    '<input type="hidden" value="' + file.url + '" name="url">');
                                form.insertAdjacentHTML("beforeend",
                                    '<input type="hidden" value="' + std + '" name="std">');
                                form.insertAdjacentHTML("beforeend",
                                    '<input type="hidden" value="' + sub + '" name="sub">');
                                form.insertAdjacentHTML("beforeend",
                                    '<input type="hidden" value="' + child.key + '" name="key">');

                                var file_item = document.createElement("button");
                                file_item.classList.add("file-item");
                                file_item.type = "submit"
                                // file_item.type = "button"
                                file_item.innerHTML = file.name;
                                file_item.id = "file_item";
                                // file_item.onclick = () => {
                                //     document.getElementById("file_item").classList.add("file-item-click");
                                //     sleep(150).then(() => {
                                //         document.getElementById("file_item").classList.remove("file-item-click");
                                //     });
                                // };

                                form.appendChild(file_item);
                                folder[0].appendChild(form);
                                // folder[0].insertAdjacentHTML('beforeend',
                                //     "<button class='file-item' onclick=''>" + filename.name + "</button>"
                                // )
                            });
                        });
                    };
                    button.innerHTML = sub;
                    li.appendChild(button);
                    menu.appendChild(li);
                });
            });
        });
    });
};
read();