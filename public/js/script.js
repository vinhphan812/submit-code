let Onload;
function Alert(title, text, confirmButtonText, icon = "error") {
	return Swal.fire({
		heightAuto: false,
		title,
		text,
		icon,
		confirmButtonText,
		timer: 1000,
		timerProgressBar: true,
	});
}
function confirmDelete(name = "", cb) {
	Swal.fire({
		customClass: {
			confirmButton: "btn btn-success mx-2",
			cancelButton: "btn btn-danger mx-2",
		},
		buttonsStyling: false,
		title: "Xóa " + name,
		text: `Bạn chắc chắn muốn xóa?`,
		showCancelButton: true,
		confirmButtonText: "Xóa",
		cancelButtonText: "Quay lại",
		showLoaderOnConfirm: true,
		preConfirm: cb,
		reverseButtons: true,
	});
}

window.onload = () => {
	window.table = $(".table").DataTable({
		responsive: true,
		language: {
			url: "https://cdn.datatables.net/plug-ins/1.11.5/i18n/vi.json",
		},
		lengthMenu: [
			[25, 50, -1],
			[25, 50, "All"],
		],
	});
	if (Onload) Onload();
};
