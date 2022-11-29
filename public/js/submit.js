Onload = () => {
	const value =
		"using System;\nusing System.Collections.Generic;\nusing System.Linq;\nusing System.Text;\nusing System.Threading.Tasks;\n\nnamespace Runner\n{\n    class Program\n    {\n        static void Main(string[] args)\n        {\n            // code ở đây\n        }\n    }\n}\n";

	let editor;

	function createDependencyProposals(range) {
		// returning a static list of proposals, not even looking at the prefix (filtering is done by the Monaco editor),
		// here you could do a server side lookup
		return [
			{
				label: "Console.Write",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: 'Console.Write(${1:""});',
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule
						.InsertAsSnippet,
				range: range,
			},
			{
				label: "Console.WriteLine",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: 'Console.WriteLine(${1:""});',
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule
						.InsertAsSnippet,
				range: range,
			},
			{
				label: "Console.ReadLine",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "Console.ReadLine();",
				range: range,
			},
			{
				label: "int.Parse(Console.ReadLine)",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "int.Parse(Console.ReadLine());",
				range: range,
			},
			{
				label: "int.Parse()",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: 'int.Parse("${1}");',
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule
						.InsertAsSnippet,
				range: range,
			},
			{
				label: "int <name>",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "int ${1:variable_name};",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule
						.InsertAsSnippet,
				range: range,
			},
			{
				label: "string name",
				kind: monaco.languages.CompletionItemKind.Function,
				insertText: "int ${1:variable_name};",
				insertTextRules:
					monaco.languages.CompletionItemInsertTextRule
						.InsertAsSnippet,
				range: range,
			},
		];
	}

	require(["vs/editor/editor.main"], () => {
		monaco.languages.registerCompletionItemProvider("csharp", {
			provideCompletionItems: function (model, position) {
				// find out if we are completing a property in the 'dependencies' object.
				var textUntilPosition = model.getValueInRange({
					startLineNumber: 1,
					startColumn: 1,
					endLineNumber: position.lineNumber,
					endColumn: position.column,
				});
				var match = textUntilPosition.match(/((.|\n)*)/);
				if (!match) {
					return { suggestions: [] };
				}
				var word = model.getWordUntilPosition(position);
				var range = {
					startLineNumber: position.lineNumber,
					endLineNumber: position.lineNumber,
					startColumn: word.startColumn,
					endColumn: word.endColumn,
				};
				return {
					suggestions: createDependencyProposals(range),
				};
			},
		});

		// Initialize the editor
		editor = monaco.editor.create(document.getElementById("Content"), {
			value,
			language: "csharp",
			theme: "vs-dark",
			wordWrap: "on",
			options: { fixedOverflowWidgets: true },
			automaticLayout: true,
			minimap: {
				enabled: false,
			},
			scrollbar: {
				vertical: "auto",
			},
		});
	});

	$("#run").submit((e) => {
		const source = editor ? editor.getValue() : "";
		$("input[name='source']").val(source);

		return true;
	});
	$("#test").click((e) => {
		const source = editor ? editor.getValue() : "";
		console.log(source);
		$("input[name='source']").val(source);
	});
};
