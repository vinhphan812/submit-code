Onload = () => {
    const unit = "Test Case ";
    $("form").submit((e) => {
        const $testCases = $("input[name='test_cases']");
        const value = [];

        const $inpExersice = $("input[name='test_case']");
        const $inpInput = $("input[name='input']");

        $inpExersice.each((i, e) => {
            value.push({
                name: e.value, input: $inpInput[i].value,
            });
        });
        $testCases.val(JSON.stringify(value));
        table.rows().remove().draw();
        return true;
    });

    $("#generator").keyup((e) => {
        validateTemplate(e.target.value);
    });

    $(".add").click((e) => {
        const index = table.rows()[0].length + 1;
        table.row
            .add([index, renderInput("test_case", unit + index, "Bài tập..."), renderInput("input", "", 'input viết cách nhau ","'), renderTextArea("output", "", "parse output vào đây"), null,])
            .draw();
    });

    $("input#number").change((e) => {
        const length = +e.target.value;

        const generator = $("#generator").val();

        if (validateTemplate(generator)) return;

        table.rows().remove().draw();

        for (let i = 1; i <= length; i++) {
            let input = "";

            if (generator) input = inputGenerator(generator);

            table.row
                .add([i, renderInput("test_case", unit + i, "Bài tập..."), renderInput("input", input, 'input viết cách nhau ","'), renderTextArea("output", "", "parse output vào đây"), null,])
                .draw();
        }
    });
};

function inputGenerator(template) {
    let inputs = template.match(/(?<=(['"])\b)(?:(?!\1|\\).|\\.)*(?=\1)/g);
    return generatorWithTemplate(inputs);
}

function validateTemplate(template) {
    const $checker = $("#checker");

    let inputs = template.match(/(?<=(['"])\b)(?:(?!\1|\\).|\\.)*(?=\1)/g);

    if (!inputs) return displayFeedback($checker);

    if (!inputs.length) return displayFeedback($checker);

    for (let i = 0; i < inputs.length; i++) {
    }

    const example = generatorWithTemplate(inputs);
    displayFeedback($checker, true, example);
}

function displayFeedback(el, isValid, example) {
    el.addClass("d-block");
    el.addClass(isValid ? "valid-feedback" : "invalid-feedback");
    el.removeClass(!isValid ? "valid-feedback" : "invalid-feedback");
    el.text(isValid ? `Correct: ${ example }` : "Invalid!");
}

function generatorWithTemplate(inputs) {
    let out = [];

    try {
        for (const item of inputs) {
            let matchType = item.match(/(?<=_).*?(?=$)/g);

            if (matchType) {
                out.push(generatorByType(matchType[0].trim(), out));
            }
        }
    } catch (err) {
    }

    return out
        .flat()
        .map((e) => `"${ e }"`)
        .join(" ");
}

function generatorByType(type, currentResult) {
    let result = "";
    try {
        const matchProperty = type.match(/(?<={).*?(?=})/g);
        const matchType = type.match(/(?=^).*?(?={|$)/g);

        if (!matchType) throw new Error("Regex Type Exception");

        const property = matchProperty && matchProperty.length > 0 ? toJSON(matchProperty[0], currentResult) : {};
        switch (matchType[0].toLowerCase()) {
            case "string":
                const string = new randomString(property);
                result = string.next();
                break;
            case "number":
            case "int":
                const int = new randomInt(property);
                result = int.next();
                break;
            case "float":
                const float = new randomFloat(property);
                result = float.next();
                break;
            case "int[]":
                property.datatype = "int";

                const intList = new randomList(property);
                result = intList.next();
                break;
            case "float[]":
                property.datatype = "float";

                const floatList = new randomList(property);

                result = floatList.next();
                break;
            case "bool":
            case "boolean":
                result = Math.random() > 0.5;
                break;
            default:
                const arg = +matchType[0];
                if (!isNaN(arg)) {
                    result = currentResult[arg];
                }

                if (!result) result = `${ matchType[0] } Not match`;
        }
        if (property.type == "inline" && result instanceof Array) return result.join(" "); else return result;
    } catch (e) {
        console.log(e);
        throw e;
    }
}

function toJSON(str, currentResult) {
    const obj = {};
    str = str.split(",");
    for (const item of str) {
        const data = item.split(":");
        let [key, value] = data.map((e) => e.trim());

        if (key == undefined || value == undefined) continue;

        const ref = value.match(/(?<=_ref\[).*(?=\])/g);

        obj[key] = ref ? currentResult[ref[0]] : isNaN(+value) ? value : +value;
    }

    return obj;
}

function randomString({ length, template, wspSize }) {
    this.length = length || 10;
    this.template = template;
    this.wspSize = wspSize || -1;
    this.chars = "abcdefghijklmnopqrstuvwxyz";
    const randChar = () => {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    };
    return {
        next: () => {
            let result = "";

            for (let i = 0; i < (this.template ? this.template.length : this.length); i++) {
                if (this.wspSize > 0 && (i + 1) % (this.wspSize + 1) == 0) {
                    result += " ";
                } else result += this.template ? this.template[i] == "#" ? randChar() : " " : randChar();
            }
            return result;
        },
    };
}

function randomFloat({ min, max, decimals }) {
    this.max = max || 20;
    this.min = min || 0;
    this.decimals = decimals || 5;
    return {
        next: () => {
            return (Math.random() * (this.max - this.min) + this.min).toFixed(this.decimals);
        },
    };
}

function randomInt({ min, max }) {
    this.min = min || 0;
    this.max = max || 20;
    return {
        next: () => {
            return Math.floor(Math.random() * (this.max - this.min + 1) + this.min);
        },
    };
}

function randomList({ min, max, length, datatype, decimals }) {
    this.length = length || 5;
    this.rand = datatype == "int" ? new randomInt({ max, min }) : new randomFloat({ max, min, decimals });
    return {
        next: () => {
            const result = [];
            for (let i = 0; i < this.length; i++) result.push(this.rand.next());
            return result;
        },
    };
}
