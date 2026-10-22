
```javascript
document.getElementById("form").onsubmit = function(e) {
  e.preventDefault();

  let patientName = document.getElementById("patient").value;
  let hospitalName = document.getElementById("hospital").value;
  let doctorName = document.getElementById("doctor").value;
  let appointmentDate = document.getElementById("date").value;
  let appointmentTime = document.getElementById("time").value;

  document.getElementById("result").innerHTML = `
    <h3>Appointment Confirmed!</h3>
    <p><b>Appointment ID:</b> MC${Date.now().toString().slice(-6)}</p>
    <p><b>Patient Name:</b> ${patientName}</p>
    <p><b>Hospital:</b> ${hospitalName}</p>
    <p><b>Doctor:</b> ${doctorName}</p>
    <p><b>Date:</b> ${appointmentDate}</p>
    <p><b>Time:</b> ${appointmentTime}</p>
    <p><b>Status:</b> Confirmed</p>
  `;
};
```
```