var firebaseConfig = {
  databaseURL: "https://monitoring-sampah-4dffe-default-rtdb.firebaseio.com",
};
firebase.initializeApp(firebaseConfig);

var database = firebase.database();
var sampahRef = database.ref("monitoring_sampah");

sampahRef.on("value", function (snapshot) {
  var data = snapshot.val();
  if (!data) return;

  var persen = Math.round(data.persentase);
  var status = data.status;
  var bau = data.bau;

  // Persentase
  document.getElementById("percentage").innerText = persen + "%";

  // Status Sampah
  var statusEl = document.getElementById("status");
  statusEl.innerText = status;
  statusEl.className = "status";

  if (status === "KOSONG") statusEl.classList.add("kosong");
  else if (status === "SEDANG") statusEl.classList.add("sedang");
  else statusEl.classList.add("penuh");

  // Status Bau
  var bauEl = document.getElementById("bau");
  bauEl.innerText = "BAU: " + bau;
  bauEl.className = "bau";

  if (bau === "NORMAL") bauEl.classList.add("normal");
  else if (bau === "SEDANG") bauEl.classList.add("sedang");
  else bauEl.classList.add("menyengat");

  // Waktu update
  var now = new Date();
  document.getElementById("lastUpdate").innerText = now.toLocaleString();
});
