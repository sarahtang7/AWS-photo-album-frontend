var apigClient = apigClientFactory.newClient({
    apiKey: 'rFnuulRbsBfCc8Jf6xuCaxXfx12S7ZMaJ4RR6Lw0'
});

function showResults() {
    alert(document.getElementById('search').value);

    // Make search requests to the GET /search endpoint
    var search_input = document.getElementById('search').value.trim().toLowerCase();
    if (search_input == '') {
        alert("Please enter a search query.");
    }
    else {
        console.log("Searching the photo album...");

        var params = {
            'x-api-key' : 'rFnuulRbsBfCc8Jf6xuCaxXfx12S7ZMaJ4RR6Lw0',
            'q' : search_input
        };

        // GET /search
        apigClient.searchGet(params, {}, {})
            .then(function(result) {

                console.log("Successful GET API Response: ", result);

                /*images = result["data"]["body"]["images"];
                console.log("Image Paths: ", images);

                var photo_output_area = document.getElementById("photos-container");
                photo_output_area.innerHTML = "";

                for (var i = 0; i < images.length; i++) {
                    path_breakdown = images[i].split('/');
                    photo_output_area.innerHTML += '<figure><img src="' + path_breakdown[i] + '" style="width:80px;"></figure>';
                }*/

            }).catch(function(result) {
                console.log("Failed GET API Response: ", result);
            });
    }
}

function uploadImage() {
    // image & custom label information
    var image_path = document.getElementById('filetoupload').value
    var filename = image_path.split("\\").pop();
    var file = document.getElementById('filetoupload').files[0]
    //alert(image_path)
    //alert(filename)

    var custom_labels = document.getElementById('file-custom-labels').value
    //alert(custom_labels)

    if (image_path == '' || ![".png", ".jpg", ".jpeg"].some(ext => filename.includes(ext))) {
        alert("Please upload an image file of the type .png, .jpg, or .jpeg.");
    }
    else {
        console.log('Image file: ', file);
        console.log("Uploading the image...");

        var params = {
            'x-api-key' : 'rFnuulRbsBfCc8Jf6xuCaxXfx12S7ZMaJ4RR6Lw0',
            'Content-Type': file.type,
            'Access-Control-Allow-Origin': '*'
        };

        /*var reader = new FileReader();
        reader.onload = function (event) {
            body = btoa(event.target.result);
            //console.log('Reader body : ', body);
            return apigClient.uploadPut(params, {}, {})
            .then(function(result) {
                console.log("Successful PUT response: ", result);
            })
            .catch(function(error) {
                console.log("Failed PUT response: ", error);
            })
        }
        reader.readAsBinaryString(file);*/
    }
}
