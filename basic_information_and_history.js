window.onclose = window_close_check;

function window_close_check (e) {
	alert("what");
	e.preventDefault();
}

window.find();