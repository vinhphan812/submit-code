const { v1 } = require("uuid");
const base = "compilers";

const fs = require("fs");
const { exec } = require("child_process");

/**
 * @typedef {import("child_process").ExecException} ExecException
 */

/**
 * ignore string of error command being executed
 * @param err {ExecException} error when execute command
 * @returns {ExecException}
 */
const ignoreDisplayCmd = (err) => {
    let message = err.message;
    message = err.message.trim().split('\n');
    message.shift();
    message = message.join("\n");

    err.message = new String(message).replaceAll(base, "");


    return err;
}

/**
 * write code Csharp to file path
 * @param programPath {string}
 * @param programSource {string}
 * @returns {Promise<{programPath: string}>}
 * @author Phan Thanh Vinh <vinhphan812@gmail.com>
 */
const writeFile = function (programPath, programSource) {
    return new Promise((resolve, reject) => {
        fs.writeFile(programPath, programSource, (err) => {
            if (err) return reject(err);
            resolve({ programPath });
        });
    });
};

/**
 * BUILD FROM SOURCE CODE
 * <ol>
 *    <li>source string inserted into file <code>uuid.cs</code></li>
 *    <li>compile <code>uuid.cs<code> into <code>uuid.exe</code></li>
 *    <li>remove file <code>uuid.cs</code></li>
 * </ol>
 * @param {string} source source code C#
 * @returns {Promise<{exePath: string, id: string}>}
 * @author Phan Thanh Vinh <vinhphan812@gmail.com>
 */
const build = function (source) {
    const id = arguments.length > 1 ? arguments[1] : v1();
    return new Promise(async (resolve, reject) => {
        try {
            const path = `${ base }/${ id }`, srcPath = path + ".cs", exePath = path + ".exe";

            await writeFile(srcPath, source);

            const mcsCMD = `mcs -o ${ exePath } ${ srcPath }`;

            exec(mcsCMD, (err) => {
                if (err) {
                    removeFile(srcPath)
                    return reject(ignoreDisplayCmd(err));
                }

                removeFile(srcPath);

                resolve({ exePath, id });
            });
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};

/**
 *    Run file exe with input list
 *    <p>This is true only after compiling the code into <code>uuid.exe</code>. Compile code using [Function build]{@link build}</p>
 *    <ol>
 *        <li>create new input file by <code>{id}.txt</code></li>
 *        <li>
 *            <p>compile with <b>child_process</b> by command of <b>mono</b></p>
 *            <p>Example: <code>mono [exe file] &lt; [input file]</code></p>
 *        </li>
 *        <li>remove input file<`/li>
 *    </ol>
 * @param {string} exePath is a path .exe file after compile done
 * @param {string[]} input is a input list for programs run and result
 * @param {String} id is a id for testcase create new input file
 * @returns {Promise<{stdout: string}>}
 * @author Phan Thanh Vinh <vinhphan812@gmail.com>
 */
const runEXE = function (exePath, input, id) {
    if (!id)
        id = v1();
    return new Promise(async (resolve, reject) => {
        try {
            const inputMapping = input ? input.map((e) => e + "\n") : [];

            const { programPath } = await writeFile(`${ base }/${ id }.txt`, inputMapping.join(""));

            const monoCMD = `mono ${ exePath }<${ programPath }`;

            exec(monoCMD, (err, stdout, stderr) => {
                removeFile(programPath);
                if (err) reject(ignoreDisplayCmd(err));

                if (stderr) reject(stderr);

                stdout = stdout.trim().replaceAll("\r", "");

                resolve({ stdout });
            });
        } catch (error) {
            reject(error);
        }
    });
};

const removeFile = (path) => fs.unlink(path, () => {
});
/**
 * build, run test return result
 * @param {string} source source code CSharp
 * @param {Array<Object>} tcases [TestCase]{@link TestCase}
 * @returns {Promise<{result: Array<Object>}>}
 * @author Phan Thanh Vinh <vinhphan812@gmail.com>
 */
const run = (source, tcases) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { exePath, id } = await build(source);
            const result = [];
            let correctAll = true;

            for (const testCase of tcases) {
                const res = { id: testCase._id }
                try {
                    const { stdout } = await runEXE(exePath, testCase.input.match(/(?<=(['"])\b)(?:(?!\1|\\).|\\.)*(?=\1)/g) || [], testCase._id);
                    res.success = stdout == testCase.output;
                    if (!res.success) correctAll = false;
                    res.output = stdout;
                } catch (err) {
                    res.success = false;
                    res.output = err.message;
                }
                result.push(res);
            }

            removeFile(exePath);
            resolve({ result, correctAll });
        } catch (error) {
            // removeFile(exePath);
            reject(error);
        }
    });
};

module.exports = {
    removeFile, build, runEXE, run,
};


