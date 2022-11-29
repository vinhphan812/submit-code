Onload = () => {
	const unit = "Bài Tập ";
	$("form").submit((e) => {
		const $exercises = $("input[name='exercises']");
		const value = [];

		const $inpExersice = $("input[name='exercise']");
		const $inpDescription = $("input[name='description']");

		$inpExersice.each((i, e) => {
			value.push({
				name: e.value,
				description: $inpDescription[i].value,
			});
		});
		$exercises.val(JSON.stringify(value));
		table.rows().remove().draw();
		return true;
	});

	$(".add").click((e) => {
		const index = table.rows()[0].length + 1;
		table.row
			.add([
				index,
				renderInput("exercise", unit + index, "Bài tập..."),
				renderInput("description", "", "Đề hoặc mô tả bài tập"),
				null,
			])
			.draw();
	});

	$("input[name='total_exercise']").change((e) => {
		table.rows().remove();
		const value = +e.target.value;
		if (typeof value != "number") return;

		const result = [];

		for (var i = 1; i <= value; i++) {
			result.push([
				i,
				renderInput("exercise", unit + i, "Bài tập..."),
				renderInput("description", "", "Đề hoặc mô tả bài tập"),
				null,
			]);
		}
		table.rows.add(result).draw();
	});
};

function renderInput(name, value, placeholder) {
	return `<input type="text" class="form-control" name="${name}" id="" placeholder="${placeholder}" value="${value}">`;
}
