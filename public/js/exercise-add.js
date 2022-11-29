Onload = () => {
	const unit = "Bài Tập ";
	$("form").submit((e) => {
		const $exercises = $("input[name='testcases']");
		const value = [];

		const $inpTestCase = $("input[name='test_case']");
		const $inpInput = $("input[name='input']");
		const $inpOutput = $("input[name='output']");

		$inpTestCase.each((i, e) => {
			value.push({
				name: e.value,
				input: $inpInput[i].value,
				output: $inpOutput[i].value,
			});
		});
		$exercises.val(JSON.stringify(value));
		table.rows().remove().draw();
		return true;
	});

	$("input[name='total_test_case']").change((e) => {
		table.rows().remove();
		const value = +e.target.value;
		if (typeof value != "number") return;

		const result = [];

		for (var i = 1; i <= value; i++) {
			result.push([
				i,
				renderInput("test_case", unit + i, "Test Case..."),
				renderInput("input", "", "Input"),
				renderInput("output", "", "Output"),
				null,
			]);
		}
		table.rows.add(result).draw();
	});
};

function renderInput(name, value, placeholder) {
	return `<input type="text" class="form-control" name="${name}" id="" placeholder="${placeholder}" value="${value}">`;
}
