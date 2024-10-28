// function closePrompy() {
//     const prompy = document.getElementById("prompy");
//     prompy.style.transform = "translateY(-200%)"

// }
// function showButton() {
//     var fileInput = document.getElementById('videoFile');
//     var submitButton = document.getElementById('upx');
//     if (fileInput.files.length > 0) {
//         submitButton.style.display = 'flex';
//     } else {
//         submitButton.style.display = 'none';
//     }
// }
// const datas = document.getElementById("bendfb").value;
// console.log(datas);
// const print = (dat) => { console.log(dat); }
// const datass = datas.replace(/'/g, '"');
// console.log(datass);
// try {
//     var fbcon = JSON.parse(datass);
//     console.log(fbcon);
// } catch (error) {
//     console.error("Error parsing JSON:", error);
// }
// firebase.initializeApp(fbcon);
// function uploadVideo() {
//     document.getElementById('upx').innerHTML = `Uploading! <i class="fa-solid fa-cloud-arrow-up"></i>`;
//     document.getElementById('updng').textContent = "Uploading, Please Wait!";
//     document.getElementById('upx').setAttribute("disabled", "disabled");
//     document.getElementById('videoFile').style.display = "none";
//     document.getElementById('prog').style.display = "block";
//     const inval = document.getElementById('inval');
//     var user = document.getElementById("userid").value;
//     sessionStorage.setItem("id", user);
//     document.getElementById("usid").value = user;
//     var storage = firebase.storage();
//     var vcount = document.getElementById("vcount").value;
//     var vcint = parseInt(vcount);
//     vcint += 1;
//     var file = document.getElementById("videoFile").files[0];
//     var storageRef = storage.ref();
//     var fname = document.getElementById("fname");
//     fname.value = `video${vcint}`;
//     var thisref = storageRef.child(user).child(`video${vcint}`).put(file);
//     thisref.on(
//         "state_changed",
//         function (snapshot) {
//             print(snapshot);
//             let bValue = snapshot.b;
//             let sMb = bValue / 1048576;
//             sMb = sMb.toFixed(2);
//             let hValue = snapshot.h;
//             let fMb = hValue / 1048576;
//             fMb = fMb.toFixed(2);
//             let percent = (bValue / hValue) * 100;
//             percent = parseInt(percent);
//             document.getElementById('updng').textContent = `Uploading your Video, (${sMb}MB / ${fMb}MB)`;
//             print(`${percent}%`);
//             inval.innerText = `${percent}%`;
//             inval.style.width = `${percent}%`;
//         },
//         function (error) { },

//         function () {
//             var downloadURL = thisref.snapshot.downloadURL;
//             document.getElementById("vidUrl").value = downloadURL;
//             print(downloadURL);
//             document.getElementById('upx').style.display = "none";
//             document.getElementById('updng').textContent = "Uploaded Successfully!, you will be redirected to corresponding page!";
//             vcint += 1;
//             var form = document.getElementById("vidform");
//             form.submit();
//         }
//     );
// }
// function downloadImg(url) {
//     window.open(url, '_blank');
// }
// function repPreview() {
//     document.getElementById("repPreview").style.display = "block"
// }
// function closePrompyx() {
//     document.getElementById("repPreview").style.display = "none"

// }

function closePrompy() {
    const prompy = document.getElementById("prompy");
    prompy.style.transform = "translateY(-200%)";
}

function showButton() {
    var fileInput = document.getElementById('videoFile');
    var submitButton = document.getElementById('upx');
    if (fileInput.files.length > 0) {
        submitButton.style.display = 'flex';
    } else {
        submitButton.style.display = 'none';
    }
}


const datas = document.getElementById("bendfb").value;
console.log(datas);

const print = (dat) => { 
    console.log(dat); 
}


const datass = datas.replace(/'/g, '"');
console.log(datass);

try {
    var fbcon = JSON.parse(datass);
    console.log(fbcon);
} catch (error) {
    console.error("Error parsing JSON:", error);
}


firebase.initializeApp(fbcon);

function uploadVideo() {
    document.getElementById('upx').innerHTML = `Uploading! <i class="fa-solid fa-cloud-arrow-up"></i>`;
    document.getElementById('updng').textContent = "Uploading, Please Wait!";
    document.getElementById('upx').setAttribute("disabled", "disabled");
    document.getElementById('videoFile').style.display = "none";
    document.getElementById('prog').style.display = "block";

    const inval = document.getElementById('inval');
    var user = document.getElementById("userid").value;
    sessionStorage.setItem("id", user);
    document.getElementById("usid").value = user;

    var storage = firebase.storage();
    var vcount = document.getElementById("vcount").value;
    var vcint = parseInt(vcount);
    vcint += 1;

    var file = document.getElementById("videoFile").files[0];
    var storageRef = storage.ref();
    var fname = document.getElementById("fname");
    fname.value = `video${vcint}`;

    var thisref = storageRef.child(user).child(`video${vcint}`).put(file);
    thisref.on(
        "state_changed",
        function (snapshot) {
            print(snapshot);

      
            let bytesTransferred = snapshot.bytesTransferred;
            let totalBytes = snapshot.totalBytes;
            let percent = (bytesTransferred / totalBytes) * 100;
            percent = parseInt(percent);

            let sMb = (bytesTransferred / 1048576).toFixed(2); 
            let fMb = (totalBytes / 1048576).toFixed(2); 

            document.getElementById('updng').textContent = `Uploading your Video, (${sMb}MB / ${fMb}MB)`;
            print(`${percent}%`);
            inval.innerText = `${percent}%`;
            inval.style.width = `${percent}%`;
        },
        function (error) {
            console.error("Upload failed:", error);
        },
        function () {
         
            thisref.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                document.getElementById("vidUrl").value = downloadURL;
                print(downloadURL);

                document.getElementById('upx').style.display = "none";
                document.getElementById('updng').textContent = "Uploaded Successfully!, you will be redirected to corresponding page!";
                vcint += 1;

                var form = document.getElementById("vidform");
                form.submit();
            });
        }
    );
}

function downloadImg(url) {
    window.open(url, '_blank');
}

function repPreview() {
    document.getElementById("repPreview").style.display = "block";
}

function closePrompyx() {
    document.getElementById("repPreview").style.display = "none";
}
