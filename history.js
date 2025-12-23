// ================= FIREBASE CONFIG =================
var firebaseConfig = {
  databaseURL: "https://monitoring-sampah-4dffe-default-rtdb.firebaseio.com",
};
firebase.initializeApp(firebaseConfig);

var db = firebase.database();
var historyRef = db.ref("history");

// ================= DATA =================
var labels = [];
var sampahData = [];
var bauData = [];

// ================= BAU KE ANGKA =================
function bauKeAngka(bau) {
  if (bau === "NORMAL") return 1;
  if (bau === "SEDANG") return 2;
  if (bau === "MENYENGAT") return 3;
  return 0;
}

// ================= CHART SAMPAH =================
var ctxSampah = document.getElementById("sampahChart").getContext("2d");
var sampahChart = new Chart(ctxSampah, {
  type: "line",
  data: {
    labels: labels,
    datasets: [{
      label: "Persentase Sampah (%)",
      data: sampahData,
      borderColor: "#43cea2",
      backgroundColor: "rgba(67,206,162,0.15)",
      tension: 0.3,
      fill: true
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { min: 0, max: 100 }
    }
  }
});

// ================= CHART BAU =================
var ctxBau = document.getElementById("bauChart").getContext("2d");
var bauChart = new Chart(ctxBau, {
  type: "line",
  data: {
    labels: labels,
    datasets: [{
      label: "Tingkat Bau",
      data: bauData,
      borderColor: "#ff6b6b",
      backgroundColor: "rgba(255,107,107,0.15)",
      tension: 0.3,
      fill: true
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 3,
        ticks: {
          callback: function (value) {
            if (value === 1) return "NORMAL";
            if (value === 2) return "SEDANG";
            if (value === 3) return "MENYENGAT";
            return "";
          }
        }
      }
    }
  }
});

// ================= FIREBASE LISTENER =================
historyRef.limitToLast(10).on("child_added", function (snap) {
  var data = snap.val();

  var waktu = new Date(data.waktu).toLocaleTimeString();

  labels.push(waktu);
  sampahData.push(data.persentase);
  bauData.push(bauKeAngka(data.bau));

  sampahChart.update();
  bauChart.update();

  // ================= TABLE =================
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
