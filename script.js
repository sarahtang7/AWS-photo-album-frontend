var apigClient = apigClientFactory.newClient({
    apiKey: '2JqhvPnkr13r8iTVtME8J1XpSw88eJhP49oc7yjP'
});

function showResults() {

    // Make search requests to the GET /search endpoint
    var search_input = document.getElementById('search').value.trim().toLowerCase();
    document.getElementById('search').value = "";
    if (search_input == '') {
        alert("Please enter a search query.");
    }
    else {
        console.log("Searching the photo album...");

        var params = {
            'x-api-key' : '2JqhvPnkr13r8iTVtME8J1XpSw88eJhP49oc7yjP',
            'q' : search_input
        };

        // GET /search
        apigClient.searchGet(params, {}, {})
            .then(function(result) {

                console.log("Successful GET API Response: ", result);

                var photo_output_area = document.getElementById("photos-container");
                photo_output_area.innerHTML = ""; // clear photo area

                for (const url of result["data"]["body"]["images"]) {

                    image = url.replace(/^"(.*)"$/, '$1'); 
                    console.log("lambda response: ", image);

                    // base64 image from S3 bucket -> frontend
                    fetch(image)
                        .then(response => response.blob())
                        .then(blob => {
                            var reader = new FileReader();
                            reader.readAsBinaryString(blob);
                            reader.onloadend = () => {
                            var base64Data = reader.result;

                            photo_output_area.innerHTML += '<figure><img src="data:image/*;base64, ' + base64Data + '"style="height: 250px;"></figure>';
                            };
                        });
                }

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

    var custom_labels = document.getElementById('file-custom-labels').value

    if (image_path == '' || ![".png", ".jpg", ".jpeg"].some(ext => filename.includes(ext))) {
        alert("Please upload an image file of the type .png, .jpg, or .jpeg.");
    }
    else {
        document.getElementById('filetoupload').value = "";
        document.getElementById('file-custom-labels').value = "";

        console.log('Image file: ', file);
        console.log("Uploading the image...");

        var params = {
            'x-api-key' : '2JqhvPnkr13r8iTVtME8J1XpSw88eJhP49oc7yjP',
            'x-amz-meta-customLabels': custom_labels.replace(/\s/g, '').trim(),
            "filename" : filename, 
            "bucket" : "photo-album-application.com", 
            "Content-Type" : file.type,
            "Accept": '*/*',
            'Access-Control-Allow-Origin': '*'
        };

        var reader = new FileReader();
        reader.onload = function (event) {
            const binary_string = event.target.result.replace(/\\([0-7]{3})/g, (match, octal) => String.fromCharCode(parseInt(octal, 8)));
            body = btoa(binary_string); // binary

            return apigClient.uploadBucketFilenamePut(params, body)
            .then(function(result) {
                console.log("Successful PUT response: ", result);
            })
            .catch(function(error) {
                console.log("Failed PUT response: ", error);
            })
        }
        reader.readAsBinaryString(file);
    }
}
