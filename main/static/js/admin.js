function copyUrl(theUrl) {
    const pwElement = document.getElementById(theUrl);
    pwElement.select();
    document.execCommand("copy");
}
function showpop(curr_user, name, mail) {
    document.getElementById("observation").style.transform = "translatey(0)";
    document.getElementById("obsuid").value = curr_user;
    document.getElementById("obsuid2").value = curr_user;
    document.getElementById("obsuname").value = name;
    document.getElementById("obsumail").value = mail;
    document.getElementById("obsuname2").value = name;
    document.getElementById("obsumail2").value = mail;
}
function closePrompy() {
    const prompy = document.getElementById("observation");
    prompy.style.transform = "translateY(-200dvh)"

}
function showButton() {
    var fileInput = document.getElementById('videoFile');
    var submitButton = document.getElementById('upx');
    if (fileInput.files.length > 0) {
        submitButton.style.display = 'block';
    } else {
        submitButton.style.display = 'none';
    }
}
function showiButton() {
    var fileInput = document.getElementById('imgFile');
    var submitButton = document.getElementById('iupx');
    if (fileInput.files.length > 0) {
        submitButton.style.display = 'block';
    } else {
        submitButton.style.display = 'none';
    }
}
function showi2Button() {
    var fileInput = document.getElementById('imgFile2');
    var submitButton = document.getElementById('iupx2');
    if (fileInput.files.length > 0) {
        submitButton.style.display = 'block';
    } else {
        submitButton.style.display = 'none';
    }
}
function showi3Button() {
    var fileInput = document.getElementById('imgFile3');
    var submitButton = document.getElementById('iupx3');
    if (fileInput.files.length > 0) {
        submitButton.style.display = 'block';
    } else {
        submitButton.style.display = 'none';
    }
}



const datas = document.getElementById("bendfb").value;
console.log(datas);

