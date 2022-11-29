Onload = () => {
	const unit = "Test Case ";
	$("form").submit((e) => {
		const $testCases = $("input[name='test_cases']");
		const value = [];

		const $inpExersice = $("input[name='test_case']");
		const $inpInput = $("input[name='input']");
		const $inpOutput = $("textarea[name='output']");

		$inpExersice.each((i, e) => {
			value.push({
				name: e.value,
				input: $inpInput[i].value,
				output: $inpOutput[i].value,
			});
		});
		$testCases.val(JSON.stringify(value));
		table.rows().remove().draw();
		return true;
	});

	$(".add").click((e) => {
		const index = table.rows()[0].length + 1;
		table.row
			.add([
				index,
				renderInput("test_case", unit + index, "Bài tập..."),
				renderInput("input", "", 'input viết cách nhau ","'),
				renderTextArea("output", "", "parse output vào đây"),
				null,
			])
			.draw();
	});
};

function renderInput(name, value, placeholder) {
	return `<input type="text" class="form-control" name="${name}" id="" placeholder="${placeholder}" value="${value}">`;
}

function renderTextArea(name, value, placeholder) {
	return `<textarea placeholder="${placeholder}" class="form-control" name="${name}" value="${value}"></textarea>`;
}
