var firebaseConfig = {
  databaseURL: "https://monitoring-sampah-4dffe-default-rtdb.firebaseio.com",
};
firebase.initializeApp(firebaseConfig);

var db = firebase.database();
var historyRef = db.ref("history");

var labels = [];
var values = [];

var ctx = document.getElementById("sampahChart").getContext("2d");
var chart = new Chart(ctx, {
  type: "line",
  data: {
    labels: labels,
    datasets: [{
      label: "Persentase Sampah (%)",
      data: values,
      borderColor: "#43cea2",
      tension: 0.3,
      fill: false
    }]
  }
});

historyRef.limitToLast(10).on("child_added", function (snap) {
  var data = snap.val();

  labels.push(new Date(data.waktu).toLocaleTimeString());
  values.push(data.persentase);
  chart.update();

  var row = `
    <tr>
      <td>${new Date(data.waktu).toLocaleString()}</td>
      <td>${data.persentase}%</td>
      <td>${data.status}</td>
      <td>${data.bau}</td>
    </tr>
  `;
  document.getElementById("historyTable").innerHTML += row;
});
