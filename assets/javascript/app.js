var firebaseConfig = {
    apiKey: "AIzaSyA65LJZykKp2Ul5yreS5Dt2kD16a3TlLKs",
    authDomain: "train-scheduler-ddaaa.firebaseapp.com",
    databaseURL: "https://train-scheduler-ddaaa.firebaseio.com",
    projectId: "train-scheduler-ddaaa",
    storageBucket: "",
    messagingSenderId: "49412888907",
    appId: "1:49412888907:web:f069fc9bcf6f718fc230ce"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

var trainName;
var destination;
var frequency;

var currentTime;
var totalMinutes;

function currentTime() {
    totalMinutes = parseInt(moment().format("H") * 60) + parseInt(moment().format("m"));
}

$(document).on("click", "#submitTrainData", function () {
    trainName = $("#trainName").val().trim();
    destination = $("#destination").val().trim();
    frequency = $("#frequency").val().trim();

    database.ref().push({
        createdDate: firebase.database.ServerValue.TIMESTAMP,
        trainName: trainName,
        destination: destination,
        frequency: frequency
    })
});

database.ref().on("child_added", function (snapshot) {
    var sv = snapshot.val();
    currentTime();

    var rowDiv = $("<tr>");
    var tdTrainName = $('<td>' + sv.trainName + '</td>');
    var tdDestination = $('<td>' + sv.destination + '</td>');
    var tdFrequency = $('<td>Every ' + sv.frequency + ' minutes</td>');
    var minutesAway = (parseInt(sv.frequency) - parseInt(totalMinutes % sv.frequency));
    var tdMinutesAway;

    if (totalMinutes % sv.frequency !== 0) {
        tdMinutesAway = $('<td>' + minutesAway + ' minutes away</td>');
    } else {
        tdMinutesAway = $('<td>Arriving Now</td>');
    }

    var nextArrival = moment().add(minutesAway, 'minutes').format("h:m A");
    var tdNextArrival;

    if (totalMinutes % sv.frequency !== 0) {
        tdNextArrival = $('<td>' + nextArrival + '</td>');
    
    } else {
        tdNextArrival = $('<td>Now</td>');
    }

    $(rowDiv).append(tdTrainName);
    $(rowDiv).append(tdDestination);
    $(rowDiv).append(tdFrequency);
    $(rowDiv).append(tdNextArrival);
    $(rowDiv).append(tdMinutesAway);

    $(".trainData").append(rowDiv);
})