const datass = datas.replace(/'/g, '"');
console.log(datass);

try {
    // Attempt to parse the corrected JSON string
    var fbcon = JSON.parse(datass);
    console.log(fbcon);


} catch (error) {
    console.error("Error parsing JSON:", error);
}


const print = (dat) => { console.log(dat); }
firebase.initializeApp(fbcon);
function uploadVideo() {
    document.getElementById('upx').innerHTML = `Uploading! <i class="fa-solid fa-cloud-arrow-up"></i>`;
    document.getElementById('updng').textContent = "Uploading, Please Wait!";
    document.getElementById('upx').setAttribute("disabled", "disabled");
    document.getElementById('videoFile').style.display = "none";
    document.getElementById('upx').style.display = "none";

    document.getElementById('prog').style.display = "block";
    const inval = document.getElementById('inval');


    var user = document.getElementById("obsuid").value;
    var storage = firebase.storage();
    var file = document.getElementById("videoFile").files[0];
    var storageRef = storage.ref();
    var thisref = storageRef.child(user).child(`report`).child("video").put(file);

    thisref.on(
        "state_changed",
        function (snapshot) {
            print(snapshot);
            let bValue = snapshot.b;
            let sMb = bValue / 1048576;
            sMb = sMb.toFixed(2);

            let hValue = snapshot.h;
            let fMb = hValue / 1048576;
            fMb = fMb.toFixed(2);
            let percent = (bValue / hValue) * 100;
            percent = parseInt(percent);
            document.getElementById('updng').textContent = `Uploading your Video, (${sMb}MB / ${fMb}MB)`;
            print(`${percent}%`);
            if (sMb == fMb) {
                document.getElementById('updng').textContent = `Video Uploaded Successfully!`;

            }
            inval.innerText = `${percent}%`;
            inval.style.width = `${percent}%`;


        },
        function (error) { },

        function () {
            var downloadURL = thisref.snapshot.downloadURL;
            console.log("got url");
            document.getElementById("subUrl").value = downloadURL;
            document.getElementById("subUrl2").value = downloadURL;

            print(downloadURL);

        }
    );
}
let imgUrls = [];
function uploadImage() {
    document.getElementById('iupx').innerHTML = `Uploading! <i class="fa-solid fa-cloud-arrow-up"></i>`;
    document.getElementById('iupdng').textContent = "Uploading, Please Wait!";
    document.getElementById('iupx').setAttribute("disabled", "disabled");
    document.getElementById('imgFile').style.display = "none";
    document.getElementById('iupx').style.display = "none";
    document.getElementById('iprog').style.display = "block";
    const inval = document.getElementById('iinval');
    var user = document.getElementById("obsuid").value;
    var storage = firebase.storage();
    var file = document.getElementById("imgFile").files;
    var files = Array.from(file);
    var storageRef = storage.ref();
    const uploadPromises = files.map((img, index) => {
        return new Promise((resolve, reject) => {
            var thisref = storageRef.child(user).child(`report`).child("images").child("c1").child(`img${index}`).put(img);
            thisref.on(
                "state_changed",
                function (snapshot) {
                    let bValue = snapshot.bytesTransferred;
                    let sMb = bValue / 1048576;
                    sMb = sMb.toFixed(2);

                    let hValue = snapshot.totalBytes;
                    let fMb = hValue / 1048576;
                    fMb = fMb.toFixed(2);
                    let percent = (bValue / hValue) * 100;
                    percent = parseInt(percent);
                    document.getElementById('iupdng').textContent = `Uploading your image ${index}, (${sMb}MB / ${fMb}MB)`;
                    inval.innerText = `${percent}%`;
                    inval.style.width = `${percent}%`;
                },
                function (error) {
                    reject(error);
                },
                function () {
                    // Upload completed successfully, now we can get the download URL
                    var downloadURL = thisref.snapshot.downloadURL;
                    console.log("got url");
                    imgUrls[index] = downloadURL;
                    resolve();
                }
            );
        });
    });

    // Wait for all upload promises to resolve
    Promise.all(uploadPromises)
        .then(() => {
            // Once all uploads are complete, join the imgUrls array and set the value
            var finalUrl = imgUrls.join(",");
            console.log(finalUrl);
            document.getElementById("isubUrl").value = finalUrl;
            document.getElementById("isubUrl21").value = finalUrl;

        })
        .catch(error => {
            console.error('Error uploading images:', error);
            // Handle error here
        });
}



function uploadImage2() {
    document.getElementById('iupx2').innerHTML = `Uploading! <i class="fa-solid fa-cloud-arrow-up"></i>`;
    document.getElementById('iupdng2').textContent = "Uploading, Please Wait!";
    document.getElementById('iupx2').setAttribute("disabled", "disabled");
    document.getElementById('imgFile2').style.display = "none";
    document.getElementById('iupx2').style.display = "none";
    document.getElementById('iprog2').style.display = "block";
    const inval = document.getElementById('iinval2');
    var user = document.getElementById("obsuid").value;
    var storage = firebase.storage();
    var file = document.getElementById("imgFile2").files;
    var files = Array.from(file);
    var storageRef = storage.ref();
    const uploadPromises = files.map((img, index) => {
        return new Promise((resolve, reject) => {
            var thisref = storageRef.child(user).child(`report`).child("images").child("c2").child(`img${index}`).put(img);
            thisref.on(
                "state_changed",
                function (snapshot) {
                    let bValue = snapshot.bytesTransferred;
                    let sMb = bValue / 1048576;
                    sMb = sMb.toFixed(2);

                    let hValue = snapshot.totalBytes;
                    let fMb = hValue / 1048576;
                    fMb = fMb.toFixed(2);
                    let percent = (bValue / hValue) * 100;
                    percent = parseInt(percent);
                    document.getElementById('iupdng2').textContent = `Uploading your image ${index}, (${sMb}MB / ${fMb}MB)`;
                    inval.innerText = `${percent}%`;
                    inval.style.width = `${percent}%`;
                },
                function (error) {
                    reject(error);
                },
                function () {
                    // Upload completed successfully, now we can get the download URL
                    var downloadURL = thisref.snapshot.downloadURL;
                    console.log("got url");
                    imgUrls[index] = downloadURL;
                    resolve();
                }
            );
        });
    });

    // Wait for all upload promises to resolve
    Promise.all(uploadPromises)
        .then(() => {
            // Once all uploads are complete, join the imgUrls array and set the value
            var finalUrl = imgUrls.join(",");
            console.log(finalUrl);
            document.getElementById("isubUrl2").value = finalUrl;
            document.getElementById("isubUrl22").value = finalUrl;

        })
        .catch(error => {
            console.error('Error uploading images:', error);
            // Handle error here
        });
}

function uploadImage3() {
    document.getElementById('iupx3').innerHTML = `Uploading! <i class="fa-solid fa-cloud-arrow-up"></i>`;
    document.getElementById('iupdng3').textContent = "Uploading, Please Wait!";
    document.getElementById('iupx3').setAttribute("disabled", "disabled");
    document.getElementById('imgFile3').style.display = "none";
    document.getElementById('iupx3').style.display = "none";
    document.getElementById('iprog3').style.display = "block";
    const inval = document.getElementById('iinval3');
    var user = document.getElementById("obsuid").value;
    var storage = firebase.storage();
    var file = document.getElementById("imgFile3").files;
    var files = Array.from(file);
    var storageRef = storage.ref();
    const uploadPromises = files.map((img, index) => {
        return new Promise((resolve, reject) => {
            var thisref = storageRef.child(user).child(`report`).child("images").child("c3").child(`img${index}`).put(img);
            thisref.on(
                "state_changed",
                function (snapshot) {
                    let bValue = snapshot.bytesTransferred;
                    let sMb = bValue / 1048576;
                    sMb = sMb.toFixed(2);

                    let hValue = snapshot.totalBytes;
                    let fMb = hValue / 1048576;
                    fMb = fMb.toFixed(2);
                    let percent = (bValue / hValue) * 100;
                    percent = parseInt(percent);
                    document.getElementById('iupdng3').textContent = `Uploading your image ${index}, (${sMb}MB / ${fMb}MB)`;
                    inval.innerText = `${percent}%`;
                    inval.style.width = `${percent}%`;
                },
                function (error) {
                    reject(error);
                },
                function () {
                    // Upload completed successfully, now we can get the download URL
                    var downloadURL = thisref.snapshot.downloadURL;
                    console.log("got url");
                    imgUrls[index] = downloadURL;
                    resolve();
                }
            );
        });
    });

    // Wait for all upload promises to resolve
    Promise.all(uploadPromises)
        .then(() => {
            // Once all uploads are complete, join the imgUrls array and set the value
            var finalUrl = imgUrls.join(",");
            console.log(finalUrl);
            document.getElementById("isubUrl3").value = finalUrl;
            document.getElementById("isubUrl23").value = finalUrl;

        })
        .catch(error => {
            console.error('Error uploading images:', error);
            // Handle error here
        });
}






function submitForm() {

    var form = document.getElementById("vidform");
    form.submit();
}

console.log("JS")

