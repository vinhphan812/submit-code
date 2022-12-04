var { build, runEXE, removeFile, run } = require("./modules/compiler");

var sourceProgram = `
using System;
public class Hello
{
    public static void Main()
    {
        string readLine = Console.ReadLine();
        Console.WriteLine(readLine.ToUpper());
 	}
}`;

(async () => {
	try {
		const testCases = [
			{ input: "\"Vinh\"", _id: "012" },
			{ input: "Phan", _id: "0123" },
		];

		const result = await run(sourceProgram, testCases);
		console.log(result);
	} catch (error) {
		console.log("out", error.message)
	}
})();
