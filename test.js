var { build, runWithPath, makeOutPath } = require("./modules/compiler");

var sourceProgram = `
using System;
public class Hello
{
    public static void Main()
    {
        string readLine = Console.ReadLine();
        int b = int.Parse(Console.ReadLine());
        double c = double.Parse(Console.ReadLine());
        Console.WriteLine(readLine.ToUpper());
        Console.WriteLine(b);
        Console.WriteLine(c);
    }
}`;

(async () => {
	try {
		const testCases = [
			{ input: "Vinh 1 1.2", _id: "012" },
			{ input: "Phan 2 2,3", _id: "0123" },
		];

		const outFile = [];
		const { srcPath, exePath, id } = await build(sourceProgram);

		for (const testCase of testCases) {
			const { outPath, stdout } = await runWithPath(
				exePath,
				makeOutPath(id, testCase._id),
				testCase.input.split(" ")
			);
			console.log(stdout);
			outFile.push(outPath);
		}

		console.log(outFile);
	} catch (err) {
		// console.log(err.message.trim().split("\n"));
		console.log(err.message);
	}
})();
