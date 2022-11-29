"use strict";

const { v1 } = require("uuid");
const base = "compilers",
	outBase = "outputs";

const fs = require("fs");
const { exec, spawn } = require("child_process");

const fromSource = function (programSource) {
	var options =
		arguments.length <= 1 || arguments[1] === undefined
			? {}
			: arguments[1];
	var callback = arguments[2];

	const id = v1();

	const path = `${base}/${id}.cs`;

	fs.writeFile(path, programSource, function (err) {
		if (err) {
			return callback(false, err);
		}

		return fromFile(path, options, callback, id);
	});
};

var fromFile = function fromFile(programPath) {
	var options =
		arguments.length <= 1 || arguments[1] === undefined
			? {}
			: arguments[1];
	var callback = arguments[2];
	const id = arguments[3];
	const exePath = `${base}/${id}.exe`;

	var mcsCommand = "mcs -o " + exePath + " " + programPath;
	var monoCommand = "mono";

	exec(mcsCommand, function (error) {
		if (error) {
			callback(error);
			return;
		}

		const input = options.input
			? options.input.map((e) => `echo ${e}`)
			: [];

		const command = `${
			input.length ? `(${input.join(" & ")}) |` : ""
		} ${monoCommand} ${exePath}`;

		exec(command, (err, stdout, stder) => {
			if (err) {
				callback(true, error, stdout, stder);
				return;
			}

			fs.unlink(exePath, console.log);
			fs.unlink(programPath, console.log);

			callback(false, stdout, stder);
		});
	});
};

const writeCode = function (programPath, programSource) {
	return new Promise((resolve, reject) => {
		fs.writeFile(programPath, programSource, (err) => {
			if (err) return reject(err);

			resolve(programPath);
		});
	});
};

/**
 *
 * @param {String} programSource
 * @param {{input: String[] | undefined}} param1
 * @returns output path or throw error
 */
const compile = function (programSource, { input }) {
	return new Promise(async (resolve, reject) => {
		try {
			const id = v1(),
				path = `${base}/${id}`,
				srcPath = path + ".cs",
				exePath = path + ".exe",
				outPath = path + ".txt";

			await writeCode(srcPath, programSource);

			const mcsCMD = `mcs -o ${exePath} ${srcPath}`;

			exec(mcsCMD, (err) => {
				if (err) return reject(err);

				const inputMapping = input
					? input.map((e) => `echo ${e}`)
					: [];

				const monoCMD = `${
					inputMapping.length
						? `(${inputMapping.join(" & ")}) |`
						: ""
				} mono ${exePath} > ${outPath}`;

				exec(monoCMD, (err, stdout, stderr) => {
					if (err) reject(err);

					if (stderr) reject(stderr);

					fs.unlink(exePath, () => {});
					fs.unlink(srcPath, () => {});
					resolve(outPath);
				});
			});
		} catch (error) {
			reject(error);
		}
	});
};
/**
 *
 * @param {String} source source code C#
 * @returns {Promise<{srcPath: string, exePath: string, id: string}>}
 */
const build = function (source) {
	return new Promise(async (resolve, reject) => {
		try {
			const id = v1(),
				path = `${base}/${id}`,
				srcPath = path + ".cs",
				exePath = path + ".exe";

			await writeCode(srcPath, source);

			const mcsCMD = `mcs -o ${exePath} ${srcPath}`;

			exec(mcsCMD, (err) => {
				if (err) return reject(err);
				fs.unlink(srcPath, () => {});
				resolve({ srcPath, exePath, id });
			});
		} catch (err) {
			reject(err);
		}
	});
};
/**
 *
 * @param {String} outId
 * @param {String} testId
 * @returns
 */
const makeOutPath = (outId, testId) => {
	return `${outBase}/${outId}_${testId}.txt`;
};

const runWithPath = function (exePath, outPath, input) {
	return new Promise(async (resolve, reject) => {
		try {
			const inputMapping = input ? input.map((e) => `echo ${e}`) : [];

			const monoCMD = `${
				inputMapping.length ? `(${inputMapping.join(" & ")}) |` : ""
			} mono ${exePath}`;

			exec(monoCMD, (err, stdout, stderr) => {
				if (err) reject(err);

				if (stderr) reject(stderr);

				resolve({ outPath, stdout });
			});
		} catch (error) {
			reject(error);
		}
	});
};

const compileWithTestCase = function (src, testCases) {
	return new Promise(async (resolve, reject) => {
		try {
			const { srcPath, exePath, id } = await build(src);
		} catch (error) {
			reject(error);
		}
	});
};

const removeWithId = (path) => {
	fs.unlink(path, () => {});
};

module.exports = {
	makeOutPath,
	build,
	runWithPath,
	compile,
};
