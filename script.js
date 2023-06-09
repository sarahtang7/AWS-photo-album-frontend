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

                    image = url.replace(/^"(.*)"$/, '$1'); // maybe take out
                    console.log("lambda response: ", image);

                    photo_output_area.innerHTML += '<figure><img src="' + image + '" style="height: 250px;"></figure>';

                }

            }).catch(function(result) {
                console.log("Failed GET API Response: ", result);
            });
    }
}

function processVoiceInput() {
    console.log("Processing voice input ...");

    var speech = true;
    const search_bar = document.getElementById("search");

    window.SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.interimResults = true;

    if (speech == true) {
        recognition.start();
    }

    recognition.addEventListener('result', event => {
        console.log("Converting voice to text...");

        const idx = event.resultIndex;
        const transcript = event.results[idx][0].transcript;

        search_bar.value = transcript;
    })

    recognition.addEventListener("end", function() {
        console.log("Done recording");
        speech = false;
        recognition.stop();
    });
    
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
            "Content-Type" : 'application/base64',
            "Accept": 'application/base64',
            'Access-Control-Allow-Origin': '*'
        };

        var reader = new FileReader();
        reader.onload = function (event) {
            const binary_string = event.target.result.replace(/\\([0-7]{3})/g, (match, octal) => String.fromCharCode(parseInt(octal, 8)));
            body = btoa(binary_string); // base64-encoded string

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
