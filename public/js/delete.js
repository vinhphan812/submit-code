$(".delete").click((e) => {
	const parent = e.target.parentNode.parentNode;

	const id = $(parent).attr(id_attr);
	Swal.fire({
		title: "Bạn có chắc?",
		text: `Bạn có chắc muốn xóa ${delete_unit_lang} này? `,
		icon: "warning",
		showCancelButton: true,
		confirmButtonColor: "#3085d6",
		cancelButtonColor: "#d33",
		confirmButtonText: "Chắc chắn!",
		cancelButtonText: "Hủy",
	}).then(async (result) => {
		if (result.isConfirmed) {
			const form = document.forms["delete"];
			form.action = `/admin/${delete_type}/${id}/delete`;
			form.submit();
		}
	});
});
